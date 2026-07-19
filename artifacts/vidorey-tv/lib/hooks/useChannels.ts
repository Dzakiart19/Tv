import { useMemo, useState } from 'react';
import {
  ALL_CHANNELS,
  CATEGORY_ORDER,
  CHANNELS_BY_CATEGORY,
  searchChannels,
} from '../data';
import type { CategoryId, Channel } from '../types/channel';

export function useAllChannels() {
  return ALL_CHANNELS;
}

export function useCategoryChannels(categoryId: CategoryId): Channel[] {
  return CHANNELS_BY_CATEGORY[categoryId] ?? [];
}

export function useCategoryRows() {
  return CATEGORY_ORDER.map((id) => ({
    id,
    channels: CHANNELS_BY_CATEGORY[id] ?? [],
  }));
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchChannels(query), [query]);
  return { query, setQuery, results };
}
