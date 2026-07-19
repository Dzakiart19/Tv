import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Badge, LiveBadge } from '@/components/ui/Badge';
import colors from '@/constants/colors';
import { fontSize, radius, spacing } from '@/constants/theme';
import { getChannelById } from '@/lib/data';
import { CATEGORIES } from '@/lib/types/channel';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const channel = getChannelById(id ?? '');
  const { toggle, isFavorite } = useFavorites();
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for live dot
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const openStream = useCallback(async () => {
    if (!channel) return;
    setOpening(true);
    try {
      await Linking.openURL(channel.url);
      setOpened(true);
    } catch {
      // URL might not open directly, try with vlc:// scheme
      try {
        await Linking.openURL(`vlc://${channel.url}`);
        setOpened(true);
      } catch {
        setOpened(false);
      }
    } finally {
      setOpening(false);
    }
  }, [channel]);

  const handleShare = useCallback(async () => {
    if (!channel) return;
    try {
      await Share.share({
        message: `Watch ${channel.name} live on Vidorey TV\n${channel.url}`,
        title: channel.name,
      });
    } catch {}
  }, [channel]);

  if (!channel) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.errorText}>Channel not found</Text>
        </View>
      </View>
    );
  }

  const cat = CATEGORIES[channel.category];
  const catColor = colors.category[channel.category] ?? colors.primary;
  const initials = channel.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const fav = isFavorite(channel.id);

  return (
    <View style={styles.root}>
      {/* Background */}
      <LinearGradient
        colors={[catColor + '18', '#0d0d1f', colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        pointerEvents="none"
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Now Playing
        </Text>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Feather name="share-2" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => toggle(channel.id)}
          >
            <Feather
              name={fav ? 'heart' : 'heart'}
              size={20}
              color={fav ? colors.live : colors.text}
              // filled heart via color, feather doesn't have filled variant
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Live indicator */}
        <View style={styles.liveRow}>
          <Animated.View
            style={[
              styles.pulseDot,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: colors.live,
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.6],
                  outputRange: [1, 0.4],
                }),
              },
            ]}
          />
          <LiveBadge />
        </View>

        {/* Logo */}
        <View style={[styles.logoContainer, { borderColor: catColor + '40' }]}>
          <LinearGradient
            colors={[catColor + '28', catColor + '08']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.logoInitials, { color: catColor }]}>
            {initials}
          </Text>
        </View>

        {/* Channel info */}
        <View style={styles.info}>
          <Text style={styles.channelName}>{channel.name}</Text>
          {channel.tagline && (
            <Text style={styles.tagline}>{channel.tagline}</Text>
          )}
          <View style={styles.badgeRow}>
            <Badge
              label={`${cat.emoji} ${cat.label}`}
              color={catColor}
              size="md"
            />
            <Badge
              label={channel.type.toUpperCase()}
              color={colors.textSecondary}
              size="md"
            />
          </View>
        </View>

        {/* Play button */}
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            { backgroundColor: catColor, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={openStream}
          disabled={opening}
        >
          {opening ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Feather name="play" size={22} color="#fff" />
          )}
          <Text style={styles.playButtonText}>
            {opening ? 'Opening…' : opened ? 'Open Again' : 'Watch Now'}
          </Text>
        </Pressable>

        {/* Hint */}
        <Text style={styles.hint}>
          {opened
            ? '✓ Stream opened in your media player'
            : "Opens in your device's default video player\n(VLC recommended for best experience)"}
        </Text>

        {/* Stream URL card */}
        <View style={styles.urlCard}>
          <View style={styles.urlCardHeader}>
            <Feather name="link" size={13} color={colors.textSecondary} />
            <Text style={styles.urlCardLabel}>Stream URL</Text>
          </View>
          <Text style={styles.urlCardValue} numberOfLines={2} selectable>
            {channel.url}
          </Text>
        </View>
      </View>

      {/* Bottom safe area */}
      <View style={{ height: insets.bottom + spacing.md }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontFamily: 'Inter_400Regular',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  topBarTitle: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  topBarActions: { flexDirection: 'row' },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    margin: spacing.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pulseDot: {
    position: 'absolute',
    left: -spacing.lg,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoInitials: {
    fontSize: 44,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },

  info: { alignItems: 'center', gap: spacing.sm },
  channelName: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },

  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl + 8,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    marginTop: spacing.sm,
  },
  playButtonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontFamily: 'Inter_600SemiBold',
  },

  hint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },

  urlCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    width: '100%',
    gap: spacing.xs,
  },
  urlCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  urlCardLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  urlCardValue: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
});
