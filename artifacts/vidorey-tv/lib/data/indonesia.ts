import type { Channel } from '../types/channel';

/**
 * Static Indonesia channel fallback.
 *
 * IndiHome CDN (cdn09jtedge.indihometv.com) URLs are IP-restricted:
 *   - From IndiHome subscriber networks → returns valid HLS stream ✅
 *   - From other networks → returns "No route" (HTTP 200 but no content)
 * So these URLs work correctly on IndiHome WiFi/broadband.
 *
 * Non-CDN URLs (detik.com, transtv.co.id, etc.) are publicly accessible.
 * Live data with fresh URLs is fetched from duktek.id at runtime.
 */

const INDIHOME_CDN = 'https://cdn09jtedge.indihometv.com/atm/hlsv3';
const INDIHOME_SUFFIX = '-avc1_1200000=4-mp4a.40.2_192000=2.m3u8';
function ihUrl(ch: string): string {
  return `${INDIHOME_CDN}/${ch}/${ch}${INDIHOME_SUFFIX}`;
}

export const indonesiaChannels: Channel[] = [
  {
    id: 'indosiar',
    name: 'Indosiar',
    tagline: 'Memang Untuk Anda',
    url: ihUrl('indosiar'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'rcti',
    name: 'RCTI',
    tagline: 'Kebanggaan bersama milik bangsa',
    url: ihUrl('rcti'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'sctv',
    name: 'SCTV',
    tagline: 'Satu Untuk Semua',
    url: ihUrl('sctv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'mnctv',
    name: 'MNCTV',
    tagline: 'Selalu di Hati',
    url: ihUrl('mnctv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'antv',
    name: 'ANTV',
    tagline: 'Makin Keren',
    url: ihUrl('antv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'gtv',
    name: 'GTV',
    tagline: 'Pilihan terbaik keluarga Indonesia',
    url: ihUrl('gtv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'trans7',
    name: 'Trans7',
    tagline: 'Lebih Beragam, Lebih Seru!',
    url: ihUrl('trans7'),
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
    url: ihUrl('transtv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'metro-tv',
    name: 'MetroTV',
    tagline: 'Knowledge to Elevate',
    url: ihUrl('metrotv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'tvone',
    name: 'tvOne',
    tagline: 'Terdepan Mengabarkan',
    url: ihUrl('tvone'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'kompastv',
    name: 'KompasTV',
    tagline: 'Independen, Terpercaya',
    url: ihUrl('kompastv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'inews',
    name: 'iNews',
    tagline: 'Inspiring & Informative',
    url: ihUrl('inews'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'cnnindonesia',
    name: 'CNN Indonesia',
    tagline: 'Terpercaya & Terdepan',
    url: ihUrl('cnnindonesia'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'net',
    name: 'NET.',
    tagline: 'The Future is Now',
    url: ihUrl('net'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'rtv',
    name: 'RTV',
    tagline: 'Rajawali Televisi',
    url: ihUrl('rtv'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'beritasatu',
    name: 'Berita Satu',
    tagline: 'Satu Indonesia',
    url: ihUrl('beritasatu'),
    type: 'hls',
    category: 'indonesia',
  },
  {
    id: 'moji',
    name: 'mOji',
    tagline: 'everyday excitement',
    url: ihUrl('moji'),
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
];
