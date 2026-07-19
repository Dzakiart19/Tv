import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategorySection } from '@/components/ui/CategorySection';
import { ChannelCard } from '@/components/ui/ChannelCard';
import colors from '@/constants/colors';
import { fontSize, spacing } from '@/constants/theme';
import {
  useCategoryRows,
  useChannelStore,
  useFeaturedChannels,
} from '@/lib/context/ChannelContext';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const featured = useFeaturedChannels();
  const rows = useCategoryRows();
  const { toggle, isFavorite } = useFavorites();
  const { status, error, refresh } = useChannelStore();

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

        {/* Status banner */}
        {status === 'loading' && (
          <View style={styles.statusBanner}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.statusText}>Memuat daftar channel terbaru…</Text>
          </View>
        )}
        {status === 'error' && (
          <View style={[styles.statusBanner, styles.statusError]}>
            <Text style={styles.statusErrorText}>
              ⚠ Gagal memuat dari server — menampilkan data lokal
            </Text>
            <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
              <Text style={styles.retryText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Featured section */}
        {featured.length > 0 && (
          <>
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
          </>
        )}

        {/* Category rows */}
        {rows.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: spacing.sm }]}>
              Browse by Category
            </Text>
            {rows.map(({ id, channels }) => (
              <CategorySection key={id} categoryId={id} channels={channels} />
            ))}
          </>
        )}
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusError: {
    borderColor: '#ff4b4b44',
    backgroundColor: 'rgba(255,75,75,0.08)',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  statusErrorText: {
    color: '#ff6b6b',
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  retryBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primaryDim,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary + '44',
  },
  retryText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
  },
});
