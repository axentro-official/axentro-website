/* assets/js/ga.js */
(function () {
  "use strict";

  // ====== CONFIG ======
  const GA_ID = "G-CY6Y32C90K";
  const STORE_KEY = "ax_utm";
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

  function getUTMForEvent(options) {
    const utm = loadUTM() || {};
    const defaults = (options && options.defaults) || {};
    const campaignDefault = defaults.utm_campaign || "axentro";
    const pageDefault = defaults.page || "";

    return {
      utm_source: utm.utm_source || utm.src || "(none)",
      utm_medium: utm.utm_medium || (utm.src ? "qr" : "(none)"),
      utm_campaign: utm.utm_campaign || campaignDefault,
      utm_content: utm.utm_content || "",
      utm_term: utm.utm_term || "",
      page: pageDefault
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
    // call config(send_page_view:false) safely (idempotent enough)
    try {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
    } catch (e) {}
  }

  // ====== PAGE VIEW (MANUAL) ======
  function sendPageView(pageName, options) {
    try {
      const utm = getUTMForEvent({
        defaults: {
          utm_campaign: (options && options.utm_campaign_default) || "axentro",
          page: pageName || ""
        }
      });

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

      // QR scan / open helpers (optional)
      const p = new URLSearchParams(window.location.search);
      const src = p.get("src");
      const medium = (p.get("utm_medium") || "").toLowerCase();

      if (options && options.enable_qr_open) {
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

      if (src && (options && options.enable_qr_scan)) {
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
  function trackClick(method, label, section, pageName, options) {
    try {
      const utm = getUTMForEvent({
        defaults: {
          utm_campaign: (options && options.utm_campaign_default) || "axentro",
          page: pageName || ""
        }
      });

      window.gtag("event", "contact_click", {
        method: method,
        label: label,
        section: section || "",
        page: pageName || "",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term
      });
    } catch (e) {}
  }

  function trackService(service_key, service_name, pageName, options) {
    try {
      const utm = getUTMForEvent({
        defaults: {
          utm_campaign: (options && options.utm_campaign_default) || "axentro",
          page: pageName || ""
        }
      });

      window.gtag("event", "service_click", {
        service_key: service_key,
        service_name: service_name,
        page: pageName || "",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term
      });
    } catch (e) {}
  }

  function trackVCardDownload(section, pageName, options) {
    try {
      const utm = getUTMForEvent({
        defaults: {
          utm_campaign: (options && options.utm_campaign_default) || "axentro",
          page: pageName || ""
        }
      });

      window.gtag("event", "vcard_download", {
        section: section || "",
        page: pageName || "",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term
      });
    } catch (e) {}
  }

  function whatsapp(origin, pageName, options) {
    try {
      const utm = getUTMForEvent({
        defaults: {
          utm_campaign: (options && options.utm_campaign_default) || "axentro",
          page: pageName || ""
        }
      });

      window.gtag("event", "whatsapp_click", {
        origin: origin || "",
        page: pageName || "",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term
      });
    } catch (e) {}

    const msg = `مرحبًا فريق Axentro،
أرغب في الاستفسار عن حلولكم البرمجية وتحديد أنسب خدمة لمشروعي.
بانتظار تواصلكم، شكرًا.`;

    const url = "https://wa.me/201146476993?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // ====== ABOUT: SERVICE VIEW BY HASH + CLEAN HASH ======
  function serviceViewFromHash(pageName, options) {
    const ids = new Set(["#excel", "#web", "#desktop", "#inventory", "#branding", "#website"]);
    const hash = window.location.hash;

    if (!hash || !ids.has(hash)) return;

    const card = document.querySelector(hash);
    if (!card) return;

    const titleEl = card.querySelector("h3");
    const title = titleEl ? titleEl.textContent.trim() : "";

    const bc = document.getElementById("breadcrumbService");
    const st = document.getElementById("serviceTitle");

    if (title) {
      if (bc) bc.textContent = title;
      if (st) st.textContent = "تفاصيل الخدمة: " + title;

      try {
        const utm = getUTMForEvent({
          defaults: {
            utm_campaign: (options && options.utm_campaign_default) || "axentro",
            page: pageName || ""
          }
        });

        window.gtag("event", "service_view", {
          service_id: hash.replace("#", ""),
          service_name: title,
          page: pageName || "",
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_content: utm.utm_content,
          utm_term: utm.utm_term
        });
      } catch (e) {}
    }

    // Clean only hash, keep query (UTM)
    setTimeout(() => {
      try {
        if (history && history.replaceState) {
          history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
      } catch (e) {}
    }, (options && options.clean_hash_delay_ms) || 2900);
  }

  async function copyServiceLink(id, pageName, options) {
    const url = new URL(window.location.href);
    url.hash = id;

    const text = url.toString();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert("تم نسخ رابط الخدمة ✅");
      } else {
        prompt("انسخ الرابط:", text);
      }
    } catch (e) {
      prompt("انسخ الرابط:", text);
    }

    try {
      const utm = getUTMForEvent({
        defaults: {
          utm_campaign: (options && options.utm_campaign_default) || "axentro",
          page: pageName || ""
        }
      });

      window.gtag("event", "copy_service_link", {
        service_id: id,
        page: pageName || "",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term
      });
    } catch (e) {}
  }

  // ====== PUBLIC INIT ======
  const AxentroAnalytics = {
    init: function (cfg) {
      ensureGtag();
      initGAConfigOnce();
      mergeUTMFromUrl();

      const page = (cfg && cfg.page) || "";
      const options = cfg || {};

      // Manual page_view
      sendPageView(page, {
        enable_qr_open: !!options.enable_qr_open,
        enable_qr_scan: options.enable_qr_scan !== false, // default true
        utm_campaign_default: options.utm_campaign_default || "axentro"
      });

      // About hash logic (optional)
      if (options.enable_service_hash === true) {
        serviceViewFromHash(page, {
          utm_campaign_default: options.utm_campaign_default || "axentro",
          clean_hash_delay_ms: options.clean_hash_delay_ms || 2900
        });
      }

      // expose page/options for onclick functions
      AxentroAnalytics._page = page;
      AxentroAnalytics._options = {
        utm_campaign_default: options.utm_campaign_default || "axentro"
      };

      return true;
    }
  };

  // ====== Expose globals with SAME names you already use ======
  window.AxentroAnalytics = AxentroAnalytics;

  window.trackClick = function (method, label, section) {
    trackClick(method, label, section, AxentroAnalytics._page || "", AxentroAnalytics._options || {});
  };

  window.trackService = function (service_key, service_name) {
    trackService(service_key, service_name, AxentroAnalytics._page || "", AxentroAnalytics._options || {});
  };

  window.trackVCardDownload = function (section) {
    trackVCardDownload(section, AxentroAnalytics._page || "", AxentroAnalytics._options || {});
  };

  window.whatsapp = function (origin) {
    whatsapp(origin, AxentroAnalytics._page || "", AxentroAnalytics._options || {});
  };

  window.copyServiceLink = function (id) {
    // async-safe
    return copyServiceLink(id, AxentroAnalytics._page || "", AxentroAnalytics._options || {});
  };
})();
