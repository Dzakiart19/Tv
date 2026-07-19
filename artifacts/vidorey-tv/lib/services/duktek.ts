/**
 * Channel data sources — ordered by priority:
 * 1. duktek.id (original APK backend — may fail if is_genuine hash is wrong)
 * 2. iptv-org Indonesian playlist (public, community-maintained, always updated)
 * 3. Static fallback in lib/data/
 */

const BASE_URL = 'https://duktek.id';
const DEVICE = 'bittvnew';
// SHA-1 fingerprint of the APK signing certificate (extracted from APK v2 signing block)
const IS_GENUINE = 'a6615402e505dd28666f01eefba59b7c78241d36';

const BROWSER_HEADERS = {
  // Match exactly what Android WebView sends for this APK
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 12; sdk_gphone64_x86_64 Build/SE1A.220630.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36',
  // Android WebView automatically appends the app's package name — servers use this to auth
  'X-Requested-With': 'com.live_streaming_tv.online_tv',
  'Referer': `${BASE_URL}/`,
  'Origin': BASE_URL,
  'Accept': 'application/json, text/plain, */*',
};

export interface DuktekConfig {
  channel_list_url?: string;
  premium_channel_list_url?: string;
  [key: string]: unknown;
}

/** AbortController-based timeout compatible with Hermes (React Native) */
function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/** Fetch app config from duktek.id */
export async function fetchDuktekConfig(): Promise<DuktekConfig> {
  const url = `${BASE_URL}/?device=${DEVICE}&is_genuine=${IS_GENUINE}`;
  console.log('[duktek] Fetching config:', url);
  let response: Response;
  try {
    response = await fetchWithTimeout(url, { headers: BROWSER_HEADERS }, 12_000);
  } catch (e) {
    console.error('[duktek] Network error:', e instanceof Error ? e.message : String(e));
    throw e;
  }
  if (!response.ok) {
    console.error('[duktek] HTTP error:', response.status, response.statusText);
    throw new Error(`Config fetch failed: HTTP ${response.status}`);
  }
  const text = await response.text();
  console.log('[duktek] Response (first 300 chars):', text.slice(0, 300));
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    console.error('[duktek] Response is not JSON. Content-type:', response.headers.get('content-type'));
    throw new Error('duktek.id response is not JSON');
  }
  console.log('[duktek] JSON keys:', Object.keys(json).join(', '));
  if (!json.channel_list_url && !json.premium_channel_list_url) {
    console.error('[duktek] Missing channel_list_url. Full response:', JSON.stringify(json).slice(0, 500));
    throw new Error('Config response missing channel_list_url');
  }
  return json as DuktekConfig;
}

/** Fetch channel list M3U/JSON from the duktek config URL */
export async function fetchChannelList(channelListUrl: string): Promise<string> {
  const response = await fetchWithTimeout(
    channelListUrl,
    { headers: { ...BROWSER_HEADERS, 'Referer': `${BASE_URL}/` } },
    20_000,
  );
  if (!response.ok) throw new Error(`Channel list fetch failed: HTTP ${response.status}`);
  return response.text();
}

/**
 * iptv-org public IPTV playlists — community-maintained, verified streams.
 * Fallback when duktek.id is unavailable.
 */
export const IPTV_ORG_PLAYLISTS = {
  indonesia: 'https://iptv-org.github.io/iptv/countries/id.m3u',
  korea: 'https://iptv-org.github.io/iptv/countries/kr.m3u',
  malaysia: 'https://iptv-org.github.io/iptv/countries/my.m3u',
};

export async function fetchIptvOrgPlaylist(url: string): Promise<string> {
  const response = await fetchWithTimeout(url, {}, 20_000);
  if (!response.ok) throw new Error(`iptv-org fetch failed: HTTP ${response.status}`);
  return response.text();
}
