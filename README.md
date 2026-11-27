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
│   └── i18n.js             # kamus ID/EN + frasa typing
├── assets/
│   ├── avatar.jpg          # foto profil (dari CV)
│   ├── bg-hero.jpg         # latar langit malam di hero (1120×530)
│   ├── moon.png            # bulan sabit transparan (380×371)
│   ├── reel-poster.jpg     # poster kartu showreel di hero (720×900)
│   ├── cv.pdf              # CV asli
│   ├── fonts/              # Lemon Milk (Light/Regular/Medium/Bold .otf)
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
| Instagram | [@bykavara_01](https://instagram.com/bykavara_01) |
| Status | Freelance / Open to Projects |

## Yang perlu diganti saat update

| Cari | Ganti dengan |
|---|---|
| `ardinuariangga@gmail.com` | Email baru (`index.html` **dan** `const EMAIL` di `js/main.js`) |
| `assets/avatar.jpg` | Foto profil baru (rasio 1:1) |
| `assets/reel-poster.jpg` | Poster kartu showreel (rasio 4:5, misal 720×900) |
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

### Portofolio video

Video **jangan** di-commit ke repo (repo GitHub Pages cepat membengkak).
Upload ke YouTube / Vimeo (bisa *unlisted*), lalu tambahkan atribut
`data-video` di `<article class="card">`:

```html
<article class="card reveal" data-category="video"
         data-video="https://youtu.be/XXXXXXXXXXX">
```

Format link yang dikenali otomatis:

| Sumber | Contoh |
|---|---|
| YouTube | `https://youtu.be/XXXXXXXXXXX` atau `https://www.youtube.com/watch?v=XXXXXXXXXXX` |
| YouTube Shorts | `https://youtube.com/shorts/XXXXXXXXXXX` |
| Vimeo | `https://vimeo.com/123456789` |
| File lokal | `assets/videos/nama-file.mp4` (`.mp4` / `.webm` / `.mov`) |

Begitu `data-video` dipasang:

- Ikon ⤢ di pojok thumbnail berubah jadi tombol **play** (selalu kelihatan).
- Klik thumbnail **atau** "Detail" membuka modal dengan player 16:9.
- Video otomatis berhenti saat modal ditutup.

Thumbnail tetap butuh gambar sebagai poster — pakai frame menarik dari videonya
(1600×1000, JPG, di bawah ~300 KB).

> Untuk file lokal, taruh di `assets/videos/` dan pastikan ukurannya wajar
> (idealnya < 10 MB). Kalau lebih besar, pakai YouTube/Vimeo saja.

### Portofolio desain

Untuk karya desain, tidak perlu `data-video` — cukup ganti gambar:

```html
<button class="card__thumb" type="button"
        data-lightbox="assets/projects/poster-1.jpg"
        data-caption="Poster — Judul Karya">
  <img src="assets/projects/poster-1.jpg" alt="Poster Judul Karya"
       loading="lazy" width="1600" height="1000" />
  <span class="card__zoom" aria-hidden="true">⤢</span>
</button>
```

- Rasio gambar **8:5** (misal 1600×1000). Gambar lain akan ter-*crop* otomatis.
- `data-lightbox` = versi besar, `src` = versi thumbnail. Boleh file yang sama.
- Klik thumbnail membuka lightbox layar penuh.

### Template kartu siap tempel

```html
<!-- ===== Project baru ===== -->
<article class="card reveal" data-category="video"
         data-video="https://youtu.be/XXXXXXXXXXX">
  <button class="card__thumb" type="button"
          data-lightbox="assets/projects/poster-baru.jpg"
          data-caption="Judul Karya Baru">
    <img src="assets/projects/poster-baru.jpg" alt="Judul Karya Baru"
         loading="lazy" width="1600" height="1000" />
    <span class="card__zoom" aria-hidden="true">⤢</span>
  </button>
  <div class="card__body">
    <div class="card__meta">
      <span class="tag">Video</span>
      <span class="card__year">2026</span>
    </div>
    <h3 class="card__title">
      <button class="card__title-btn" type="button" data-open-project="p7">Judul Karya Baru</button>
    </h3>
    <p class="card__desc">Satu-dua kalimat tentang project ini.</p>
    <ul class="tags"><li>Editing</li><li>Color Grading</li></ul>
    <div class="card__actions">
      <button class="link-btn" type="button" data-open-project="p7">Detail</button>
    </div>
  </div>
  <template class="project-detail">
    <p>Cerita singkat project: brief, proses, dan hasilnya.</p>
    <p class="detail__label">Peran</p>
    <p>Video Editor</p>
    <p class="detail__label">Yang dikerjakan</p>
    <ul class="detail__list">
      <li>Poin pertama</li>
      <li>Poin kedua</li>
    </ul>
  </template>
</article>
```

Catatan: `data-open-project="p7"` hanya perlu unik — tidak harus `p7`, dan
tidak dipakai untuk lookup apa pun. Teks di template ini **tanpa** `data-i18n`,
jadi tampil sama di ID maupun EN. Kalau mau dua bahasa, tambahkan key
`p7.*` di kedua kamus `js/i18n.js` dan pasang `data-i18n="p7.d"` dst.

Jangan lupa: setelah mengubah CSS/JS, naikkan versi cache (lihat bagian
[Cache & service worker](#cache--service-worker)).

### Tema

Warna diatur lewat token di `css/style.css`:

```css
--brand: #3B6CF6;        /* royal blue */
--brand-light: #7CE8FF;  /* cyan */
--brand-deep: #24479E;
```

Ganti tiga nilai itu (versi dark dan light) untuk mengubah seluruh aksen situs.

### Tipografi

- **Judul & teks tebal** → `Lemon Milk` (self-hosted di `assets/fonts/`).
  Versi gratisnya hanya punya huruf kapital, jadi semua judul otomatis
  uppercase dengan letter-spacing lebar.
- **Body & paragraf** → `Inter` (Google Fonts).

Kalau ganti font judul, cukup ubah `--font-display` dan blok `@font-face`
di bagian atas `css/style.css`.

### Cache & service worker

CSS/JS di-*cache* oleh service worker, jadi setiap kali mengubah
`css/style.css` atau file di `js/`:

1. Naikkan angka versi di `index.html` — `css/style.css?v=5` → `?v=6`
   (sama untuk `js/i18n.js` dan `js/main.js`).
2. Naikkan `CACHE = "kavara-portfolio-v5"` di `sw.js` → `v6`.
3. Kalau ada aset gambar/font baru, tambahkan juga ke array `SHELL` di `sw.js`.

Kalau langkah ini dilewati, pengunjung lama bisa melihat campuran CSS lama
dan HTML baru (layout berantakan) sampai cache mereka kedaluwarsa.

## Deploy ke GitHub Pages

Repo: `kavara80/kavara80.github.io` — Settings → Pages → Deploy from a branch → `main` / root.

```bash
git add -A
git commit -m "Update konten"
git push
```

## Catatan

- Service worker hanya didaftarkan di HTTPS, supaya cache tidak mengganggu saat development.
- Aset dilayani *stale-while-revalidate*: cepat dari cache, tapi tetap diperbarui di latar belakang.
- Animasi dimatikan otomatis saat `prefers-reduced-motion: reduce`.
- `.reveal` punya jaring pengaman: kalau `main.js` gagal dimuat, konten tetap terlihat.
- Font **Lemon Milk** dari [fontkong](https://www.fontkong.com/) — gratis untuk pemakaian
  pribadi; untuk komersial sebaiknya donasi/lisensi ke pembuatnya.
