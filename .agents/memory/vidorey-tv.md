---
name: Vidorey TV stack & data
description: Expo 54 mobile app for live HLS/DASH TV streaming — key gotchas, stream header fix, APK analysis findings
---

# Vidorey TV

## Stack
- Expo 54 / React Native 0.81 / React 19
- expo-av (Video component) for HLS/DASH playback
- expo-router for navigation
- pnpm workspace at root — `pnpm install` from repo root

## Running
Workflow: `artifacts/vidorey-tv: expo`
Needs root-level `package.json` + `pnpm-workspace.yaml` (already created).

## Stream Header Fix (critical)
**Wrong Referer in global STREAM_HEADERS caused 403 on many CDNs.**
- Old: global `Referer: https://duktek.id/` was applied to ALL channels
- Fix: `DEFAULT_STREAM_HEADERS` only has User-Agent; Referer is per-channel
- Channel type has `headers?: Record<string, string>` field
- Trans7 (detik.com CDN): needs `Referer: https://www.trans7.co.id/`
- maxstream.tv channels (Indosiar/RCTI/MNCTV): needs `Referer: https://maxstream.tv/`
- dens.tv channels (SCTV): needs `Referer: https://www.dens.tv/`

## APK is_genuine Hash (found!)
- APK package: `com.live_streaming_tv.online_tv`
- API URL: `https://duktek.id/?device=bittvnew&is_genuine=<sha1>`
- SHA-1 of APK v2 signing certificate: `a6615402e505dd28666f01eefba59b7c78241d36`
- Certificate at offset 7808676 in base.apk, len=918 bytes
- duktek.id times out from Replit server (IP blocked or Indonesia-only) but should work from user's Android device

## IndiHome CDN
- `cdn09jtedge.indihometv.com` URLs require IndiHome ISP subscription
- From duktek.id response: Indosiar, RCTI, SCTV, ANTV, MNCTV, GTV, TransHD etc.
- Only accessible from IndiHome subscriber devices
- indihuy.streamized.net also times out from Replit but may work from Indonesia

## Data Source Chain
1. duktek.id (with correct is_genuine hash — works on device, not from Replit)
2. iptv-org (public, community playlists — Indonesia + Korea + Malaysia)
3. Static fallback in lib/data/ (TVRI, Trans7, TransTV, Metro TV, sports, korea, world)

## M3U Parser
- Reads `http-referrer`, `http-user-agent` from EXTINF attributes
- Reads `#EXTVLCOPT:http-referrer=` lines
- Stores in channel.headers — player uses them automatically

## IndiHome CDN note
- `cdn09jtedge.indihometv.com/atm/hlsv3/{ch}/{ch}-avc1_1200000=4-mp4a.40.2_192000=2.m3u8`
- Returns HTTP 200 but body = "No route" from ALL IPs — requires per-session auth token from duktek.id
- DO NOT use as static URLs; only useful after duktek.id provides fresh tokens

## Dead Domains (DNS fail)
- `indihuy.streamized.net` — DNS fails completely, filtered in m3u-parser

## iptv-org Category Fix
- Indonesia list uses group-title "General"/"News" not "indonesia"
- Pass `defaultCategory='indonesia'` to `parseChannelList(raw, 'indonesia')` for country playlists

## Known Working Static URLs (publicly accessible, no auth)
- TVRI: `ott-balancer.tvri.go.id` (all 30 regional stations) ✅
- Trans7: `video.detik.com/trans7/smil:trans7.smil/playlist.m3u8` ✅ (playlist.m3u8 not chunklist)
- TransTV: `video.detik.com/transtv/smil:transtv.smil/playlist.m3u8` ✅
- Metro TV: `edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8` ✅
- Red Bull TV: Akamaized CDN ✅
- Arirang TV: amdlive-ch01.ctnd.com.edgesuite.net ✅
- Sky News Arabia, Al Jazeera, Africa 24, Euronews ✅

## useNativeDriver
- `useNativeDriver: true` on pulse animation — works on native, skip on web
