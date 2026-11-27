/* =========================================================
   sw.js — offline shell
   Hanya didaftarkan di production (https), lihat main.js
   ========================================================= */
var CACHE = "kavara-portfolio-v5";

var SHELL = [
  "./",
  "index.html",
  "css/style.css?v=5",
  "js/main.js?v=5",
  "js/i18n.js?v=5",
  "manifest.webmanifest",
  "assets/favicon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/og-image.jpg",
  "assets/avatar.jpg",
  "assets/reel-poster.jpg",
  "assets/bg-hero.jpg",
  "assets/moon.png",
  "assets/fonts/LEMONMILK-Light.otf",
  "assets/fonts/LEMONMILK-Regular.otf",
  "assets/fonts/LEMONMILK-Medium.otf",
  "assets/fonts/LEMONMILK-Bold.otf",
  "assets/projects/wcc.svg",
  "assets/projects/wedding-edit.svg",
  "assets/projects/wedding-video.svg",
  "assets/projects/wedding-content.svg",
  "assets/projects/social-content.svg",
  "assets/projects/graphic-design.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(
        SHELL.map(function (url) {
          return cache.add(url).catch(function () { /* lewati file yang belum ada */ });
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML: network first, fallback ke cache
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
        return response;
      }).catch(function () {
        return caches.match(request).then(function (hit) {
          return hit || caches.match("index.html");
        });
      })
    );
    return;
  }

  // Aset: tampilkan cache dulu, tapi tetap ambil versi baru di belakang
  // (stale-while-revalidate) supaya update CSS/JS/gambar tidak tertahan.
  event.respondWith(
    caches.match(request).then(function (hit) {
      var network = fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      }).catch(function () { return hit; });

      return hit || network;
    })
  );
});
