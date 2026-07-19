import type { Channel } from '../types/channel';

// These are known-public fallback URLs only.
// IndiHome CDN (cdn09jtedge.indihometv.com) URLs are deliberately excluded —
// they require an active IndiHome subscription and return HTML instead of M3U8.
// Live data is fetched from iptv-org or duktek.id at runtime.

export const indonesiaChannels: Channel[] = [
  {
    id: 'indosiar',
    name: 'Indosiar',
    tagline: 'Televisi Masa Kini',
    url: 'https://indihuy.streamized.net/atm/DASH/indosiar/manifest.mpd',
    type: 'dash',
    category: 'indonesia',
    headers: {
      'Referer': 'https://maxstream.tv/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    },
  },
  {
    id: 'rcti',
    name: 'RCTI',
    tagline: 'Rajawali Citra Televisi Indonesia',
    url: 'https://indihuy.streamized.net/atm/DASH/rcti/manifest.mpd',
    type: 'dash',
    category: 'indonesia',
    headers: {
      'Referer': 'https://maxstream.tv/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    },
  },
  {
    id: 'sctv',
    name: 'SCTV',
    tagline: 'Satu untuk Semua',
    url: 'https://op-group1-swiftservehd-1.dens.tv/h/h217/index.m3u8',
    type: 'hls',
    category: 'indonesia',
    headers: {
      'Referer': 'https://www.dens.tv/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    },
  },
  {
    id: 'mnctv',
    name: 'MNCTV',
    tagline: 'Saluran Hiburan Keluarga',
    url: 'https://indihuy.streamized.net/atm/DASH/mnctv/manifest.mpd',
    type: 'dash',
    category: 'indonesia',
    headers: {
      'Referer': 'https://maxstream.tv/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    },
  },
  {
    id: 'trans7',
    name: 'Trans7',
    tagline: 'Referensi Terpercaya',
    url: 'https://video.detik.com/trans7/smil:trans7.smil/chunklist.m3u8',
    type: 'hls',
    category: 'indonesia',
    headers: {
      'Referer': 'https://www.trans7.co.id/',
    },
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
