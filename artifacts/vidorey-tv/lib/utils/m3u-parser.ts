import type { CategoryId, Channel, StreamType } from '../types/channel';

/**
 * Parse IPTV M3U playlist into Channel objects.
 *
 * Supported format:
 *   #EXTM3U
 *   #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..." group-title="...",Channel Name
 *   http://stream.url/live.m3u8
 */

// Map group-title → CategoryId
const GROUP_CATEGORY_MAP: Record<string, CategoryId> = {
  // Indonesia
  indonesia: 'indonesia',
  'indonesia tv': 'indonesia',
  indonesian: 'indonesia',
  'tv indonesia': 'indonesia',
  lokal: 'indonesia',
  nasional: 'indonesia',
  'berita indonesia': 'indonesia',

  // TVRI
  tvri: 'tvri',
  'tvri regional': 'tvri',
  'tvri daerah': 'tvri',
  'tvri nasional': 'tvri',
  'stasiun daerah': 'tvri',

  // Sports
  sports: 'sports',
  sport: 'sports',
  olahraga: 'sports',
  'sport & olahraga': 'sports',
  'sports & fitness': 'sports',
  football: 'sports',
  racing: 'sports',
  esports: 'sports',

  // Korea
  korea: 'korea',
  korean: 'korea',
  'korea tv': 'korea',
  'korean tv': 'korea',
  kpop: 'korea',

  // Malaysia
  malaysia: 'malaysia',
  'malaysia tv': 'malaysia',
  malaysian: 'malaysia',

  // Kids
  kids: 'kids',
  anak: 'kids',
  'tv anak': 'kids',
  kartun: 'kids',
  children: 'kids',
  cartoon: 'kids',

  // World / International — catch-all
  world: 'world',
  international: 'world',
  'international tv': 'world',
  news: 'world',
  'world news': 'world',
  entertainment: 'world',
  lifestyle: 'world',
  discovery: 'world',
  documentary: 'world',
};

function inferCategory(group: string): CategoryId {
  const key = group.toLowerCase().trim();
  if (GROUP_CATEGORY_MAP[key]) return GROUP_CATEGORY_MAP[key];
  // Partial match
  for (const [pattern, cat] of Object.entries(GROUP_CATEGORY_MAP)) {
    if (key.includes(pattern) || pattern.includes(key)) return cat;
  }
  return 'world';
}

function inferStreamType(url: string): StreamType {
  const lower = url.toLowerCase();
  if (lower.includes('.m3u8') || lower.includes('hls') || lower.includes('m3u8')) return 'hls';
  if (lower.includes('.mpd') || lower.includes('dash')) return 'dash';
  if (lower.includes('.ts')) return 'ts';
  return 'hls'; // default for live TV
}

function extractAttr(line: string, attr: string): string {
  // Handles: attr="value" or attr=value
  const quoted = new RegExp(`${attr}="([^"]*)"`, 'i').exec(line);
  if (quoted) return quoted[1];
  const unquoted = new RegExp(`${attr}=([^\\s,]+)`, 'i').exec(line);
  if (unquoted) return unquoted[1];
  return '';
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function parseM3U(content: string): Channel[] {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  const seenIds = new Set<string>();

  let i = 0;
  // Skip header
  if (lines[0]?.trim().startsWith('#EXTM3U')) i = 1;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF attributes
      const commaIdx = line.lastIndexOf(',');
      const attrPart = commaIdx >= 0 ? line.slice(0, commaIdx) : line;
      const channelName = commaIdx >= 0 ? line.slice(commaIdx + 1).trim() : '';

      const tvgId = extractAttr(attrPart, 'tvg-id');
      const tvgName = extractAttr(attrPart, 'tvg-name') || channelName;
      const tvgLogo = extractAttr(attrPart, 'tvg-logo');
      const groupTitle = extractAttr(attrPart, 'group-title');

      // Find next non-comment, non-empty line as the stream URL
      let url = '';
      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j].trim();
        if (next && !next.startsWith('#')) {
          url = next;
          i = j; // advance outer loop
          break;
        }
        j++;
      }

      if (!url) { i++; continue; }

      const displayName = tvgName || channelName || 'Unknown Channel';
      const category = inferCategory(groupTitle);

      // Generate stable ID
      let id = tvgId ? slugify(tvgId) : slugify(displayName);
      if (!id) id = slugify(url.slice(-40));
      // Deduplicate
      const baseId = id;
      let suffix = 1;
      while (seenIds.has(id)) {
        id = `${baseId}-${suffix++}`;
      }
      seenIds.add(id);

      channels.push({
        id,
        name: displayName,
        tagline: groupTitle || undefined,
        url,
        type: inferStreamType(url),
        category,
        logo: tvgLogo || undefined,
      });
    }

    i++;
  }

  return channels;
}

/**
 * Try to parse channel list as JSON first, then M3U.
 * Some providers return JSON arrays instead of M3U.
 */
export function parseChannelList(content: string): Channel[] {
  const trimmed = content.trim();

  // Try JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const data = JSON.parse(trimmed);
      const items: unknown[] = Array.isArray(data) ? data : (data.data ?? data.channels ?? []);
      if (Array.isArray(items) && items.length > 0) {
        const channels: Channel[] = [];
        const seenIds = new Set<string>();
        for (const item of items as Record<string, unknown>[]) {
          const url = (item.url ?? item.stream_url ?? item.streamUrl ?? '') as string;
          if (!url) continue;
          const name = (item.name ?? item.title ?? item.channelName ?? 'Unknown') as string;
          const group = (item.group ?? item.category ?? item.group_title ?? '') as string;
          const logo = (item.logo ?? item.imageUrl ?? item.image ?? item.icon ?? '') as string;
          const tvgId = (item.id ?? item.tvg_id ?? '') as string;
          const category = inferCategory(group);
          let id = tvgId ? slugify(tvgId) : slugify(name);
          const baseId = id || 'ch';
          let suffix = 1;
          while (seenIds.has(id)) id = `${baseId}-${suffix++}`;
          seenIds.add(id);
          channels.push({
            id,
            name,
            tagline: group || undefined,
            url,
            type: inferStreamType(url),
            category,
            logo: logo || undefined,
          });
        }
        if (channels.length > 0) return channels;
      }
    } catch {
      // Fall through to M3U
    }
  }

  // Try M3U
  if (trimmed.startsWith('#EXTM3U') || trimmed.includes('#EXTINF')) {
    return parseM3U(trimmed);
  }

  return [];
}
