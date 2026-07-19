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
  Append .json to individual channel URL for metadata (APK Method J)

**Stream types:** hls, dash, dash-clearkey, dash-widevine, ts
**is_genuine value:** '1' (may be computed hash; APK method 'u' uses SHA1 + 'eksM30' key)

## Architecture
- lib/context/ChannelContext.tsx — ChannelProvider wraps app, fetches from duktek.id on mount,
  falls back to static data on error
- lib/services/duktek.ts — fetchDuktekConfig(), fetchChannelList()
- lib/utils/m3u-parser.ts — parseM3U(), parseChannelList() (tries JSON then M3U)
- Static data in lib/data/ kept as fallback

## Key gotchas
- useNativeDriver: true works on native but causes warning on web
- Apostrophes in JSX strings need escaping
- tsconfig.json had stale reference to ../../lib/api-client-react — removed
- duktek.id not accessible from Replit server (DNS blocked); requests run on device = fine
