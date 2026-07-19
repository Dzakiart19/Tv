import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategorySection } from '@/components/ui/CategorySection';
import { ChannelCard } from '@/components/ui/ChannelCard';
import colors from '@/constants/colors';
import { fontSize, spacing } from '@/constants/theme';
import { getFeaturedChannels } from '@/lib/data';
import { useCategoryRows } from '@/lib/hooks/useChannels';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const featured = getFeaturedChannels();
  const rows = useCategoryRows();
  const { toggle, isFavorite } = useFavorites();

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#0d0d1f', colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>VIDOREY</Text>
            <Text style={styles.brandSub}>Live TV</Text>
          </View>
          <View style={styles.liveChip}>
            <View style={styles.livePulse} />
            <Text style={styles.liveChipText}>LIVE</Text>
          </View>
        </View>

        {/* Featured section */}
        <Text style={styles.sectionTitle}>Featured</Text>
        <View style={styles.featuredList}>
          {featured.map((ch) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              variant="featured"
              isFavorite={isFavorite(ch.id)}
              onFavoriteToggle={toggle}
            />
          ))}
        </View>

        {/* Category rows */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.sm }]}>
          Browse by Category
        </Text>
        {rows.map(({ id, channels }) => (
          <CategorySection key={id} categoryId={id} channels={channels} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: {},
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  brand: {
    color: colors.text,
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 3,
  },
  brandSub: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
    marginTop: 1,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.liveDim,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.live + '44',
    marginTop: 4,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  liveChipText: {
    color: colors.live,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  featuredList: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
});
