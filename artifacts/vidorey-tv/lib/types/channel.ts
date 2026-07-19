export type StreamType = 'hls' | 'dash' | 'dash-clearkey' | 'dash-widevine' | 'ts';

export type CategoryId =
  | 'indonesia'
  | 'tvri'
  | 'sports'
  | 'korea'
  | 'malaysia'
  | 'world'
  | 'kids';

export interface Channel {
  id: string;
  name: string;
  tagline?: string;
  url: string;
  type: StreamType;
  category: CategoryId;
  logo?: string; // URL to logo image
}

export interface Category {
  id: CategoryId;
  label: string;
  labelShort: string;
  color: string;
  emoji: string;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  indonesia: {
    id: 'indonesia',
    label: 'Indonesia',
    labelShort: 'ID',
    color: '#ff4b4b',
    emoji: '🇮🇩',
  },
  tvri: {
    id: 'tvri',
    label: 'TVRI',
    labelShort: 'TVRI',
    color: '#f5c842',
    emoji: '📺',
  },
  sports: {
    id: 'sports',
    label: 'Sports',
    labelShort: 'SP',
    color: '#4dd0e1',
    emoji: '⚽',
  },
  korea: {
    id: 'korea',
    label: 'Korea',
    labelShort: 'KR',
    color: '#b388ff',
    emoji: '🇰🇷',
  },
  malaysia: {
    id: 'malaysia',
    label: 'Malaysia',
    labelShort: 'MY',
    color: '#ff9f4b',
    emoji: '🇲🇾',
  },
  world: {
    id: 'world',
    label: 'World',
    labelShort: 'WD',
    color: '#66bb6a',
    emoji: '🌍',
  },
  kids: {
    id: 'kids',
    label: 'Kids',
    labelShort: 'KD',
    color: '#ff80ab',
    emoji: '🧸',
  },
};
