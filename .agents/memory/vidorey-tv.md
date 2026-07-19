---
name: Vidorey TV — stack, data & APK reverse-engineering
description: Expo 54 mobile IPTV app; key gotchas and the duktek.id API pattern from base.apk
---

## Stack
- Expo 54 / React Native 0.81.5 / React 19, New Architecture enabled
- expo-router v6 file-based routing, typed routes
- Inter font (@expo-google-fonts/inter), @expo/vector-icons Feather
- expo-blur (iOS tab bar), expo-linear-gradient, expo-haptics
- @react-native-async-storage/async-storage (favorites persistence)
- @tanstack/react-query installed but unused (ready for future)
- expo-av 16.0.8 — in-app HLS/DASH player via Video component; works in Expo Go
- expo-video 3.0.16 also installed but NOT used (requires dev build, breaks Expo Go)
- React Compiler beta enabled

## Duktek.id API (reverse-engineered from base.apk)
Package: com.live_streaming_tv.online_tv

**Config endpoint:**
  GET https://duktek.id/?device=bittvnew&is_genuine=1
  Headers:
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0
    Referer: https://duktek.id/
    Origin: https://duktek.id

**Config JSON response keys:**
  channel_list_url, premium_channel_list_url, channel_administrator_url,
  countrylist, full_url_iklan, durasi_jeda_iklan_init,
  durasi_jeda_iklan_pindah_channel, durasi_jeda_iklan_putar_video,
  link_bio, link_buymeacoffee, link_saweria, url_saweria

**Channel list:**
  Fetch URL from channel_list_url -> M3U or JSON format
  M3U: standard #EXTM3U / #EXTINF with tvg-id, tvg-name, tvg-logo, group-title

**Stream types:** hls, dash, dash-clearkey, dash-widevine, ts
**is_genuine value:** '1' (may be computed hash; APK method 'u' uses SHA1 + 'eksM30' key)

## Architecture
- lib/context/ChannelContext.tsx — ChannelProvider wraps app, fetches from duktek.id on mount
- lib/services/duktek.ts — fetchDuktekConfig(), fetchChannelList()
- lib/utils/m3u-parser.ts — parseM3U(), parseChannelList() (tries JSON then M3U)
- app/player/[id].tsx — VideoView + useVideoPlayer from expo-video with APK headers
- Static data in lib/data/ kept as fallback

## Build requirement
- expo-video is a native module -> MUST use development build APK, not Expo Go
- Build command: eas build --profile development --platform android
- Or local build with Android Studio if EAS not available

## Key gotchas
- useNativeDriver: true works on native but causes warning on web
- tsconfig.json had stale reference to ../../lib/api-client-react — removed
- duktek.id not accessible from Replit server; requests run on device = fine
- ContentType values for expo-video: 'hls' | 'dash' | 'auto' | 'progressive' | 'smoothStreaming'
  (NOT 'application/x-mpegURL' — that's the MIME type, not the expo-video enum value)
