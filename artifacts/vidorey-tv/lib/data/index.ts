import type { Category, CategoryId, Channel } from '../types/channel';
import { CATEGORIES } from '../types/channel';
import { indonesiaChannels } from './indonesia';
import { koreaChannels } from './korea';
import { sportsChannels } from './sports';
import { tvriChannels } from './tvri';
import { worldChannels } from './world';

export const ALL_CHANNELS: Channel[] = [
  ...indonesiaChannels,
  ...tvriChannels,
  ...sportsChannels,
  ...koreaChannels,
  ...worldChannels,
];

export const CHANNELS_BY_CATEGORY: Record<CategoryId, Channel[]> = {
  indonesia: indonesiaChannels,
  tvri: tvriChannels,
  sports: sportsChannels,
  korea: koreaChannels,
  malaysia: worldChannels.filter((c) => c.id === 'astro-awani'),
  world: worldChannels,
  kids: koreaChannels.filter((c) => c.id === 'ebs-kids'),
};

export const CATEGORY_ORDER: CategoryId[] = [
  'indonesia',
  'tvri',
  'sports',
  'korea',
  'world',
];

export function getChannelById(id: string): Channel | undefined {
  return ALL_CHANNELS.find((ch) => ch.id === id);
}

export function searchChannels(query: string): Channel[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_CHANNELS.filter(
    (ch) =>
      ch.name.toLowerCase().includes(q) ||
      ch.tagline?.toLowerCase().includes(q) ||
      ch.category.toLowerCase().includes(q),
  );
}

export function getFeaturedChannels(): Channel[] {
  return [
    getChannelById('tvri-nasional')!,
    getChannelById('redbull-tv')!,
    getChannelById('indosiar')!,
    getChannelById('arirang')!,
    getChannelById('sky-news-arabia')!,
  ].filter(Boolean);
}

export { CATEGORIES };
export type { Category, CategoryId, Channel };
