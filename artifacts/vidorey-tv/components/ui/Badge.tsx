import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/constants/colors';
import { fontSize, radius, spacing } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = colors.primary, size = 'sm' }: BadgeProps) {
  const isSmall = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '22',
          borderColor: color + '44',
          paddingHorizontal: isSmall ? spacing.xs + 2 : spacing.sm,
          paddingVertical: isSmall ? 2 : spacing.xs,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color, fontSize: isSmall ? fontSize.xs : fontSize.sm },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function LiveBadge() {
  return (
    <View style={styles.liveBadge}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.liveDim,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.live + '44',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  liveText: {
    color: colors.live,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
  },
});
