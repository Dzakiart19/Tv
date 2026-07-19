import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChannelCard } from '@/components/ui/ChannelCard';
import colors from '@/constants/colors';
import { fontSize, spacing } from '@/constants/theme';
import { getChannelById } from '@/lib/data';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, toggle, isFavorite } = useFavorites();

  const favoriteChannels = favorites
    .map((id) => getChannelById(id))
    .filter(Boolean) as ReturnType<typeof getChannelById>[];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteChannels.length
            ? `${favoriteChannels.length} saved channel${favoriteChannels.length > 1 ? 's' : ''}`
            : 'Save channels for quick access'}
        </Text>
      </View>

      {favoriteChannels.length === 0 ? (
        <EmptyState
          emoji="♡"
          title="No favorites yet"
          subtitle="Tap the heart icon on any channel to save it here for quick access."
        />
      ) : (
        <FlatList
          data={favoriteChannels}
          keyExtractor={(ch) => ch!.id}
          renderItem={({ item }) =>
            item ? (
              <ChannelCard
                channel={item}
                variant="row"
                isFavorite={isFavorite(item.id)}
                onFavoriteToggle={toggle}
              />
            ) : null
          }
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
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
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
});
