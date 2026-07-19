import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { fontSize, spacing } from '@/constants/theme';
import type { CategoryId, Channel } from '@/lib/types/channel';
import { CATEGORIES } from '@/lib/types/channel';
import { ChannelCard } from './ChannelCard';

interface CategorySectionProps {
  categoryId: CategoryId;
  channels: Channel[];
}

export function CategorySection({ categoryId, channels }: CategorySectionProps) {
  const cat = CATEGORIES[categoryId];
  const catColor = colors.category[categoryId] ?? colors.primary;

  if (!channels.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: catColor }]} />
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <Text style={styles.title}>{cat.label}</Text>
          <Text style={styles.count}>{channels.length}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/explore')}
          hitSlop={12}
        >
          <Text style={[styles.seeAll, { color: catColor }]}>See all →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {channels.slice(0, 10).map((ch) => (
          <ChannelCard key={ch.id} channel={ch} variant="grid" />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3 },
  emoji: { fontSize: fontSize.md },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontFamily: 'Inter_600SemiBold',
  },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_400Regular',
    marginLeft: 2,
  },
  seeAll: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_500Medium',
  },
  scroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});
