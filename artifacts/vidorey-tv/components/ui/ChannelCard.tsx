import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { fontSize, radius, spacing } from '@/constants/theme';
import type { Channel } from '@/lib/types/channel';
import { CATEGORIES } from '@/lib/types/channel';
import { LiveBadge } from './Badge';

interface ChannelCardProps {
  channel: Channel;
  variant?: 'grid' | 'row' | 'featured';
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function ChannelCard({
  channel,
  variant = 'grid',
  isFavorite,
  onFavoriteToggle,
}: ChannelCardProps) {
  const cat = CATEGORIES[channel.category];
  const catColor = colors.category[channel.category] ?? colors.primary;
  const initials = getInitials(channel.name);

  const handlePress = () => {
    router.push(`/player/${channel.id}`);
  };

  if (variant === 'featured') {
    return (
      <Pressable
        style={({ pressed }) => [styles.featured, pressed && styles.pressed]}
        onPress={handlePress}
      >
        <LinearGradient
          colors={[catColor + '30', colors.card, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredGradient}
        >
          {/* Left accent bar */}
          <View style={[styles.accentBar, { backgroundColor: catColor }]} />

          <View style={styles.featuredContent}>
            {/* Logo circle */}
            <View style={[styles.featuredLogo, { borderColor: catColor + '55' }]}>
              <LinearGradient
                colors={[catColor + '30', catColor + '10']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={[styles.featuredInitials, { color: catColor }]}>
                {initials}
              </Text>
            </View>

            <View style={styles.featuredMeta}>
              <LiveBadge />
              <Text style={styles.featuredName} numberOfLines={1}>
                {channel.name}
              </Text>
              {channel.tagline && (
                <Text style={styles.featuredTagline} numberOfLines={1}>
                  {channel.tagline}
                </Text>
              )}
              <View style={styles.featuredFooter}>
                <Text style={[styles.catLabel, { color: catColor }]}>
                  {cat.emoji} {cat.label}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'row') {
    return (
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        onPress={handlePress}
      >
        <View style={[styles.rowLogo, { borderColor: catColor + '44' }]}>
          <Text style={[styles.rowInitials, { color: catColor }]}>{initials}</Text>
        </View>
        <View style={styles.rowMeta}>
          <Text style={styles.rowName} numberOfLines={1}>
            {channel.name}
          </Text>
          {channel.tagline && (
            <Text style={styles.rowTagline} numberOfLines={1}>
              {channel.tagline}
            </Text>
          )}
        </View>
        <View style={[styles.rowDot, { backgroundColor: catColor }]} />
      </Pressable>
    );
  }

  // Grid variant
  return (
    <Pressable
      style={({ pressed }) => [styles.grid, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <LinearGradient
        colors={[catColor + '18', colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gridGradient}
      >
        <View style={[styles.gridAccent, { backgroundColor: catColor }]} />
        <View style={[styles.gridLogo, { borderColor: catColor + '44' }]}>
          <Text style={[styles.gridInitials, { color: catColor }]}>{initials}</Text>
        </View>
        <Text style={styles.gridName} numberOfLines={2}>
          {channel.name}
        </Text>
        <Text style={[styles.gridCat, { color: catColor }]} numberOfLines={1}>
          {cat.emoji} {cat.labelShort}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },

  // Featured
  featured: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  featuredGradient: { flexDirection: 'row', padding: spacing.md, gap: spacing.md },
  accentBar: { width: 3, borderRadius: 2, alignSelf: 'stretch' },
  featuredLogo: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  featuredInitials: { fontSize: fontSize.xl, fontFamily: 'Inter_700Bold' },
  featuredContent: { flexDirection: 'row', gap: spacing.md, flex: 1 },
  featuredMeta: { flex: 1, gap: spacing.xs },
  featuredName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  featuredTagline: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  featuredFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  catLabel: { fontSize: fontSize.xs, fontFamily: 'Inter_500Medium' },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  rowLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  rowInitials: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  rowMeta: { flex: 1 },
  rowName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontFamily: 'Inter_500Medium',
  },
  rowTagline: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  rowDot: { width: 7, height: 7, borderRadius: 4 },

  // Grid
  grid: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    width: 130,
  },
  gridGradient: { padding: spacing.sm + 2, gap: spacing.xs },
  gridAccent: { height: 2, borderRadius: 1, marginBottom: 4 },
  gridLogo: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  gridInitials: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  gridName: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
    lineHeight: 18,
  },
  gridCat: { fontSize: fontSize.xs, fontFamily: 'Inter_400Regular' },
});
