import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchChannelList, fetchDuktekConfig } from '../services/duktek';
import { parseChannelList } from '../utils/m3u-parser';
import {
  ALL_CHANNELS as STATIC_CHANNELS,
  CATEGORY_ORDER as STATIC_ORDER,
  CHANNELS_BY_CATEGORY as STATIC_BY_CAT,
  getFeaturedChannels as getStaticFeatured,
} from '../data';
import type { CategoryId, Channel } from '../types/channel';
import { CATEGORIES } from '../types/channel';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface ChannelStore {
  channels: Channel[];
  channelMap: Map<string, Channel>;
  byCategory: Partial<Record<CategoryId, Channel[]>>;
  categoryOrder: CategoryId[];
  status: LoadStatus;
  error: string | null;
  lastFetchedAt: number | null;
  refresh: () => Promise<void>;
}

const ChannelContext = createContext<ChannelStore | null>(null);

/** Derive available categories from the fetched channel list */
function buildCategoryOrder(byCategory: Partial<Record<CategoryId, Channel[]>>): CategoryId[] {
  const order: CategoryId[] = ['indonesia', 'tvri', 'sports', 'korea', 'world', 'malaysia', 'kids'];
  return order.filter((id) => (byCategory[id]?.length ?? 0) > 0);
}

function groupByCategory(channels: Channel[]): Partial<Record<CategoryId, Channel[]>> {
  const result: Partial<Record<CategoryId, Channel[]>> = {};
  for (const ch of channels) {
    if (!result[ch.category]) result[ch.category] = [];
    result[ch.category]!.push(ch);
  }
  return result;
}

/** Pick featured channels — prefer known IDs, fall back to first per category */
function pickFeatured(
  channelMap: Map<string, Channel>,
  byCategory: Partial<Record<CategoryId, Channel[]>>,
): Channel[] {
  const preferred = [
    'tvri-nasional', 'tvri_nasional', 'tvri',
    'redbull-tv', 'red-bull-tv',
    'indosiar',
    'arirang', 'arirang-tv',
    'sky-news-arabia', 'al-jazeera', 'cnn-international', 'bbc-world',
  ];

  const featured: Channel[] = [];
  for (const id of preferred) {
    const ch = channelMap.get(id);
    if (ch && !featured.includes(ch)) {
      featured.push(ch);
      if (featured.length >= 5) break;
    }
  }

  // Pad from categories if we don't have 5 yet
  if (featured.length < 5) {
    const catOrder: CategoryId[] = ['indonesia', 'tvri', 'sports', 'korea', 'world'];
    for (const cat of catOrder) {
      const catChannels = byCategory[cat] ?? [];
      for (const ch of catChannels) {
        if (!featured.includes(ch)) {
          featured.push(ch);
          if (featured.length >= 5) break;
        }
      }
      if (featured.length >= 5) break;
    }
  }

  return featured.slice(0, 5);
}

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>(STATIC_CHANNELS);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const config = await fetchDuktekConfig();
      const channelListUrl = config.channel_list_url ?? config.premium_channel_list_url;
      if (!channelListUrl) {
        throw new Error('No channel_list_url in config response');
      }
      const raw = await fetchChannelList(channelListUrl);
      const parsed = parseChannelList(raw);
      if (parsed.length === 0) {
        throw new Error('Channel list is empty or could not be parsed');
      }
      setChannels(parsed);
      setLastFetchedAt(Date.now());
      setStatus('success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus('error');
      // Keep existing channels (static or previously fetched)
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const channelMap = useMemo(() => {
    const map = new Map<string, Channel>();
    for (const ch of channels) map.set(ch.id, ch);
    return map;
  }, [channels]);

  const byCategory = useMemo(() => groupByCategory(channels), [channels]);
  const categoryOrder = useMemo(() => buildCategoryOrder(byCategory), [byCategory]);

  const store = useMemo<ChannelStore>(
    () => ({ channels, channelMap, byCategory, categoryOrder, status, error, lastFetchedAt, refresh }),
    [channels, channelMap, byCategory, categoryOrder, status, error, lastFetchedAt, refresh],
  );

  return <ChannelContext.Provider value={store}>{children}</ChannelContext.Provider>;
}

/** Hook — use inside ChannelProvider */
export function useChannelStore(): ChannelStore {
  const ctx = useContext(ChannelContext);
  if (!ctx) throw new Error('useChannelStore must be used inside <ChannelProvider>');
  return ctx;
}

/** Convenience helpers that mirror the old static API */
export function useAllChannels(): Channel[] {
  return useChannelStore().channels;
}

export function useChannelById(id: string): Channel | undefined {
  return useChannelStore().channelMap.get(id);
}

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
