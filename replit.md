# Vidorey TV

Expo 54 (React Native) mobile app for streaming live TV channels over HLS/DASH. Supports Indonesian, Korean, sports, and world channels.

## How to run

```
pnpm install          # install all workspace dependencies (run from root)
# then start the workflow: artifacts/vidorey-tv: expo
```

The workflow command is:
```
pnpm --filter @workspace/vidorey-tv run dev
```

Scan the QR code in Expo Go (Android/iOS) to preview on a physical device.

## Project structure

```
artifacts/vidorey-tv/
├── app/                    # expo-router screens
│   ├── (tabs)/             # Home, Explore, Favorites tabs
│   └── player/[id].tsx     # Video player screen (expo-av)
├── components/ui/          # ChannelCard, Badge, SearchBar, etc.
├── constants/              # colors, theme
├── lib/
│   ├── context/            # ChannelContext — global channel state
│   ├── data/               # Static channel fallback data
│   │   ├── indonesia.ts    # Major Indonesian channels
│   │   ├── tvri.ts         # All TVRI regional stations
│   │   ├── sports.ts       # Sports channels
│   │   ├── korea.ts        # Korean channels
│   │   └── world.ts        # International channels
│   ├── hooks/              # useChannels, useFavorites
│   ├── services/duktek.ts  # API: duktek.id → iptv-org → static fallback chain
│   ├── types/channel.ts    # Channel, CategoryId types
│   └── utils/m3u-parser.ts # M3U + JSON playlist parser
└── metro.config.js         # React Compiler alias fix
```

## Data source priority

1. **duktek.id** — original APK backend (may timeout; is_genuine hash computed by APK)
2. **iptv-org** — community-maintained public playlists (Indonesia, Korea, Malaysia)
3. **Static fallback** — hardcoded working URLs in `lib/data/`

## Known working static channels

- TVRI Nasional + 30 regional stations (`ott-balancer.tvri.go.id`)
- Trans7, TransTV (`video.detik.com / livestream.transtv.co.id`)
- Metro TV (`edge.medcom.id`)
- Red Bull TV, Real Madrid TV, Oman Sports (Akamaized CDN)
- Arirang TV, EBS Korea, MBC Korea
- Sky News Arabia, Al Jazeera English, Africa 24, Euronews

## User preferences

- Bahasa Indonesia preferred for UI messages and error strings
