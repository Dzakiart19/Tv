/**
 * Duktek.id API service
 * Reverse-engineered from base.apk (com.live_streaming_tv.online_tv)
 */

const BASE_URL = 'https://duktek.id';
const DEVICE = 'bittvnew';
const IS_GENUINE = '1';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Referer': `${BASE_URL}/`,
  'Origin': BASE_URL,
  'Accept': 'application/json, text/plain, */*',
};

export interface DuktekConfig {
  channel_list_url?: string;
  premium_channel_list_url?: string;
  channel_administrator_url?: string;
  countrylist?: unknown;
  full_url_iklan?: string;
  durasi_jeda_iklan_init?: number;
  durasi_jeda_iklan_pindah_channel?: number;
  durasi_jeda_iklan_putar_video?: number;
  link_bio?: string;
  link_buymeacoffee?: string;
  link_saweria?: string;
  url_saweria?: string;
  [key: string]: unknown;
}

/**
 * Fetch app config from duktek.id
 * URL: https://duktek.id/?device=bittvnew&is_genuine=1
 */
export async function fetchDuktekConfig(): Promise<DuktekConfig> {
  const url = `${BASE_URL}/?device=${DEVICE}&is_genuine=${IS_GENUINE}`;
  const response = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Config fetch failed: HTTP ${response.status}`);
  }
  return response.json() as Promise<DuktekConfig>;
}

/**
 * Fetch channel list from the URL provided in config.
 * The APK appends '.json' when fetching channel metadata,
 * but the main playlist may be M3U or JSON.
 */
export async function fetchChannelList(channelListUrl: string): Promise<string> {
  const response = await fetch(channelListUrl, {
    headers: { ...HEADERS, 'Referer': `${BASE_URL}/` },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Channel list fetch failed: HTTP ${response.status}`);
  }
  return response.text();
}
