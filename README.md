# Kavara — Portfolio

Portfolio pribadi satu halaman. HTML, CSS, dan JavaScript murni — tanpa framework, tanpa build step.

## Menjalankan lokal

```bash
cd C:\Users\ASUS\kavara80.github.io
python -m http.server 8123
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
│   └── i18n.js             # kamus ID/EN
├── assets/
│   ├── cv.pdf              # CV (placeholder — ganti)
│   ├── favicon.svg
│   ├── icon-192.png        # ikon PWA / iOS
│   ├── icon-512.png
│   ├── og-image.png        # 1200×630
│   └── projects/           # thumbnail 800×500
├── manifest.webmanifest
├── sw.js                   # service worker (offline shell)
├── robots.txt
└── sitemap.xml
```

## Yang perlu diganti

| Cari | Ganti dengan |
|---|---|
| `Kavara` | Nama kamu (title, hero, footer, JSON-LD, manifest) |
| `hello@kavara.dev` | Email kamu (`index.html` **dan** `const EMAIL` di `js/main.js`) |
| `https://github.com/kavara80` | URL GitHub kamu |
| `https://kavara80.github.io` | Domain kamu (canonical, OG, JSON-LD, sitemap) |
| `assets/cv.pdf` | CV asli kamu (nama file tetap) |
| `assets/projects/*.svg` | Screenshot project (rasio 8:5, misal 800×500) |
| `WEB3FORMS_KEY` | Access key dari web3forms.com (opsional) |

### Form kontak

- **Tanpa key**: tombol kirim membuka aplikasi email dengan isi form sudah terisi.
- **Dengan key**: isi `var WEB3FORMS_KEY = "..."` di `js/main.js`, lalu form terkirim
  langsung tanpa keluar dari halaman.

### Menambah project

Duplikat satu `<article class="card">` di `index.html`, sesuaikan `data-category`
(`app` / `landing` / `experiment`), gambar, judul, deskripsi, link, dan isi
`<template class="project-detail">`. Tambahkan key `p7.*` di `js/i18n.js` (dua bahasa).

## Deploy ke GitHub Pages

Repo: `kavara80/kavara80.github.io` — Settings → Pages → Deploy from a branch → `main` / root.

```bash
git add -A
git commit -m "Rebuild portfolio"
git push
```

## Catatan

- Service worker hanya didaftarkan di HTTPS, supaya cache tidak mengganggu saat development.
- Animasi dimatikan otomatis saat `prefers-reduced-motion: reduce`.
- `.reveal` punya jaring pengaman: kalau `main.js` gagal dimuat, konten tetap terlihat.
