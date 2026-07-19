import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchChannelList,
  fetchDuktekConfig,
  fetchIptvOrgPlaylist,
  IPTV_ORG_PLAYLISTS,
} from '../services/duktek';
import { parseChannelList } from '../utils/m3u-parser';
import { ALL_CHANNELS as STATIC_CHANNELS } from '../data';
import type { CategoryId, Channel } from '../types/channel';
import { CATEGORIES } from '../types/channel';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
export type DataSource = 'duktek' | 'iptv-org' | 'static';

interface ChannelStore {
  channels: Channel[];
  channelMap: Map<string, Channel>;
  byCategory: Partial<Record<CategoryId, Channel[]>>;
  categoryOrder: CategoryId[];
  status: LoadStatus;
  source: DataSource;
  error: string | null;
  refresh: () => Promise<void>;
}

const ChannelContext = createContext<ChannelStore | null>(null);

function groupByCategory(channels: Channel[]): Partial<Record<CategoryId, Channel[]>> {
  const result: Partial<Record<CategoryId, Channel[]>> = {};
  for (const ch of channels) {
    if (!result[ch.category]) result[ch.category] = [];
    result[ch.category]!.push(ch);
  }
  return result;
}

const CAT_ORDER: CategoryId[] = ['indonesia', 'tvri', 'sports', 'korea', 'world', 'malaysia', 'kids'];

function buildCategoryOrder(byCategory: Partial<Record<CategoryId, Channel[]>>): CategoryId[] {
  return CAT_ORDER.filter((id) => (byCategory[id]?.length ?? 0) > 0);
}

function pickFeatured(
  channelMap: Map<string, Channel>,
  byCategory: Partial<Record<CategoryId, Channel[]>>,
): Channel[] {
  const preferred = [
    'tvri-nasional', 'tvri_nasional',
    'redbull-tv', 'red-bull-tv',
    'indosiar', 'trans7', 'transtv', 'rcti', 'sctv', 'mnc-tv',
    'arirang', 'arirang-tv',
    'sky-news-arabia', 'al-jazeera', 'cnn-international',
  ];
  const featured: Channel[] = [];
  for (const id of preferred) {
    const ch = channelMap.get(id);
    if (ch && !featured.includes(ch)) { featured.push(ch); if (featured.length >= 5) break; }
  }
  if (featured.length < 5) {
    for (const cat of CAT_ORDER) {
      for (const ch of byCategory[cat] ?? []) {
        if (!featured.includes(ch)) { featured.push(ch); if (featured.length >= 5) break; }
      }
      if (featured.length >= 5) break;
    }
  }
  return featured.slice(0, 5);
}

/** Merge iptv-org results with static data, deduplicating by channel name */
function mergeWithStatic(dynamic: Channel[], staticChannels: Channel[]): Channel[] {
  const dynamicNames = new Set(dynamic.map((c) => c.name.toLowerCase().trim()));
  const extra = staticChannels.filter((c) => !dynamicNames.has(c.name.toLowerCase().trim()));
  return [...dynamic, ...extra];
}

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>(STATIC_CHANNELS);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [source, setSource] = useState<DataSource>('static');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);

    // ── 1. Try duktek.id ──────────────────────────────────────────
    try {
      const config = await fetchDuktekConfig();
      const listUrl = config.channel_list_url ?? config.premium_channel_list_url;
      if (!listUrl) throw new Error('No channel_list_url in config');
      const raw = await fetchChannelList(listUrl);
      const parsed = parseChannelList(raw);
      if (parsed.length > 0) {
        setChannels(parsed);
        setSource('duktek');
        setStatus('success');
        return;
      }
    } catch {
      // duktek.id failed — try iptv-org next
    }

    // ── 2. Try iptv-org (Indonesia + Korea + Malaysia in parallel) ─
    try {
      const [idRaw, krRaw, myRaw] = await Promise.allSettled([
        fetchIptvOrgPlaylist(IPTV_ORG_PLAYLISTS.indonesia),
        fetchIptvOrgPlaylist(IPTV_ORG_PLAYLISTS.korea),
        fetchIptvOrgPlaylist(IPTV_ORG_PLAYLISTS.malaysia),
      ]);

      const allDynamic: Channel[] = [];
      for (const result of [idRaw, krRaw, myRaw]) {
        if (result.status === 'fulfilled') {
          allDynamic.push(...parseChannelList(result.value));
        }
      }

      if (allDynamic.length > 0) {
        // Merge with static (TVRI, sports, world) to fill gaps
        const merged = mergeWithStatic(allDynamic, STATIC_CHANNELS);
        setChannels(merged);
        setSource('iptv-org');
        setStatus('success');
        return;
      }
    } catch {
      // iptv-org also failed
    }

    // ── 3. Static fallback ────────────────────────────────────────
    setSource('static');
    setStatus('error');
    setError('Tidak bisa memuat data terbaru. Menampilkan channel bawaan.');
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const channelMap = useMemo(() => {
    const map = new Map<string, Channel>();
    for (const ch of channels) map.set(ch.id, ch);
    return map;
  }, [channels]);

  const byCategory = useMemo(() => groupByCategory(channels), [channels]);
  const categoryOrder = useMemo(() => buildCategoryOrder(byCategory), [byCategory]);

  const store = useMemo<ChannelStore>(
    () => ({ channels, channelMap, byCategory, categoryOrder, status, source, error, refresh }),
    [channels, channelMap, byCategory, categoryOrder, status, source, error, refresh],
  );

  return <ChannelContext.Provider value={store}>{children}</ChannelContext.Provider>;
}

export function useChannelStore(): ChannelStore {
  const ctx = useContext(ChannelContext);
  if (!ctx) throw new Error('useChannelStore must be used inside <ChannelProvider>');
  return ctx;
}

export function useAllChannels(): Channel[] { return useChannelStore().channels; }
export function useChannelById(id: string): Channel | undefined { return useChannelStore().channelMap.get(id); }

export function useCategoryRows() {
  const { byCategory, categoryOrder } = useChannelStore();
  return categoryOrder.map((id) => ({ id, channels: byCategory[id] ?? [] }));
}

export function useFeaturedChannels(): Channel[] {
  const { channelMap, byCategory } = useChannelStore();
  return useMemo(() => pickFeatured(channelMap, byCategory), [channelMap, byCategory]);
}

export function useSearchChannels(query: string): Channel[] {
  const { channels } = useChannelStore();
  return useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return channels.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) ||
        ch.tagline?.toLowerCase().includes(q) ||
        ch.category.toLowerCase().includes(q),
    );
  }, [channels, query]);
}

export { CATEGORIES };
export type { CategoryId, Channel };
