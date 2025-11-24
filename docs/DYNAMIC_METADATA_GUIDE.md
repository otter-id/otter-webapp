# Panduan Dynamic Metadata untuk Store Pages

## Overview

Implementasi ini menambahkan dynamic metadata (SEO dan Open Graph tags) untuk setiap halaman store, sehingga:
- **Title browser** berubah sesuai nama store
- **Link preview di WhatsApp, Facebook, Twitter, dll** menampilkan nama store, logo, dan deskripsi yang tepat
- Metadata di-render di **server-side** untuk optimal SEO dan social sharing

## Struktur Implementasi

### 1. **Server-side Data Fetching** (`lib/getRestaurantData.ts`)

Fungsi utility untuk fetch data restaurant dari backend di server-side:

```typescript
export async function getRestaurantData(
  restaurantId: string
): Promise<Restaurant | null>
```

**Fitur:**
- Fetch dari API dengan revalidation (60 detik)
- Handle error dengan graceful fallback
- Check `isPublished` status
- Return `null` jika restaurant tidak ditemukan

### 2. **Client Component** (`components/order/FoodOrderingClient.tsx`)

Component client yang berisi semua logic ordering yang sebelumnya ada di `page.tsx`:
- State management untuk cart, modals, drawer
- Event handlers untuk add to cart, edit, delete items
- UI rendering dengan skeleton loading states

### 3. **Server Component dengan Metadata** (`app/(order)/store/[id]/page.tsx`)

Server component yang:
- Export `generateMetadata()` untuk dynamic metadata
- Render `FoodOrderingClient` dengan storeId

## Format Metadata yang Dihasilkan

### Jika Store Ditemukan:

```typescript
{
  title: "{storeName} – Order Online",
  description: "Order at {storeName}. {storeLocation}",
  openGraph: {
    title: "{storeName} – Order Online",
    description: "Order at {storeName}. {storeLocation}",
    images: [{
      url: "{storeLogoUrl}",
      width: 1200,
      height: 630,
      alt: "{storeName}"
    }]
  }
}
```

**Contoh:**
- **Title**: `Sharetea – Order Online`
- **Description**: `Order at Sharetea. Mal Taman Anggrek`
- **Image**: Logo atau gambar store

### Jika Store Tidak Ditemukan (Fallback):

```typescript
{
  title: "Otter – Order Online",
  description: "Order food and drinks online with Otter",
  openGraph: {
    title: "Otter – Order Online",
    description: "Order food and drinks online with Otter",
    images: [{ url: "https://app.otter.id/og-default.png" }]
  }
}
```

## File yang Berubah

### 1. **File Baru:**
- `lib/getRestaurantData.ts` - Utility function untuk fetch restaurant data
- `components/order/FoodOrderingClient.tsx` - Client component untuk ordering logic
- `docs/DYNAMIC_METADATA_GUIDE.md` - Dokumentasi ini

### 2. **File yang Diubah:**
- `app/(order)/store/[id]/page.tsx` - Direfactor dari client component menjadi server component dengan `generateMetadata()`

### 3. **File yang Tidak Berubah:**
- Semua hooks (`useCart`, `useRestaurant`, `useScroll`)
- Semua child components (CartDrawer, ItemDrawer, MenuItem, dll)
- Type definitions
- Styling

## Cara Testing Link Preview WhatsApp

### Opsi 1: Testing di Development (Localhost)

**⚠️ Catatan**: WhatsApp tidak bisa akses localhost. Anda perlu expose URL ke internet.

#### Menggunakan ngrok:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   # atau
   brew install ngrok/ngrok/ngrok
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   # Server berjalan di http://localhost:3000
   ```

3. **Expose dengan ngrok:**
   ```bash
   ngrok http 3000
   ```
   
   Ngrok akan memberikan URL publik seperti:
   ```
   https://abc123.ngrok.io
   ```

4. **Test di WhatsApp:**
   - Buka WhatsApp (web atau mobile)
   - Kirim URL ke chat: `https://abc123.ngrok.io/store/[storeId]`
   - WhatsApp akan fetch metadata dan menampilkan preview

### Opsi 2: Testing di Production/Staging

1. **Deploy aplikasi ke production/staging**
   ```bash
   # Build aplikasi
   npm run build
   
   # Deploy ke platform pilihan (Vercel, Netlify, dll)
   vercel deploy
   ```

2. **Test URL production:**
   - Kirim URL production ke WhatsApp: `https://yourapp.com/store/[storeId]`
   - Lihat preview yang muncul

### Opsi 3: Testing dengan Meta Debugger (Tanpa WhatsApp)

**Facebook/Meta Sharing Debugger** bisa digunakan untuk test OG tags tanpa perlu kirim ke WhatsApp dulu:

1. **Buka Meta Debugger:**
   - https://developers.facebook.com/tools/debug/

2. **Masukkan URL:**
   - Input: `https://yourapp.com/store/[storeId]`
   - Klik "Debug"

3. **Lihat hasil:**
   - Title, description, image yang akan muncul
   - Error atau warning jika ada
   - Klik "Scrape Again" jika update metadata

4. **Preview untuk platform lain:**
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### Opsi 4: Testing dengan Webhook.site

Untuk debugging metadata tanpa WhatsApp:

1. **Buka**: https://webhook.site
2. **Copy unique URL** yang diberikan
3. **Gunakan curl atau Postman** untuk fetch halaman Anda dengan custom User-Agent:
   ```bash
   curl -A "WhatsApp" https://yourapp.com/store/[storeId]
   ```
4. **Inspect HTML** yang direturn untuk cek meta tags

## Verifikasi Metadata Berhasil

### 1. **View Page Source**

Buka halaman store di browser dan View Page Source (Ctrl+U atau Cmd+Option+U):

Cari meta tags ini di HTML:

```html
<title>Sharetea – Order Online</title>
<meta name="description" content="Order at Sharetea. Mal Taman Anggrek">

<!-- Open Graph -->
<meta property="og:title" content="Sharetea – Order Online">
<meta property="og:description" content="Order at Sharetea. Mal Taman Anggrek">
<meta property="og:image" content="https://franchise.sharetea.com.au/.../logo.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Otter">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sharetea – Order Online">
<meta name="twitter:description" content="Order at Sharetea. Mal Taman Anggrek">
<meta name="twitter:image" content="https://franchise.sharetea.com.au/.../logo.png">
```

### 2. **Check Network Tab (Dev Tools)**

1. Buka Dev Tools (F12)
2. Tab Network
3. Refresh halaman
4. Klik request pertama (document)
5. Di tab "Response", pastikan meta tags sudah ada di HTML response awal

**✅ Good**: Meta tags ada di initial HTML response (SSR)
**❌ Bad**: Meta tags tidak ada atau muncul setelah JavaScript load (CSR)

### 3. **Test dengan curl**

```bash
# Fetch HTML dari server
curl -s https://yourapp.com/store/675c6c400035d189ce4a | grep -i "og:title"

# Should return something like:
# <meta property="og:title" content="Sharetea – Order Online">
```

## Troubleshooting

### Problem: Link preview tidak muncul di WhatsApp

**Possible causes:**

1. **URL tidak public accessible**
   - ✅ Solution: Pastikan URL bisa diakses dari internet (gunakan ngrok untuk localhost)

2. **WhatsApp cache old preview**
   - ✅ Solution: Gunakan URL parameter untuk force refresh: `?v=2`
   - Atau gunakan Meta Debugger dan klik "Scrape Again"

3. **Image URL tidak valid atau blocked**
   - ✅ Solution: 
     - Pastikan image URL menggunakan HTTPS
     - Image bisa diakses public (tidak ada auth)
     - Image size < 8MB (WhatsApp limit)
     - Format image: JPG, PNG (recommended)

4. **Metadata tidak di-render di server-side**
   - ✅ Solution: Verify dengan "View Page Source" bahwa meta tags ada di initial HTML

### Problem: Preview menampilkan data lama

**Solution:**

1. **Clear WhatsApp cache:**
   - Kirim URL dengan query parameter berbeda: `?v=1`, `?v=2`, dll
   
2. **Clear Meta/Facebook cache:**
   - Buka https://developers.facebook.com/tools/debug/
   - Input URL dan klik "Scrape Again"

3. **Verify server cache:**
   - Check revalidation di `getRestaurantData.ts` (default: 60 detik)
   - Bisa ubah jadi lebih kecil untuk testing: `next: { revalidate: 10 }`

### Problem: Title tidak berubah di browser tab

**Check:**

1. Buka Dev Tools Console
2. Cari error/warning dari Next.js
3. Pastikan `generateMetadata()` tidak throw error
4. Verify bahwa `params.id` valid dan restaurant ditemukan

**Debug generateMetadata:**

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  console.log("Generating metadata for store:", id); // Add logging
  
  const restaurant = await getRestaurantData(id);
  console.log("Restaurant data:", restaurant); // Verify data
  
  // ... rest of code
}
```

## Best Practices

### 1. **Image Optimization untuk OG Images**

Gunakan image dengan specs optimal:
- **Dimension**: 1200x630px (aspect ratio 1.91:1)
- **Format**: JPG atau PNG
- **Size**: < 1MB untuk loading cepat
- **URL**: HTTPS, publicly accessible

### 2. **Description Length**

- **Optimal**: 150-160 karakter
- Terlalu panjang akan terpotong di preview
- Terlalu pendek kurang informatif

### 3. **Revalidation Strategy**

Sesuaikan revalidation time di `getRestaurantData.ts`:

```typescript
// Frequent updates (e.g. menu availability)
next: { revalidate: 30 }  // 30 detik

// Moderate updates (e.g. store info)
next: { revalidate: 300 }  // 5 menit

// Rare updates (e.g. store metadata)
next: { revalidate: 3600 }  // 1 jam
```

### 4. **Error Handling**

Selalu provide fallback metadata:
- Jangan throw error di `generateMetadata()`
- Return default metadata jika data fetch gagal
- Log error untuk monitoring

## Environment Variables Required

Pastikan environment variable ini ter-set:

```env
# .env.local atau production environment
NEXT_PUBLIC_API_URL=https://api.otter.id/v1
```

Untuk development, bisa menggunakan mock API atau actual API endpoint.

## Testing Checklist

Sebelum deploy ke production, pastikan test ini pass:

- [ ] View Page Source: Meta tags muncul di initial HTML
- [ ] Browser tab: Title berubah sesuai store name
- [ ] Meta Debugger: Semua OG tags terdeteksi dengan benar
- [ ] WhatsApp preview: Image, title, description muncul correct
- [ ] Store tidak ditemukan: Fallback metadata muncul
- [ ] Multiple stores: Setiap store punya metadata berbeda
- [ ] Network slow: Revalidation dan caching bekerja

## Support

Untuk masalah atau pertanyaan:
- Check Next.js metadata docs: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Check Open Graph protocol: https://ogp.me/
- Contact: development team

---

**Last Updated**: November 2025
**Version**: 1.0.0

