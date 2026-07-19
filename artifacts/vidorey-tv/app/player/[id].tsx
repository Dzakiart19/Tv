import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import { Badge, LiveBadge } from '@/components/ui/Badge';
import colors from '@/constants/colors';
import { fontSize, radius, spacing } from '@/constants/theme';
import { useChannelById } from '@/lib/context/ChannelContext';
import { CATEGORIES } from '@/lib/types/channel';
import { useFavorites } from '@/lib/hooks/useFavorites';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH * 9) / 16);

// Default headers — only User-Agent; Referer/Origin are per-channel
// (wrong Referer causes 403 on CDNs like detik.com, dens.tv, etc.)
const DEFAULT_STREAM_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
};

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const channel = useChannelById(id ?? '');
  const { toggle, isFavorite } = useFavorites();

  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isLoading =
    !status ||
    (!('isLoaded' in status && status.isLoaded) && !playerError);
  const isPlaying =
    status && 'isLoaded' in status && status.isLoaded && status.isPlaying;

  // Pulse animation for live dot
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.6, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handlePlaybackStatus = useCallback((s: AVPlaybackStatus) => {
    setStatus(s);
    if ('error' in s) {
      setPlayerError(s.error ?? 'Stream tidak bisa dimuat');
    } else {
      setPlayerError(null);
    }
  }, []);

  const handleRetry = useCallback(async () => {
    setPlayerError(null);
    setStatus(null);
    await videoRef.current?.unloadAsync();
    if (channel) {
      const headers = { ...DEFAULT_STREAM_HEADERS, ...(channel.headers ?? {}) };
      await videoRef.current?.loadAsync(
        { uri: channel.url, headers },
        { shouldPlay: true },
        false,
      );
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
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
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
      <LinearGradient
        colors={[catColor + '18', '#0d0d1f', colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        pointerEvents="none"
      />

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {channel.name}
        </Text>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Feather name="share-2" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => toggle(channel.id)}>
            <Feather name="heart" size={20} color={fav ? colors.live : colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Video (16:9) ── */}
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={{ uri: channel.url, headers: { ...DEFAULT_STREAM_HEADERS, ...(channel.headers ?? {}) } }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          useNativeControls
          onPlaybackStatusUpdate={handlePlaybackStatus}
          onError={(err) => setPlayerError(typeof err === 'string' ? err : 'Stream error')}
        />

        {/* Loading overlay */}
        {isLoading && !playerError && (
          <View style={styles.overlay}>
            <View style={styles.spinnerRow}>
              <Feather name="loader" size={28} color={catColor} />
            </View>
            <Text style={styles.overlaySubtitle}>Memuat stream…</Text>
          </View>
        )}

        {/* Error overlay */}
        {playerError && (
          <View style={styles.overlay}>
            <Feather name="alert-circle" size={40} color="#ff6b6b" />
            <Text style={styles.overlayTitle}>Stream Error</Text>
            <Text style={styles.overlayMsg} numberOfLines={3}>
              {playerError}
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
              <Feather name="refresh-cw" size={14} color="#fff" />
              <Text style={styles.retryText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Channel info ── */}
      <View style={styles.infoSection}>
        {/* Live badge row */}
        <View style={styles.liveRow}>
          <Animated.View
            style={[
              styles.pulseDot,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: isPlaying ? colors.live : colors.textMuted,
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.6],
                  outputRange: [1, 0.3],
                }),
              },
            ]}
          />
          <LiveBadge />
          <View style={{ flex: 1 }} />
          <Badge label={`${cat.emoji} ${cat.label}`} color={catColor} size="sm" />
          <Badge label={channel.type.toUpperCase()} color={colors.textSecondary} size="sm" />
        </View>

        <Text style={styles.channelName}>{channel.name}</Text>
        {channel.tagline ? (
          <Text style={styles.tagline}>{channel.tagline}</Text>
        ) : null}

        {/* Stream URL card */}
        <View style={styles.urlCard}>
          <View style={styles.urlCardHeader}>
            <Feather name="link" size={12} color={colors.textSecondary} />
            <Text style={styles.urlCardLabel}>Stream URL</Text>
          </View>
          <Text style={styles.urlCardValue} numberOfLines={2} selectable>
            {channel.url}
          </Text>
        </View>
      </View>

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
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  topBarTitle: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: spacing.xs,
  },
  topBarActions: { flexDirection: 'row' },
  iconBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  videoWrapper: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  spinnerRow: { marginBottom: spacing.xs },
  overlayTitle: {
    color: '#ff6b6b',
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
  },
  overlaySubtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  overlayMsg: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  retryText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontFamily: 'Inter_600SemiBold',
  },

  infoSection: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  channelName: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
  urlCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
    marginTop: spacing.xs,
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
