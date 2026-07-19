import type { Channel } from '../types/channel';

// These are known-public fallback URLs only.
// IndiHome CDN (cdn09jtedge.indihometv.com) URLs are deliberately excluded —
// they require an active IndiHome subscription and return HTML instead of M3U8.
// Live data is fetched from iptv-org or duktek.id at runtime.

export const indonesiaChannels: Channel[] = [
  {
    id: 'trans7',
    name: 'Trans7',
    tagline: 'Referensi Terpercaya',
    url: 'https://video.detik.com/trans7/smil:trans7.smil/chunklist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'transtv',
    name: 'TransTV',
    tagline: 'Milik Kita Bersama',
    url: 'https://livestream.transtv.co.id/stream/live/ttv.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'metro-tv',
    name: 'Metro TV',
    tagline: 'Knowledge to Elevate',
    url: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'nusantara-tv',
    name: 'Nusantara TV',
    tagline: 'TV Digital Indonesia',
    url: 'https://nusantaratv.siar.us/nusantaratv/live/playlist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'rodja-tv',
    name: 'Rodja TV',
    tagline: 'Televisi Dakwah',
    url: 'https://rodjatv.com/rodjatv/live.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'rctv-cirebon',
    name: 'RCTV Cirebon',
    tagline: 'Radar Cirebon TV',
    url: 'https://v10.siar.us/rctv/live/playlist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
];
