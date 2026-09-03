# VINTAV Payment V2

Read-only personal Payment Center.

## Struktur
- `index.html` — UI
- `style.css` — desain responsive
- `app.js` — logic UI
- `data/payments.js` — **satu-satunya file yang perlu diedit untuk payment**
- `assets/logos/` — icon payment
- `assets/qris/` — QRIS milik Kevin Octavianus dan Raken Market

## Cara menambah payment
Edit `data/payments.js`:

```js
{
  id:"contoh",
  name:"Nama Payment",
  type:"bank", // bank / ewallet
  owner:"Kevin Octavianus",
  number:"1234567890",
  status:"available", // available / unavailable
  favorite:false,
  logo:"assets/logos/contoh.svg"
}
```

Tidak ada form tambah/edit/hapus di website.

## Deploy Vercel
Upload folder ini ke GitHub, lalu import repository tersebut di Vercel.
Karena seluruh aplikasi static, tidak membutuhkan backend atau environment variable.

## Catatan
QRIS adalah aset yang diberikan pengguna dan ditampilkan apa adanya dalam kartu UI. Jangan mengubah data QR code jika QR tersebut akan digunakan untuk pembayaran.
