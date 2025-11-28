# Dynamic Metadata Implementation Summary

## ✅ Implementasi Selesai

Dynamic metadata untuk store pages telah berhasil diimplementasikan dengan server-side rendering (SSR).

## 📋 File yang Berubah

### 1. **File Baru**

| File | Deskripsi |
|------|-----------|
| `lib/getRestaurantData.ts` | Server-side utility untuk fetch data restaurant dari API |
| `components/order/FoodOrderingClient.tsx` | Client component dengan semua logic ordering (extracted dari page.tsx) |
| `docs/DYNAMIC_METADATA_GUIDE.md` | Dokumentasi lengkap dengan panduan testing |

### 2. **File yang Diubah**

| File | Perubahan |
|------|-----------|
| `app/(order)/store/[id]/page.tsx` | Direfactor dari client component ke server component dengan `generateMetadata()` |

## 🎯 Metadata Output

### Format Metadata per Store

```typescript
{
  title: "{storeName} – Order Online",
  description: "Order at {storeName}. {storeLocation}",
  openGraph: {
    title: "{storeName} – Order Online",
    description: "Order at {storeName}. {storeLocation}",
    images: [{ url: "{storeLogoUrl}", width: 1200, height: 630 }]
  }
}
```

### Contoh Real Output

**Store: Sharetea (ID: 675c6c400035d189ce4a)**

```
Title: Sharetea – Order Online
Description: Order at Sharetea. Mal Taman Anggrek
OG Image: https://franchise.sharetea.com.au/.../cropped-Favicon.png
```

### Fallback (Store Tidak Ditemukan)

```
Title: Otter – Order Online
Description: Order food and drinks online with Otter
OG Image: https://app.otter.id/og-default.png
```

## 🧪 Cara Testing Link Preview WhatsApp

### Quick Testing (3 Opsi):

#### Opsi 1: Development dengan ngrok
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Expose dengan ngrok
ngrok http 3000

# Test di WhatsApp dengan URL ngrok
https://abc123.ngrok.io/store/675c6c400035d189ce4a
```

#### Opsi 2: Meta Debugger (Recommended untuk Quick Test)
1. Buka: https://developers.facebook.com/tools/debug/
2. Paste URL: `https://yourapp.com/store/675c6c400035d189ce4a`
3. Klik "Debug"
4. Verify: Title, Description, Image

#### Opsi 3: Production Testing
```bash
# Deploy ke production
vercel deploy

# Test URL production di WhatsApp
https://yourapp.com/store/675c6c400035d189ce4a
```

## ✅ Verification Checklist

Untuk memastikan implementasi sukses:

```bash
# 1. Check meta tags di HTML source
curl -s https://yourapp.com/store/675c6c400035d189ce4a | grep "og:title"

# Expected output:
# <meta property="og:title" content="Sharetea – Order Online">

# 2. Check description
curl -s https://yourapp.com/store/675c6c400035d189ce4a | grep "og:description"

# 3. Check image
curl -s https://yourapp.com/store/675c6c400035d189ce4a | grep "og:image"
```

### Manual Verification:

1. ✅ **Browser Tab**: Title berubah per store
2. ✅ **View Page Source (Ctrl+U)**: Meta tags ada di initial HTML
3. ✅ **Meta Debugger**: Semua OG tags valid
4. ✅ **WhatsApp Preview**: Image, title, description muncul
5. ✅ **Invalid Store ID**: Fallback metadata muncul

## 🔧 Konfigurasi Required

### Environment Variables

```env
# Required di .env.local atau production environment
NEXT_PUBLIC_API_URL=https://api.otter.id/v1
```

### Next.js Configuration

Sudah configured di `next.config.mjs`:
- Image domains untuk logo/images
- Remote patterns untuk external images

## 📊 How It Works (Architecture)

```
User Request
    ↓
Server Component (page.tsx)
    ↓
generateMetadata()
    ↓
getRestaurantData() → Fetch dari API
    ↓
Return Metadata → Next.js injects to <head>
    ↓
Render FoodOrderingClient (Client Component)
    ↓
HTML with Meta Tags sent to Browser/Bot
```

**Key Points:**
- ✅ Metadata generated di **server-side** (build time / on-demand)
- ✅ Meta tags ada di **initial HTML response**
- ✅ WhatsApp/Facebook bots bisa read metadata langsung
- ✅ Client component fetch data separately (progressive enhancement)

## 🐛 Troubleshooting

### Problem: Preview tidak muncul

**Solutions:**
1. Verify URL accessible publicly (ngrok untuk localhost)
2. Force refresh: tambah query param `?v=1`
3. Check image URL (HTTPS, < 8MB, public access)

### Problem: Preview menampilkan data lama

**Solutions:**
1. WhatsApp cache: `?v=2`, `?v=3`, dll
2. Meta Debugger: klik "Scrape Again"
3. Check revalidation time di `getRestaurantData.ts`

### Problem: Title tidak berubah

**Check:**
1. `generateMetadata()` tidak error
2. `params.id` valid
3. Restaurant API endpoint responding
4. View Page Source untuk verify meta tags

## 📚 Dokumentasi Lengkap

Untuk panduan detail, best practices, dan advanced troubleshooting:

👉 **Baca**: `docs/DYNAMIC_METADATA_GUIDE.md`

## 🚀 Next Steps (Optional Improvements)

Untuk enhancement lebih lanjut:

1. **Dynamic OG Image Generator**
   - Generate custom OG image per store
   - Include menu items, promotions, dll
   - Menggunakan `@vercel/og` atau Cloudinary

2. **Structured Data (JSON-LD)**
   - Add restaurant schema
   - Menu items schema
   - Opening hours schema
   - Improve Google search results

3. **Metadata untuk Menu Items**
   - Individual OG tags per menu item
   - Deep linking untuk specific items

4. **Analytics Integration**
   - Track clicks dari social media
   - Monitor which stores get shared most

---

**Status**: ✅ Production Ready
**Last Updated**: November 2025

