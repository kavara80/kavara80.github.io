# Kavara — Portfolio

Portfolio pribadi satu halaman untuk **Ardinuari Angga Chavara** — video editor & videographer.
HTML, CSS, dan JavaScript murni — tanpa framework, tanpa build step.

Live: **https://kavara80.github.io**

## Menjalankan lokal

```bash
cd ~/Documents/kavara80.github.io
python3 -m http.server 8123
# buka http://127.0.0.1:8123/
```

Atau buka `index.html` langsung di browser (semua fitur jalan kecuali service worker,
yang memang hanya didaftarkan di HTTPS).

## Struktur

```
├── index.html              # markup + konten
├── css/style.css           # token, layout, tema, komponen
├── js/
│   ├── main.js             # nav, tema, bahasa, palette, filter, modal, form
│   ├── moon.js             # perhitungan fase bulan
│   └── i18n.js             # kamus ID/EN + frasa typing
├── assets/
│   ├── avatar.jpg          # foto profil (dari CV)
│   ├── cv.pdf              # CV asli
│   ├── favicon.svg
│   ├── icon-192.png        # ikon PWA / iOS
│   ├── icon-512.png
│   ├── og-image.jpg        # 1200×630 (share preview)
│   └── projects/           # thumbnail 800×500
├── manifest.webmanifest
├── sw.js                   # service worker (offline shell)
├── robots.txt
└── sitemap.xml
```

## Data yang dipakai

| Field | Nilai |
|---|---|
| Nama | Ardinuari Angga Chavara |
| Nama tampil | Kavara |
| Role | Video Editor · Videographer · Content Creator · Social Media Manager |
| Lokasi | Pontianak, Kalimantan Barat |
| Email | ardinuariangga@gmail.com |
| Instagram | [@by_kavara01](https://instagram.com/by_kavara01) |
| Status | Freelance / Open to Projects |

## Yang perlu diganti saat update

| Cari | Ganti dengan |
|---|---|
| `ardinuariangga@gmail.com` | Email baru (`index.html` **dan** `const EMAIL` di `js/main.js`) |
| `assets/avatar.jpg` | Foto profil baru (rasio 1:1) |
| `assets/cv.pdf` | CV terbaru (nama file tetap) |
| `assets/projects/*.svg` | Screenshot project (rasio 8:5, misal 800×500) |
| `assets/og-image.jpg` | Gambar share 1200×630 |
| `WEB3FORMS_KEY` | Access key dari web3forms.com (opsional) |

### Form kontak

- **Tanpa key**: tombol kirim membuka aplikasi email dengan isi form sudah terisi.
- **Dengan key**: isi `var WEB3FORMS_KEY = "..."` di `js/main.js`, lalu form terkirim
  langsung tanpa keluar dari halaman.

### Menambah project

Duplikat satu `<article class="card">` di `index.html`, sesuaikan `data-category`
(`video` / `social` / `design`), gambar, judul, deskripsi, dan isi
`<template class="project-detail">`. Tambahkan key `p7.*` di `js/i18n.js` (dua bahasa).

### Tema

Warna diatur lewat token di `css/style.css`:

```css
--brand: #3B6CF6;        /* royal blue */
--brand-light: #7CE8FF;  /* cyan */
--brand-deep: #24479E;
```

Ganti tiga nilai itu (versi dark dan light) untuk mengubah seluruh aksen situs.

## Deploy ke GitHub Pages

Repo: `kavara80/kavara80.github.io` — Settings → Pages → Deploy from a branch → `main` / root.

```bash
git add -A
git commit -m "Update konten"
git push
```

## Catatan

- Service worker hanya didaftarkan di HTTPS, supaya cache tidak mengganggu saat development.
- Animasi dimatikan otomatis saat `prefers-reduced-motion: reduce`.
- `.reveal` punya jaring pengaman: kalau `main.js` gagal dimuat, konten tetap terlihat.
