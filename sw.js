/* =========================================================
   sw.js — offline shell
   Hanya didaftarkan di production (https), lihat main.js
   ========================================================= */
var CACHE = "kavara-portfolio-v4";

var SHELL = [
  "./",
  "index.html",
  "css/style.css",
  "js/main.js",
  "js/i18n.js",
  "manifest.webmanifest",
  "assets/favicon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/og-image.jpg",
  "assets/avatar.jpg",
  "assets/reel-poster.jpg",
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

  // Aset: cache first, lalu network
  event.respondWith(
    caches.match(request).then(function (hit) {
      if (hit) return hit;
      return fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
        return response;
      });
    })
  );
});
