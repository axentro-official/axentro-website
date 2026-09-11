/* assets/js/ga.js */
(function () {
  "use strict";

  // ====== CONFIG ======
  const GA_ID = "G-CY6Y32C90K";
  const STORE_KEY = "ax_utm";
  const DEFAULTS = {
    utm_campaign_default: "axentro",
    enable_qr_scan: true,
    enable_qr_open: false,
    enable_internal_utm_links: true,
    enable_service_hash_title: false,
    clean_hash_delay_ms: 2900,
    service_hash_ids: ["excel", "web", "desktop", "inventory", "branding", "website"],
    service_title_prefix: "تفاصيل الخدمة: "
  };

  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src"];

  // ====== SAFE STORAGE ======
  function safeRead(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeWrite(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  // ====== QUERY PARAMS ======
  function getQueryParams() {
    const p = new URLSearchParams(window.location.search);
    const obj = {};
    UTM_KEYS.forEach((k) => {
      const v = p.get(k);
      if (v) obj[k] = v;
    });
    return obj;
  }

  // ====== UTM STORE ======
  function loadUTM() {
    try {
      const saved = safeRead(STORE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function saveUTM(utmObj) {
    safeWrite(STORE_KEY, JSON.stringify(utmObj || {}));
  }

  function mergeUTMFromUrl() {
    const current = getQueryParams();
    if (Object.keys(current).length) {
      const merged = { ...loadUTM(), ...current, last_seen: new Date().toISOString() };
      saveUTM(merged);
    }
  }

  function getUTMForEvent(cfg) {
    const utm = loadUTM() || {};
    const campaignDefault = (cfg && cfg.utm_campaign_default) || DEFAULTS.utm_campaign_default;

    return {
      utm_source: utm.utm_source || utm.src || "(none)",
      utm_medium: utm.utm_medium || (utm.src ? "qr" : "(none)"),
      utm_campaign: utm.utm_campaign || campaignDefault,
      utm_content: utm.utm_content || "",
      utm_term: utm.utm_term || ""
    };
  }

  // ====== GTAG SAFE BOOT ======
  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
  }

  function initGAConfigOnce() {
    try {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
    } catch (e) {}
  }

  // ====== INTERNAL LINKS: APPEND UTM ======
  function buildUTMQuery() {
    const utm = loadUTM() || {};
    const qs = new URLSearchParams();

    if (utm.utm_source) qs.set("utm_source", utm.utm_source);
    if (utm.utm_medium) qs.set("utm_medium", utm.utm_medium);
    if (utm.utm_campaign) qs.set("utm_campaign", utm.utm_campaign);
    if (utm.utm_content) qs.set("utm_content", utm.utm_content);
    if (utm.utm_term) qs.set("utm_term", utm.utm_term);
    if (utm.src) qs.set("src", utm.src);

    const s = qs.toString();
    return s ? ("?" + s) : "";
  }

  function appendUTMToInternalLinks() {
    try {
      const q = buildUTMQuery();
      if (!q) return;

      const links = document.querySelectorAll("a.js-utm-link[href]");
      links.forEach((a) => {
        const href = a.getAttribute("href");
        if (!href) return;

        if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
        if (href.includes("?")) return; // already has query

        const parts = href.split("#");
        const base = parts[0];
        const hash = parts[1] ? ("#" + parts[1]) : "";

        a.setAttribute("href", base + q + hash);
      });
    } catch (e) {}
  }

  // ====== PAGE VIEW (MANUAL) ======
  function sendPageView(pageName, cfg) {
    try {
      const utm = getUTMForEvent(cfg);

      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        page: pageName || "",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term
      });

      const p = new URLSearchParams(window.location.search);
      const src = p.get("src");
      const medium = (p.get("utm_medium") || "").toLowerCase();

      if (cfg && cfg.enable_qr_open) {
        if (medium === "qr" || !!src) {
          window.gtag("event", "qr_open", {
            page: pageName || "",
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content,
            utm_term: utm.utm_term
          });
        }
      }

      if (src && (cfg && cfg.enable_qr_scan)) {
        window.gtag("event", "qr_scan", {
          source: src,
          page: pageName || "",
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_content: utm.utm_content,
          utm_term: utm.utm_term
        });
      }
    } catch (e) {}
  }

  // ====== EVENTS ======
  function trackClick(method, label, section, pageName, cfg) {
    try {
      const utm = getUTMForEvent(cfg);
      window.gtag("event", "contact_click", {
        method,
        label,
        section: section || "",
        page: pageName || "",
        ...utm
      });
    } catch (e) {}
  }

  function trackService(service_key, service_name, pageName, cfg) {
    try {
      const utm = getUTMForEvent(cfg);
      window.gtag("event", "service_click", {
        service_key,
        service_name,
        page: pageName || "",
        ...utm
      });
    } catch (e) {}
  }

  function trackVCardDownload(section, pageName, cfg) {
    try {
      const utm = getUTMForEvent(cfg);
      window.gtag("event", "vcard_download", {
        section: section || "",
        page: pageName || "",
        ...utm
      });
    } catch (e) {}
  }

  function whatsapp(origin, pageName, cfg, customMessage) {
    try {
      const utm = getUTMForEvent(cfg);
      window.gtag("event", "whatsapp_click", {
        origin: origin || "",
        page: pageName || "",
        ...utm
      });
    } catch (e) {}

    let msg;
    if (typeof customMessage === 'string' && customMessage.trim().length > 0) {
      msg = customMessage;
    } else {
      msg = `مرحبًا فريق Axentro،
أرغب في الاستفسار عن حلولكم البرمجية وتحديد أنسب خدمة لمشروعي.
بانتظار تواصلكم، شكرًا.`;
    }

    const url = "https://wa.me/201146476993?text=" + encodeURIComponent(msg);
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
  }

  // ====== ABOUT: SERVICE TITLE/BREADCRUMB BY HASH ======
  function serviceTitleFromHash(pageName, cfg) {
    try {
      const ids = (cfg && cfg.service_hash_ids && cfg.service_hash_ids.length)
        ? cfg.service_hash_ids
        : DEFAULTS.service_hash_ids;

      const allowed = new Set(ids.map((x) => (x.startsWith("#") ? x : "#" + x)));
      const hash = window.location.hash;
      if (!hash || !allowed.has(hash)) return;

      const card = document.querySelector(hash);
      if (!card) return;

      const titleEl = card.querySelector("h3");
      const title = titleEl ? titleEl.textContent.trim() : "";
      if (!title) return;

      const prefix = (cfg && typeof cfg.service_title_prefix === "string")
        ? cfg.service_title_prefix
        : DEFAULTS.service_title_prefix;

      const bc = document.getElementById("breadcrumbService");
      const st = document.getElementById("serviceTitle");

      if (bc) bc.textContent = title;
      if (st) st.textContent = prefix + title;

      // track view
      try {
        const utm = getUTMForEvent(cfg);
        window.gtag("event", "service_view", {
          service_id: hash.replace("#", ""),
          service_name: title,
          page: pageName || "",
          ...utm
        });
      } catch (e) {}

      // Hash is intentionally kept in the URL: it powers hash-preserving language switching
      // (e.g. /en/about.html#crm -> /about.html#crm). No cleanup.
    } catch (e) {}
  }

  // ====== COPY TOAST (site-styled, auto-dismiss, language-aware) ======
  function showCopyToast() {
    try {
      const isEn = document.documentElement.lang === 'en';
      const msg = isEn ? 'Service link copied' : 'تم نسخ رابط الخدمة';

      let style = document.getElementById('ax-toast-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'ax-toast-style';
        style.textContent = [
          '.ax-toast{position:fixed;bottom:96px;left:50%;transform:translate(-50%,14px);',
          'background:var(--card-bg,rgba(20,20,24,.85));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
          'border:1px solid var(--accent,#9fff00);color:var(--text,#fff);',
          'padding:12px 22px;border-radius:50px;font-weight:600;font-size:.95rem;',
          'box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:10001;display:flex;align-items:center;gap:10px;',
          'opacity:0;transition:transform .28s ease,opacity .28s ease;pointer-events:none;white-space:nowrap;}',
          '.ax-toast .ax-toast-icon{color:var(--accent,#9fff00);font-size:1.05rem;}',
          '.ax-toast.ax-toast--show{transform:translate(-50%,0);opacity:1;}'
        ].join('');
        document.head.appendChild(style);
      }

      const existing = document.getElementById('ax-copy-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'ax-copy-toast';
      toast.className = 'ax-toast';
      const icon = document.createElement('i');
      icon.className = 'fas fa-check-circle ax-toast-icon';
      icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = msg;
      toast.appendChild(icon);
      toast.appendChild(label);
      document.body.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add('ax-toast--show'));

      setTimeout(() => {
        toast.classList.remove('ax-toast--show');
        setTimeout(() => toast.remove(), 320);
      }, 2600);
    } catch (e) {}
  }

  async function copyServiceLink(id, pageName, cfg) {
    const url = new URL(window.location.href);
    url.hash = id;
    const text = url.toString();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showCopyToast();
      } else {
        prompt("انسخ الرابط:", text);
      }
    } catch (e) {
      prompt("انسخ الرابط:", text);
    }

    try {
      const utm = getUTMForEvent(cfg);
      window.gtag("event", "copy_service_link", {
        service_id: id,
        page: pageName || "",
        ...utm
      });
    } catch (e) {}
  }

  // ====== PUBLIC INIT ======
  const AxentroAnalytics = {
    init: function (cfg) {
      ensureGtag();
      initGAConfigOnce();
      mergeUTMFromUrl();

      const mergedCfg = { ...DEFAULTS, ...(cfg || {}) };
      const page = mergedCfg.page || "";

      // internal links utm
      if (mergedCfg.enable_internal_utm_links) {
        appendUTMToInternalLinks();
      }

      // page_view
      sendPageView(page, mergedCfg);

      // about hash title/breadcrumb
      if (mergedCfg.enable_service_hash_title) {
        serviceTitleFromHash(page, mergedCfg);
      }

      // expose for onclick
      AxentroAnalytics._page = page;
      AxentroAnalytics._cfg = mergedCfg;

      return true;
    }
  };

  window.AxentroAnalytics = AxentroAnalytics;

  // same global names
  window.trackClick = function (method, label, section) {
    trackClick(method, label, section, AxentroAnalytics._page || "", AxentroAnalytics._cfg || {});
  };

  window.trackService = function (service_key, service_name) {
    trackService(service_key, service_name, AxentroAnalytics._page || "", AxentroAnalytics._cfg || {});
  };

  window.trackVCardDownload = function (section) {
    trackVCardDownload(section, AxentroAnalytics._page || "", AxentroAnalytics._cfg || {});
  };

  window.whatsapp = function (origin, customMessage) {
    whatsapp(origin, AxentroAnalytics._page || "", AxentroAnalytics._cfg || {}, customMessage);
  };

  window.copyServiceLink = function (id) {
    return copyServiceLink(id, AxentroAnalytics._page || "", AxentroAnalytics._cfg || {});
  };
})();
