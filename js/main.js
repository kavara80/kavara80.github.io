/* =========================================================
   main.js — nav, tema, bahasa, palette, filter, modal, form
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  };

  var EMAIL = "ardinuariangga@gmail.com";
  var WEB3FORMS_KEY = ""; // isi access key web3forms.com untuk kirim tanpa keluar halaman
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
    }
  };

  /* ---------------- i18n ---------------- */
  function t(key) {
    var lang = root.getAttribute("lang") === "en" ? "en" : "id";
    var dict = window.I18N || {};
    var table = dict[lang] || {};
    return table[key] || (dict.id && dict.id[key]) || key;
  }

  function applyI18n(scope) {
    $$("[data-i18n]", scope).forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (value) el.textContent = value;
    });
    $$("[data-i18n-aria]", scope).forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-aria"));
      if (value) el.setAttribute("aria-label", value);
    });
    $$("[data-i18n-placeholder]", scope).forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-placeholder"));
      if (value) el.setAttribute("placeholder", value);
    });
  }

  var langLabel = $("#langLabel");
  var langBtn = $("#langBtn");

  function applyLang(lang) {
    root.setAttribute("lang", lang);
    store.set("nk-lang", lang);
    if (langLabel) langLabel.textContent = lang.toUpperCase();
    applyI18n(document);
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function toggleLang() {
    applyLang(root.getAttribute("lang") === "en" ? "id" : "en");
  }

  if (langBtn) langBtn.addEventListener("click", toggleLang);

  /* ---------------- theme ---------------- */
  var themeBtn = $("#themeBtn");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    store.set("nk-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#FBF7EF" : "#070A14");
  }

  function toggleTheme() {
    applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
  }

  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  /* ---------------- typing ---------------- */
  var typingEl = $("#typing");
  var typeTimer = null;
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function roleList() {
    var roles = window.I18N_ROLES || {};
    var lang = root.getAttribute("lang") === "en" ? "en" : "id";
    return roles[lang] || ["Frontend Developer"];
  }

  function stepTyping() {
    var list = roleList();
    var word = list[roleIndex % list.length];

    if (!deleting) {
      charIndex += 1;
      typingEl.textContent = word.slice(0, charIndex);
      if (charIndex >= word.length) {
        deleting = true;
        typeTimer = window.setTimeout(stepTyping, 1900);
        return;
      }
      typeTimer = window.setTimeout(stepTyping, 78);
    } else {
      charIndex -= 1;
      typingEl.textContent = word.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        roleIndex += 1;
        typeTimer = window.setTimeout(stepTyping, 320);
        return;
      }
      typeTimer = window.setTimeout(stepTyping, 38);
    }
  }

  function startTyping() {
    if (!typingEl) return;
    window.clearTimeout(typeTimer);
    roleIndex = 0;
    charIndex = 0;
    deleting = false;
    typingEl.textContent = "";
    if (reduceMotion) {
      typingEl.textContent = roleList()[0];
      return;
    }
    stepTyping();
  }

  /* ---------------- toasts ---------------- */
  var toastHost = $("#toasts");

  function toast(message) {
    if (!toastHost) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    toastHost.appendChild(el);
    window.setTimeout(function () {
      el.classList.add("is-out");
      window.setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  }

  /* ---------------- copy email ---------------- */
  function copyEmail() {
    var fallback = function () {
      var ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast(t("toast.copied"));
      } catch (e) {
        toast(t("toast.copyFail") + EMAIL);
      }
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(function () {
        toast(t("toast.copied"));
      }).catch(fallback);
    } else {
      fallback();
    }
  }

  $$("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", copyEmail);
  });

  /* ---------------- navigation helpers ---------------- */
  function goTo(selector) {
    var target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function goTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ---------------- mobile nav ---------------- */
  var nav = $("#nav");
  var menuBtn = $("#menuBtn");

  function closeNav() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (nav && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav__link", nav).forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || menuBtn.contains(event.target)) return;
      closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------------- command palette ---------------- */
  var palette = $("#palette");
  var paletteInput = $("#paletteInput");
  var paletteList = $("#paletteList");
  var paletteEmpty = $("#paletteEmpty");
  var paletteBtn = $("#paletteBtn");
  var paletteItems = [];
  var paletteActive = 0;

  var ICON = {
    page: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    theme: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>',
    lang: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    top: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>'
  };

  function buildPaletteItems() {
    return [
      { label: t("nav.about"), icon: ICON.page, run: function () { goTo("#about"); } },
      { label: t("nav.skills"), icon: ICON.page, run: function () { goTo("#skills"); } },
      { label: t("nav.projects"), icon: ICON.page, run: function () { goTo("#projects"); } },
      { label: t("nav.experience"), icon: ICON.page, run: function () { goTo("#experience"); } },
      { label: t("nav.contact"), icon: ICON.page, run: function () { goTo("#contact"); } },
      { label: t("palette.theme"), icon: ICON.theme, run: toggleTheme },
      { label: t("palette.lang"), icon: ICON.lang, run: toggleLang },
      { label: t("contact.copy"), icon: ICON.mail, run: copyEmail },
      { label: t("palette.top"), icon: ICON.top, run: goTop }
    ];
  }

  function setPaletteActive(index) {
    if (!paletteItems.length) return;
    paletteActive = (index + paletteItems.length) % paletteItems.length;
    $$(".palette__item", paletteList).forEach(function (el, i) {
      var on = i === paletteActive;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
      if (on && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    });
  }

  function renderPalette(query) {
    if (!paletteList) return;
    paletteItems = buildPaletteItems().filter(function (item) {
      return !query || item.label.toLowerCase().indexOf(query) !== -1;
    });
    paletteList.innerHTML = "";
    paletteActive = 0;

    paletteItems.forEach(function (item, index) {
      var el = document.createElement("div");
      el.className = "palette__item" + (index === 0 ? " is-active" : "");
      el.setAttribute("role", "option");
      el.setAttribute("aria-selected", index === 0 ? "true" : "false");
      el.innerHTML = item.icon + "<span></span>";
      el.lastChild.textContent = item.label;
      el.addEventListener("click", function () { runPaletteItem(item); });
      el.addEventListener("mousemove", function () { setPaletteActive(index); });
      paletteList.appendChild(el);
    });

    if (paletteEmpty) paletteEmpty.hidden = paletteItems.length !== 0;
  }

  function runPaletteItem(item) {
    if (!item) return;
    if (palette && palette.open) palette.close();
    item.run();
  }

  function openPalette() {
    if (!palette || palette.open) return;
    palette.showModal();
    if (paletteInput) {
      paletteInput.value = "";
      renderPalette("");
      paletteInput.focus();
    }
  }

  if (paletteBtn) paletteBtn.addEventListener("click", openPalette);

  if (paletteInput) {
    paletteInput.addEventListener("input", function () {
      renderPalette(paletteInput.value.trim().toLowerCase());
    });
  }

  if (palette) {
    palette.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setPaletteActive(paletteActive + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setPaletteActive(paletteActive - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        runPaletteItem(paletteItems[paletteActive]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        palette.close();
      }
    });

    palette.addEventListener("click", function (event) {
      var rect = palette.getBoundingClientRect();
      var outside = event.clientX < rect.left || event.clientX > rect.right ||
                    event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) palette.close();
    });
  }

  document.addEventListener("keydown", function (event) {
    var key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "k") {
      event.preventDefault();
      if (palette && palette.open) palette.close();
      else openPalette();
    }
  });

  /* ---------------- platform kbd ---------------- */
  var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
  $$(".icon-btn .kbd").forEach(function (kbd) {
    if (!isMac) kbd.textContent = "Ctrl K";
  });

  /* ---------------- reveal ---------------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- counters ---------------- */
  $$(".stat__num").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";

    if (reduceMotion || !("IntersectionObserver" in window)) {
      el.textContent = target + suffix;
      return;
    }

    el.textContent = "0";
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterIO.disconnect();
        var started = performance.now();
        var duration = 1300;
        var frame = function (now) {
          var progress = Math.min(1, (now - started) / duration);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + (progress === 1 ? suffix : "");
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });
    counterIO.observe(el);
  });

  /* ---------------- marquee ---------------- */
  var marqueeTrack = $("#marqueeTrack");
  if (marqueeTrack && !reduceMotion) {
    Array.prototype.slice.call(marqueeTrack.children).forEach(function (node) {
      marqueeTrack.appendChild(node.cloneNode(true));
    });
  }

  /* ---------------- scroll chrome ---------------- */
  var progressBar = $("#progressBar");
  var header = $("#header");
  var toTop = $("#toTop");
  var toTopProgress = $("#toTopProgress");
  var RING = 2 * Math.PI * 19;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      if (progressBar) progressBar.style.width = (ratio * 100).toFixed(2) + "%";
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
      if (toTopProgress) toTopProgress.style.strokeDashoffset = String(RING * (1 - ratio));

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  if (toTop) toTop.addEventListener("click", goTop);

  /* ---------------- project filters ---------------- */
  var chips = $$(".chip");
  var projectGrid = $("#projectGrid");
  var projectEmpty = $("#projectEmpty");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      var filter = chip.getAttribute("data-filter");
      var shown = 0;
      if (projectGrid) {
        $$(".card", projectGrid).forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !match);
          if (match) shown += 1;
        });
      }
      if (projectEmpty) projectEmpty.hidden = shown !== 0;
    });
  });

  /* ---------------- project modal ---------------- */
  var modal = $("#projectModal");
  var modalImg = $("#modalImg");
  var modalVideo = $("#modalVideo");
  var modalTag = $("#modalTag");
  var modalTitle = $("#modalTitle");
  var modalContent = $("#modalContent");

  // Ubah link video jadi player. Mendukung YouTube, Vimeo, Shorts,
  // dan file video lokal (.mp4 / .webm / .mov).
  function buildVideo(url, titleText, posterSrc) {
    var yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    var el;

    if (yt || vm) {
      el = document.createElement("iframe");
      el.src = yt
        ? "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0&modestbranding=1"
        : "https://player.vimeo.com/video/" + vm[1] + "?dnt=1";
      el.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen");
      el.setAttribute("allowfullscreen", "");
      el.setAttribute("title", titleText || "Video");
    } else if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
      el = document.createElement("video");
      el.src = url;
      el.controls = true;
      el.playsInline = true;
      el.preload = "metadata";
      if (posterSrc) el.setAttribute("poster", posterSrc);
    } else {
      // URL embed lain (misal Drive preview) — biarkan apa adanya
      el = document.createElement("iframe");
      el.src = url;
      el.setAttribute("allowfullscreen", "");
      el.setAttribute("title", titleText || "Video");
    }
    return el;
  }

  function clearVideo() {
    if (!modalVideo) return;
    modalVideo.innerHTML = "";
    modalVideo.hidden = true;
  }

  function openProject(card) {
    if (!card || !modal) return;

    var img = card.querySelector(".card__thumb img");
    var tag = card.querySelector(".tag");
    var title = card.querySelector(".card__title");
    var template = card.querySelector("template.project-detail");
    var videoUrl = card.getAttribute("data-video");

    clearVideo();

    if (videoUrl && modalVideo) {
      if (modalImg) modalImg.hidden = true;
      modalVideo.appendChild(buildVideo(videoUrl, title ? title.textContent : "", img ? img.getAttribute("src") : ""));
      modalVideo.hidden = false;
    } else {
      if (modalImg) {
        modalImg.hidden = false;
        modalImg.src = img ? img.getAttribute("src") : "";
        modalImg.alt = img ? (img.getAttribute("alt") || "") : "";
      }
    }

    if (tag && modalTag) modalTag.textContent = tag.textContent;
    if (title && modalTitle) modalTitle.textContent = title.textContent;

    if (modalContent) {
      modalContent.innerHTML = "";
      if (template && template.content) {
        modalContent.appendChild(template.content.cloneNode(true));
      }
      applyI18n(modalContent);
    }

    if (!modal.open) modal.showModal();
  }

  // Tandai card yang punya video supaya ikon zoom berubah jadi tombol play
  $$(".card[data-video]").forEach(function (card) { card.classList.add("is-video"); });

  $$("[data-open-project]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openProject(btn.closest(".card"));
    });
  });

  $$("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    });
  });

  if (modal) {
    modal.addEventListener("close", clearVideo);
    modal.addEventListener("click", function (event) {
      var rect = modal.getBoundingClientRect();
      var outside = event.clientX < rect.left || event.clientX > rect.right ||
                    event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) modal.close();
    });
  }

  /* ---------------- lightbox ---------------- */
  var lightbox = $("#lightbox");
  var lightboxImg = $("#lightboxImg");
  var lightboxCaption = $("#lightboxCaption");

  $$("[data-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Kalau card-nya punya video, klik thumbnail buka modal + player
      var videoCard = btn.closest(".card[data-video]");
      if (videoCard) {
        openProject(videoCard);
        return;
      }

      var src = btn.getAttribute("data-lightbox");
      var caption = btn.getAttribute("data-caption") || "";
      if (!src || !lightbox) return;
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = caption;
      }
      if (lightboxCaption) lightboxCaption.textContent = caption;
      if (!lightbox.open) lightbox.showModal();
    });
  });

  $$("[data-close-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (lightbox) lightbox.close();
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) lightbox.close();
    });
  }

  /* ---------------- contact form ---------------- */
  var form = $("#contactForm");
  if (form) {
    var statusEl = $("#formStatus");
    var submitBtn = $("#submitBtn");
    var submitLabel = submitBtn ? submitBtn.querySelector(".btn__label") : null;

    var setError = function (field, message) {
      var wrap = field.closest(".field");
      var slot = document.querySelector('[data-error-for="' + field.name + '"]');
      if (wrap) wrap.classList.toggle("has-error", Boolean(message));
      if (slot) slot.textContent = message || "";
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.name;
      var email = form.elements.email;
      var message = form.elements.message;
      var bot = form.elements.botcheck;

      if (bot && bot.checked) return;

      var valid = true;

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError(name, t("form.errName"));
        valid = false;
      } else {
        setError(name, "");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, t("form.errEmail"));
        valid = false;
      } else {
        setError(email, "");
      }

      if (message.value.trim().length < 10) {
        setError(message, t("form.errMessage"));
        valid = false;
      } else {
        setError(message, "");
      }

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = "";
          statusEl.className = "form__status";
        }
        var firstError = form.querySelector(".has-error input, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      if (!WEB3FORMS_KEY) {
        var subject = encodeURIComponent("Portfolio — " + name.value.trim());
        var body = encodeURIComponent(
          message.value.trim() + "\n\n— " + name.value.trim() + " <" + email.value.trim() + ">"
        );
        window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
        if (statusEl) {
          statusEl.textContent = t("form.mailto");
          statusEl.className = "form__status is-ok";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = t("form.sending");
      if (statusEl) {
        statusEl.textContent = t("form.sending");
        statusEl.className = "form__status";
      }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
          subject: "Portfolio contact — " + name.value.trim()
        })
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || "failed");
          if (statusEl) {
            statusEl.textContent = t("form.ok");
            statusEl.className = "form__status is-ok";
          }
          form.reset();
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = t("form.fail");
            statusEl.className = "form__status is-error";
          }
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = t("contact.send");
        });
    });

    $$("input, textarea", form).forEach(function (field) {
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        if (wrap && wrap.classList.contains("has-error")) setError(field, "");
      });
    });
  }

  /* ---------------- footer year ---------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- service worker (production only) ---------------- */
  if ("serviceWorker" in navigator && window.location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* offline shell unavailable */ });
    });
  }

  /* ---------------- boot ---------------- */
  applyTheme(root.getAttribute("data-theme") || "dark");
  applyLang(root.getAttribute("lang") || "id");
  startTyping();
  document.addEventListener("langchange", startTyping);

  window.__nkReady = true;
})();
