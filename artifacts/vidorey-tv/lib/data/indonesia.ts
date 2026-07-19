import type { Channel } from '../types/channel';

/**
 * Static Indonesia channel fallback.
 *
 * Only publicly-accessible streams are listed here — no IndiHome CDN
 * (cdn09jtedge.indihometv.com requires subscriber auth tokens).
 * IndiHome-CDN channels (Indosiar, RCTI, SCTV, ANTV, MNCTV…) are
 * served at runtime by duktek.id with fresh authenticated URLs.
 */

export const indonesiaChannels: Channel[] = [
  {
    id: 'trans7',
    name: 'Trans7',
    tagline: 'Lebih Beragam, Lebih Seru!',
    // playlist.m3u8 is the multi-bitrate master; works without Referer
    url: 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'transtv',
    name: 'TransTV',
    tagline: 'Milik Kita Bersama',
    url: 'https://video.detik.com/transtv/smil:transtv.smil/playlist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'metro-tv',
    name: 'MetroTV',
    tagline: 'Knowledge to Elevate',
    url: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8',
    type: 'hls',
    category: 'indonesia',
  },
];
