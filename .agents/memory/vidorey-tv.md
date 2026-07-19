---
name: Vidorey TV
description: Live TV streaming app — stack decisions, data sources, and known pitfalls
---

## Stack
- Expo 54, expo-router v6, React Native 0.81.5, React 19
- Tabs: Home / Explore / Favorites; stack: player/[id]
- Video playback: Linking.openURL (no expo-av/expo-video installed)
- Fonts: Inter via @expo-google-fonts/inter

## Channel data
- 67 channels total across 5 categories in `lib/data/`
- TVRI: 32 channels via `https://ott-balancer.tvri.go.id/live/eds/{KOTA}/hls/{KOTA}.m3u8` — 100% working
- Indonesia FTA: 11 channels (IndiHome CDN, Detik CDN, direct HLS)
- Sports: 8 channels (RedBull, SPOTV, Real Madrid, Bahrain, Kuwait, Oman)
- Korea: 8 channels (Arirang, EBS, MBC, Gugbang)
- World: 8 channels (Sky News Arabia, FOX, Africa24, Astro Awani)

## Design system
- Background: #08080f, surface: #12121e, card: #1a1a2c
- Category accent colors in `constants/colors.ts` under `colors.category`
- Dark theme only (no light mode)

## Known pitfalls
- `catalog:` entries in package.json require pnpm workspace root — replace with concrete versions
- `@workspace/api-client-react: workspace:*` must be removed (no sibling package)
- Apostrophes in JSX string literals (single-quoted) cause TransformError — use double quotes
- `useNativeDriver: true` crashes on web — use `useNativeDriver: false` for web-compatible animations

**Why:** The artifact scaffolding ships with workspace catalog references that have no root workspace.yaml to resolve them.
**How to apply:** Any future dependency additions must use explicit semver, not `catalog:`.
