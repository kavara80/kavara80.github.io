/* =========================================================
   moon.js — fase bulan dari tanggal (bukan gambar statis)
   Synodic month 29.530588853 hari, epoch bulan baru 2000-01-06 18:14 UTC
   ========================================================= */
(function () {
  "use strict";

  var SYNODIC = 29.530588853;
  var EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);
  var DAY = 86400000;

  var NAMES = {
    id: ["Bulan Baru", "Sabit Muda", "Kuartal Pertama", "Cembung Muda", "Purnama", "Cembung Tua", "Kuartal Akhir", "Sabit Tua"],
    en: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"]
  };

  var phaseEl = document.getElementById("moonPhase");
  var dateEl = document.getElementById("moonDate");
  var pctEl = document.getElementById("moonPct");
  var barEl = document.getElementById("moonIllum");
  var shadowEl = document.getElementById("moonShadow");
  var svgEl = document.getElementById("moonSvg");

  if (!phaseEl || !shadowEl) return;

  function phaseValue(date) {
    var cycles = (date.getTime() - EPOCH) / DAY / SYNODIC;
    return cycles - Math.floor(cycles);
  }

  function currentLang() {
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "id";
  }

  function render() {
    var lang = currentLang();
    var now = new Date();
    var phase = phaseValue(now);

    // iluminasi 0..1 dari sudut fase
    var illum = (1 - Math.cos(phase * Math.PI * 2)) / 2;
    var idx = Math.round(phase * 8) % 8;

    phaseEl.textContent = NAMES[lang][idx];
    dateEl.textContent = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);

    pctEl.textContent = Math.round(illum * 100) + "%";
    if (barEl) barEl.style.width = (illum * 100).toFixed(1) + "%";

    // Geser lingkaran bayangan: f=0 tertutup penuh, f=1 keluar penuh.
    // Waxing (0..0.5) lit di kanan, jadi bayangan digeser ke kiri.
    var dx = illum * 104;
    if (phase < 0.5) dx = -dx;
    shadowEl.setAttribute("cx", (100 + dx).toFixed(2));

    if (svgEl) {
      svgEl.setAttribute(
        "aria-label",
        (lang === "en" ? "Moon phase today: " : "Fase bulan hari ini: ") +
          NAMES[lang][idx] +
          ", " +
          Math.round(illum * 100) +
          "%"
      );
    }
  }

  render();
  document.addEventListener("langchange", render);

  // Segarkan tiap jam kalau tab dibiarkan terbuka melewati tengah malam
  setInterval(render, 3600000);
})();
