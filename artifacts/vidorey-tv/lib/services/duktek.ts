/**
 * Channel data sources — ordered by priority:
 * 1. duktek.id (original APK backend — may fail if is_genuine hash is wrong)
 * 2. iptv-org Indonesian playlist (public, community-maintained, always updated)
 * 3. Static fallback in lib/data/
 */

const BASE_URL = 'https://duktek.id';
const DEVICE = 'bittvnew';
const IS_GENUINE = '1';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Referer': `${BASE_URL}/`,
  'Origin': BASE_URL,
  'Accept': 'application/json, text/plain, */*',
};

export interface DuktekConfig {
  channel_list_url?: string;
  premium_channel_list_url?: string;
  [key: string]: unknown;
}

/** Fetch app config from duktek.id */
export async function fetchDuktekConfig(): Promise<DuktekConfig> {
  const url = `${BASE_URL}/?device=${DEVICE}&is_genuine=${IS_GENUINE}`;
  const response = await fetch(url, {
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`Config fetch failed: HTTP ${response.status}`);
  const json = await response.json() as Record<string, unknown>;
  // Validate it actually looks like a config (not an HTML error page)
  if (!json.channel_list_url && !json.premium_channel_list_url) {
    throw new Error('Config response missing channel_list_url');
  }
  return json as DuktekConfig;
}

/** Fetch channel list M3U/JSON from the duktek config URL */
export async function fetchChannelList(channelListUrl: string): Promise<string> {
  const response = await fetch(channelListUrl, {
    headers: { ...BROWSER_HEADERS, 'Referer': `${BASE_URL}/` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Channel list fetch failed: HTTP ${response.status}`);
  return response.text();
}

/**
 * iptv-org public IPTV playlists — community-maintained, verified streams.
 * These are the fallback when duktek.id is unavailable.
 */
export const IPTV_ORG_PLAYLISTS = {
  // Full Indonesian channel list (Indosiar, SCTV, Trans7, MetroTV, TVONE, etc.)
  indonesia: 'https://iptv-org.github.io/iptv/countries/id.m3u',
  // Korean channels (KBS, MBC, SBS, Arirang, etc.)
  korea: 'https://iptv-org.github.io/iptv/countries/kr.m3u',
  // Malaysian channels
  malaysia: 'https://iptv-org.github.io/iptv/countries/my.m3u',
};

export async function fetchIptvOrgPlaylist(url: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`iptv-org fetch failed: HTTP ${response.status}`);
  return response.text();
}
