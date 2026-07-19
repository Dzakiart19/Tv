import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChannelCard } from '@/components/ui/ChannelCard';
import { SearchBar } from '@/components/ui/SearchBar';
import colors from '@/constants/colors';
import { fontSize, radius, spacing } from '@/constants/theme';
import { ALL_CHANNELS, CATEGORY_ORDER, CHANNELS_BY_CATEGORY } from '@/lib/data';
import type { CategoryId } from '@/lib/types/channel';
import { CATEGORIES } from '@/lib/types/channel';
import { useSearch } from '@/lib/hooks/useChannels';

const ALL_KEY = 'all' as const;
type FilterKey = CategoryId | typeof ALL_KEY;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterKey>(ALL_KEY);
  const { query, setQuery, results: searchResults } = useSearch();

  const filters: { key: FilterKey; label: string; emoji: string }[] = [
    { key: ALL_KEY, label: 'All', emoji: '✦' },
    ...CATEGORY_ORDER.map((id) => ({
      key: id as FilterKey,
      label: CATEGORIES[id].label,
      emoji: CATEGORIES[id].emoji,
    })),
  ];

  const displayedChannels = useMemo(() => {
    if (query.trim()) return searchResults;
    if (activeFilter === ALL_KEY) return ALL_CHANNELS;
    return CHANNELS_BY_CATEGORY[activeFilter as CategoryId] ?? [];
  }, [query, searchResults, activeFilter]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>{ALL_CHANNELS.length} live channels</Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      {/* Category filter chips */}
      {!query.trim() && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {filters.map((f) => {
            const isActive = f.key === activeFilter;
            const catColor =
              f.key === ALL_KEY
                ? colors.primary
                : colors.category[f.key as CategoryId] ?? colors.primary;
            return (
              <Pressable
                key={f.key}
                style={[
                  styles.chip,
                  isActive && {
                    backgroundColor: catColor + '22',
                    borderColor: catColor + '66',
                  },
                ]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={styles.chipEmoji}>{f.emoji}</Text>
                <Text
                  style={[
                    styles.chipLabel,
                    { color: isActive ? catColor : colors.textSecondary },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {displayedChannels.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="No channels found"
          subtitle={`No results for "${query}"`}
        />
      ) : (
        <FlatList
          data={displayedChannels}
          keyExtractor={(ch) => ch.id}
          renderItem={({ item }) => (
            <ChannelCard channel={item} variant="row" />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  filterScroll: { marginBottom: spacing.sm },
  filterRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipEmoji: { fontSize: 13 },
  chipLabel: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_500Medium',
  },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.xs },
});
