# DramaBos API Keys & Recon Report

> **Last updated:** 2026-06-29

---

## SITE 1: dramabos.live

> **Base API:** `https://prod-api.dramabos.live`
> **Auth:** `Authorization: Bearer {API_KEY}`
> **Plan:** Free — 1.000 req/bulan

### Cara Auth (Next.js CSRF flow)

```bash
# 1. Ambil CSRF token
CSRF=$(curl -s "https://dramabos.live/api/auth/csrf" | grep -oE '"csrfToken":"[^"]+' | cut -d'"' -f4)

# 2. Register akun gratis
curl -s -c /tmp/drb.jar "https://dramabos.live/api/auth/register" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Content-Type: application/json" \
  -d '{"name":"nama","email":"email@mailinator.com","password":"Pass@12345","csrfToken":"'$CSRF'"}'

# 3. Ambil API key dari dashboard
curl -s "https://dramabos.live/dashboard" -b /tmp/drb.jar -H "RSC: 1" \
  | grep -oE '"apiKey":"[^"]+"'
```

**Rate limit:** 1 register per ~6 menit per IP (Cloudflare)

### Provider Aktif

| Provider | Status | Endpoint |
|---|---|---|
| **FlickReels** | ✅ HLS live | `/flickreels/api/flickreels/search?q={q}` |
| **ShortMax** | ✅ Live | `/shortmax/api/v1/search?q={q}` |
| **iDrama** | ✅ Search only | `/idrama/search?q={q}` |
| **DramaBox** | ❌ decode error | — |

### Cara Pakai

```bash
API_KEY="dbk_live_XXXX"
BASE="https://prod-api.dramabos.live"

curl -s "${BASE}/flickreels/api/flickreels/search?q=love+story" -H "Authorization: Bearer ${API_KEY}"
curl -s "${BASE}/flickreels/api/flickreels/episode?id=240&ep=1"  -H "Authorization: Bearer ${API_KEY}"
curl -s "${BASE}/shortmax/api/v1/search?q=love+story"            -H "Authorization: Bearer ${API_KEY}"
curl -s "${BASE}/idrama/search?q=love+story"                     -H "Authorization: Bearer ${API_KEY}"
```

### Daftar API Key dramabos.live

| No | Email | API Key |
|---|---|---|
| 156 | `testdrama88@mailinator.com` | `dbk_live_49c50a75f7a16d9501417753f6cd0e9fc9298d83fe130a83` |
| 1 | `dbuser_db0189fb9254@mailinator.com` | `dbk_live_226b8c44c73d01825d8a73b053a154c240942b372a4ba4e1` |

---

## SITE 2: dracinapi.com

> **Backend:** `https://prod-api.dracinapi.com` — ❌ **DOWN (520 semua endpoint)**
> **Stack:** Identik 100% dengan dramabos.live (Next.js, template sama)
> **Status page:** BOHONG — tampil "Operasional" padahal semua endpoint 520

### Auth (sama persis seperti dramabos.live, ganti domain)

```bash
# Cookie: dracinapi_session=...
# Dashboard RSC: https://dracinapi.com/dashboard + header RSC:1
```

### API Key dracinapi.com (didapat tapi backend mati)

| Email | API Key |
|---|---|
| `dcin_49e4698c4e@mailinator.com` | `dbk_live_e844effa5a0f506f59025f0537da1d93de72e6f15b40846b` |

### Timeline dracinapi (dari changelog)

| Tanggal | Event |
|---|---|
| 2026-05-29 | Rilis pertama — ShortMax |
| 2026-05-30 | DramaBox ditambah |
| 2026-05-31 | FlickReels ditambah |
| 2026-06-01 | iDrama ditambah |
| 2026-06-20 | +10 provider baru → total 42 provider |
| Sekarang | Backend `prod-api.dracinapi.com` mati total (520) |

---

## SITE 3: dramabos.asia + goodbos.online Ecosystem

> **Stack:** Express (bukan Next.js!)
> **Landing page:** `https://dramabos.asia`
> **Backend:** `https://api.dramabuzz.sbs` (auth: `?key=KODE_AKSES` atau header `X-Api-Key`)
> **Owner Telegram:** `@nanomilkiss` / bot: `@nanomilkisbot`
> **Linked:** `https://dramabox.goodbos.online/api.html`

### Pricing dramabos.asia

| Harga | Durasi | Platform |
|---|---|---|
| Rp 30.000 | 30 hari | 8 platform |
| Rp 40.000 | — | 12 platform |
| Rp 65.000 | — | 27–32 platform |
| Rp 79.000 | 35 hari | 40+ platform (akses penuh) |
| Rp 129.000 | — | 41+ platform |

**Auth format api.dramabuzz.sbs:**
```bash
curl "https://api.dramabuzz.sbs/api/status?key=KODE_AKSES"
# atau
curl "https://api.dramabuzz.sbs/api/status" -H "X-Api-Key: KODE_AKSES"
# tanpa key → {"success":false,"error":"Unauthorized",...}
```

---

## goodbos.online — Proxy Publik (TANPA KEY, owner @nanomilkiss)

> Beberapa endpoint **tidak butuh auth sama sekali!**

---

### dramabox.goodbos.online (DramaBox)

**Base:** `https://dramabox.goodbos.online` | Auth param: `&code=KODE`

| Endpoint | Auth | |
|---|---|---|
| `GET /api/v1/search?query={2+ kata}&lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /api/v1/homepage?page=1&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/dubbed?classify=terpopuler&page=1&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/foryou?lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/latest?lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/detail?bookId={id}&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/allepisode?bookId={id}&lang={lang}&code={c}` | ✅ Perlu | ✅ |

```bash
# GRATIS — min 2 kata
curl "https://dramabox.goodbos.online/api/v1/search?query=love+drama&lang=en"
# → [{"bookId":"42000010551","bookName":"A Tennessee Love Story",...}]
```
CDN cover: `hwztchapter.dramaboxdb.com`

---

### flickreels.goodbos.online (FlickReels)

**Base:** `https://flickreels.goodbos.online` | Backend: Go

| Endpoint | Auth | |
|---|---|---|
| `GET /languages` | ❌ **GRATIS** | ✅ |
| `GET /api/home?lang={lang}&page={n}` | ❌ **GRATIS** | ✅ |
| `GET /api/list?lang={lang}&page={n}&page_size={n}&category_id=0` | ❌ **GRATIS** | ✅ |
| `GET /trending?lang={lang}` | ❌ Gratis | ⚠️ data null |
| `GET /search?q={q}&lang={lang}` | ❌ Gratis | ⚠️ data null |
| `GET /drama/:id?lang={lang}` | — | ⚠️ Bug (return docs) |
| `GET /nexthome?lang={lang}&page={n}&page_size={n}` | — | ⚠️ Bug (return docs) |

```bash
curl "https://flickreels.goodbos.online/api/home?lang=en&page=1"
# → {"status_code":1,"data":{"data":[{"playlet_id":7930,"title":"Frozen Reckoning",...}]}}

curl "https://flickreels.goodbos.online/api/list?lang=en&page=1&page_size=12&category_id=0"
curl "https://flickreels.goodbos.online/languages"
```
CDN cover: `zshipubcdn.farsunpteltd.com`

---

### reelshort.goodbos.online (ReelShort)

**Base:** `https://reelshort.goodbos.online` | CDN: `v-img.crazymaplestudios.com`

| Endpoint | Auth | |
|---|---|---|
| `GET /languages` | ❌ **GRATIS** | ✅ — 19 bahasa |
| `GET /home?tab={tab}&lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /trending?lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /search?q={q}&lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /detail/{id}?lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /validate?code={code}` | ❌ **GRATIS** | ✅ — cek validity |
| `GET /shelf/{id}?lang={lang}&page={n}` | ❌ **GRATIS** | ✅ (bisa null) |
| `GET /allepisodes/{id}?lang={lang}&code={c}` | ✅ Perlu | ✅ stream URL |

**Tab `/home`:** `hot` · `new` · `ranking` · `free` · `vip` · (kosong)

```bash
curl "https://reelshort.goodbos.online/home?tab=hot&lang=en"
curl "https://reelshort.goodbos.online/search?q=love+story&lang=en"

BOOK="6968674a59095c2b4e0e5bd7"
curl "https://reelshort.goodbos.online/detail/${BOOK}?lang=en"
# → {"chapters":74,"title":"Ms. CEO's Baby Daddy Is the Merchant of Death","views":391008577}

curl "https://reelshort.goodbos.online/validate?code=TEST"
# → {"valid":false}
```

---

### ⭐ goodshort.goodbos.online (GoodShort) — HLS GRATIS!

**Base:** `https://goodshort.goodbos.online` | CDN HLS: `v3-akm.goodreels.com`

| Endpoint | Auth | |
|---|---|---|
| `GET /nav?lang={lang}` | ❌ **GRATIS** | ✅ channel nav |
| `GET /home?lang={lang}&channelId={id}&page={n}&size={n}` | ❌ **GRATIS** | ✅ drama list |
| `GET /episode/?bookId={id}&ep={n}` | ❌ **GRATIS** | ✅ **HLS M3U8!** |
| `GET /search?q={q}&lang={lang}&code={c}` | ✅ Perlu | ✅ |

```bash
# Channel nav (channelId: -1=Hot, 429=New)
curl "https://goodshort.goodbos.online/nav?lang=en"

# Drama list
curl "https://goodshort.goodbos.online/home?lang=en&channelId=-1&page=1&size=12"
# → {"data":{"records":[{"bookId":"31001424670","bookName":"Awakened as a Dragon Tamer",...}]}}

# ⭐ EPISODE + HLS (GRATIS, NO AUTH!)
curl "https://goodshort.goodbos.online/episode/?bookId=31001424670&ep=1"
```

**Response `/episode/`:**
```json
{
  "data": {
    "list": [{
      "bookId": "31001424670",
      "buyWay": "免费",
      "cdn": "https://v3.goodshort.com/.../720p/xxx_720p.m3u8?expiredTime=...&tul=...",
      "cdnList": [
        {"cdnDomain":"https://v3-akm.goodreels.com","videoPath":"...m3u8?__token__=exp=...~hmac=..."},
        {"cdnDomain":"https://v2-akm.goodreels.com","videoPath":"...m3u8?__token__=exp=...~hmac=..."}
      ]
    }]
  }
}
```

**Cara play HLS:**
```bash
HLS=$(curl -s "https://goodshort.goodbos.online/episode/?bookId=31001424670&ep=1" \
  | grep -oE 'https://v3-akm\.goodreels\.com[^"]+' | head -1)

# Wajib pakai Referer!
mpv "$HLS" --referrer="https://goodshort.goodbos.online/"
ffplay "$HLS" -headers "Referer: https://goodshort.goodbos.online/"
```

> ⚠️ `v3.goodshort.com` → ERROR #461 tanpa Referer header
> ✅ `v3-akm.goodreels.com` / `v2-akm.goodreels.com` dengan `__token__` → BERHASIL

---

### shortmax.goodbos.online (ShortMax)

**Base:** `https://shortmax.goodbos.online` | Auth param: `&code=KODE`

| Endpoint | Auth | |
|---|---|---|
| `GET /api/v1/languages` | ❌ Gratis | ⚠️ "service unavailable" |
| `GET /api/v1/search?q={q}&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/popular?lang={lang}&page={n}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/hot?page={n}&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/new?lang={lang}&page={n}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/vip?lang={lang}&page={n}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/ranking?lang={lang}&type=monthly&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/detail/:id?lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/v1/alleps/:id?lang={lang}&code={c}` | ✅ Perlu | ✅ stream URL |

---

### melolo.goodbos.online (Melolo)

**Base:** `https://melolo.goodbos.online`

| Endpoint | Auth | |
|---|---|---|
| `GET /api/search?q={query}` | ❌ **GRATIS** | ✅ |
| `GET /api/home?offset={n}&code={c}` | ✅ Perlu | ✅ |
| `GET /api/detail?id={id}` | ✅ Perlu | ✅ |

```bash
curl "https://melolo.goodbos.online/api/search?q=love+story"
# → {"code":0,"count":20,"data":[{"id":"7615887172951870469","name":"Rahasia Ny. Muda Terbongkar",...}]}
```

---

### idrama.goodbos.online (iDrama)

**Base:** `https://idrama.goodbos.online` | CDN: `p.idrama.video`

| Endpoint | Auth | |
|---|---|---|
| `GET /home` | ❌ **GRATIS** | ✅ channel nav list |
| `GET /search?q={2+ kata}` | ❌ **GRATIS** | ✅ |
| `GET /drama/{id}` | ✅ Perlu | ✅ |

```bash
curl "https://idrama.goodbos.online/home"
curl "https://idrama.goodbos.online/search?q=love+story"
```

---

### pinedrama.goodbos.online (PineDrama)

**Base:** `https://pinedrama.goodbos.online`

| Endpoint | Auth | |
|---|---|---|
| `GET /language` | ❌ **GRATIS** | ✅ — 8 bahasa |
| `GET /home?lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /search?q={q}&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /category?lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /detail?id={id}&lang={lang}&code={c}` | ✅ Perlu | ✅ |
| `GET /episode?id={id}&ep={n}&lang={lang}&code={c}` | ✅ Perlu | ✅ |

---

### dramabite.goodbos.online (DramaBite)

**Base:** `https://dramabite.goodbos.online`

| Endpoint | Auth | |
|---|---|---|
| `GET /languages` | ❌ **GRATIS** | ✅ multi bahasa |
| `GET /home?lang={lang}` | ❌ **GRATIS** | ✅ module list |
| `GET /module?page={n}&lang={lang}` | ❌ **GRATIS** | ✅ rekomendasi |
| `GET /search?q={q}&lang={lang}` | ❌ Gratis | ⚠️ null result |

```bash
curl "https://dramabite.goodbos.online/home?lang=en"
# → {"module_list":[{"module_id":542,"module_item_list":[...]}]}

curl "https://dramabite.goodbos.online/module?page=1&lang=en"
# → {"title":"More Recommendations","total":10,"videos":[{"id":"15390","title":"The Rescue I Never Had",...}]}

curl "https://dramabite.goodbos.online/languages"
# → [{"code":"en"},{"code":"id"},{"code":"ar"},{"code":"tr"},{"code":"es"},{"code":"de"},{"code":"fr"},...]
```

---

### netshort.goodbos.online (NetShort)

**Base:** `https://netshort.goodbos.online`

| Endpoint | Auth | |
|---|---|---|
| `GET /api/categories?lang={lang}` | ❌ **GRATIS** | ✅ filter region/genre |
| `GET /api/banner?lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /api/home/{n}?lang={lang}` | ❌ **GRATIS** | ✅ drama list paginasi |
| `GET /api/search?q={q}&page={n}&lang={lang}` | ❌ **GRATIS** | ✅ |

```bash
curl "https://netshort.goodbos.online/api/home/1?lang=en"
# → {"data":{"contentName":"More Recommended","contentInfos":[{"shortPlayName":"The Fake Heiress Striking Back",...}]}}

curl "https://netshort.goodbos.online/api/search?q=love+story&page=1&lang=en"
curl "https://netshort.goodbos.online/api/categories?lang=en"
```

---

### raptdrama.goodbos.online (RaptDrama)

**Base:** `https://raptdrama.goodbos.online` | CDN image: `apis.raptdrama.com`

| Endpoint | Auth | |
|---|---|---|
| `GET /api/home?page={n}&lang={lang}` | ❌ **GRATIS** | ✅ |
| `GET /api/search?q={q}&lang={lang}` | ❌ Gratis | ⚠️ kosong (EN) |
| `GET /api/detail?id={id}&lang={lang}` | ❌ **GRATIS** | ✅ |

```bash
curl "https://raptdrama.goodbos.online/api/home?page=1&lang=en"
# → {"code":200,"data":{"items":[{"id":2278,"title":"The Doctor Who Knows My Body",...}]}}

curl "https://raptdrama.goodbos.online/api/detail?id=2278&lang=en"
# → {"code":200,"data":{"id":2278,"title":"The Doctor Who Knows My Body","desc":"..."}}
```

---

## Ringkasan Endpoint GRATIS (Tanpa Auth)

| Domain | Provider | Gratis | HLS |
|---|---|---|---|
| `dramabox.goodbos.online` | DramaBox | `/api/v1/search` | ❌ |
| `flickreels.goodbos.online` | FlickReels | `/api/home`, `/api/list`, `/languages` | ❌ |
| `reelshort.goodbos.online` | ReelShort | `/home`, `/search`, `/detail`, `/trending`, `/validate` | ❌ |
| `goodshort.goodbos.online` | GoodShort | `/nav`, `/home`, **/episode** | **✅** |
| `melolo.goodbos.online` | Melolo | `/api/search` | ❌ |
| `idrama.goodbos.online` | iDrama | `/home`, `/search` | ❌ |
| `dramabite.goodbos.online` | DramaBite | `/home`, `/module`, `/languages` | ❌ |
| `netshort.goodbos.online` | NetShort | `/api/home`, `/api/search`, `/api/categories` | ❌ |
| `raptdrama.goodbos.online` | RaptDrama | `/api/home`, `/api/detail` | ❌ |

> ⭐ **Best HLS gratis:** `goodshort.goodbos.online/episode/?bookId={id}&ep={n}`
> M3U8 langsung + CDN `v3-akm.goodreels.com` dengan `__token__`, wajib Referer
>
> ⭐ **Best search gratis:** `reelshort.goodbos.online/search?q={q}&lang=en`
> Data ReelShort lengkap, multi-tab home

---

*Recon: DramaAPI Explorer | 2026-06-29*
