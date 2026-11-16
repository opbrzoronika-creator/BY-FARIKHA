/**
 * WCC.BYFARIHA — Kreator Konten Pernikahan & Acara Eksklusif
 * Logika Website Publik: Data Dinamis, Engine Tema Gelap & Terang, Animasi Parallax, Lightbox, & Integrasi Supabase Bookings
 */

// Data Awal Eksklusif Berbahasa Indonesia (Ditampilkan bila Supabase masih kosong atau belum terisi)
const DATA_AWAL = {
  settings: {
    hero_text: "Menangkap setiap tatapan, senyuman, dan momen sakral hari bahagia Anda dalam balutan estetika editorial sinematik 4K yang berkelas dan abadi.",
    about_text: "WCC.BYFARIHA hadir untuk setiap pasangan yang menginginkan dokumentasi pernikahan bernilai seni tinggi. Kami memadukan kehangatan momen intim dengan visual berkelas layaknya editorial majalah pernikahan dunia.",
    whatsapp_number: "6285700000000",
    instagram_url: "https://www.instagram.com/wcc.byfariha/",
    area_text: "Magetan, Madiun, Solo, Surabaya & Seluruh Indonesia"
  },
  packages: [
    {
      id: "pkg-1",
      name: "Paket Intimate Wedding",
      price: 2500000,
      description: "Liputan 4–5 Jam (Akad Nikah / Pemberkatan)\n1 Kreator Konten Berpengalaman\n2 Video Cinematic Reels Siap Tayang (4K 60fps HDR)\nSemua Video Mentah & Foto Diserahkan dalam 24 Jam\nPerangkat Flagship Kamera Ultra-Jernih\nTautan Galeri Pribadi Google Drive",
      is_featured: false,
      sort_order: 1
    },
    {
      id: "pkg-2",
      name: "Paket Grand Wedding (Full Day)",
      price: 4500000,
      description: "Liputan Penuh Hari H (Hingga 10 Jam: Persiapan s.d. Resepsi)\n1 Kreator Konten Khusus yang Dedikatif\n4 Video Cinematic Reels (Teaser & Sorotan Utama)\nSame-Day Edit (1 Video siap tayang dalam 12 jam)\nDokumentasi Estetis Di Balik Layar (Behind-the-Scenes)\nSeluruh File Mentah Tanpa Kompresi dalam 24 Jam\nKonsultasi Konsep Konten Langsung via WhatsApp",
      is_featured: true,
      sort_order: 2
    },
    {
      id: "pkg-3",
      name: "Paket Luxury Editorial (All-In)",
      price: 6800000,
      description: "Liputan Penuh Komprehensif (Waktu Fleksibel Tak Terbatas)\n2 Kreator Konten Profesional di Lokasi\n6 Video Reels Editorial Mewah + 1 Video Rekap Panjang\nSame-Day Edit (2 Video Reels siap posting di hari yang sama)\nDokumentasi Di Balik Layar Lengkap & Wawancara Tamu\nKoleksi Foto Carousel dengan Color Grading Majalah\nPenyerahan File Mentah Instan via AirDrop / Hard Drive\nTersedia untuk Pernikahan Luar Kota & Luar Pulau",
      is_featured: false,
      sort_order: 3
    }
  ],
  portfolio: [
    {
      id: "port-1",
      title: "Janji Suci di Hari Bahagia",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      description: "Prosesi Akad Nikah Intim · Magetan"
    },
    {
      id: "port-2",
      title: "Kilau Cahaya Persiapan Pengantin",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      description: "Momen Haru Pra-Acara · Solo"
    },
    {
      id: "port-3",
      title: "Cuplikan Teaser Golden Hour",
      type: "video",
      media_url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-embracing-outdoors-41221-large.mp4",
      description: "Video Sorotan Sinematik 4K"
    },
    {
      id: "port-4",
      title: "Detail Cincin & Busana Pengantin",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      description: "Detail Makro Estetika Editorial"
    },
    {
      id: "port-5",
      title: "Kemegahan Malam Resepsi",
      type: "video",
      media_url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-41220-large.mp4",
      description: "Suasana Hangat Grand Ballroom"
    },
    {
      id: "port-6",
      title: "Tawa Spontan & Bahagia",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      description: "Momen Candid Alami Penuh Emosi"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      client_name: "Nadya & Kevin",
      content: "Hasil konten dari WCC.BYFARIHA bener-bener kayak nonton film bioskop! Paginya akad, malamnya reels udah jadi dan langsung bisa kita upload di Instagram. Tone warnanya mahal banget, rapi dan elegan.",
      venue: "Grand Ballroom Solo"
    },
    {
      id: "rev-2",
      client_name: "Anindya & Fikri",
      content: "Sangat bersyukur pilih Kak Fariha. Timnya santun banget, nggak ganggu prosesi sakral sama sekali tapi semua momen haru dan detail kebaya sampai dekorasi terekam sempurna. Raw footagenya ratusan klip!",
      venue: "Pernikahan Intim Magetan"
    },
    {
      id: "rev-3",
      client_name: "Claudia & Reza",
      content: "Beda banget sama dokumentasi biasa. Ini beneran luxury editorial vibe, transisi videonya halus dan pemilihan audionya pas banget. Teman-teman pada nanyain siapa yang bikin!",
      venue: "Hotel Royal Heritage"
    }
  ]
};

let currentWhatsAppNumber = DATA_AWAL.settings.whatsapp_number;
let loadedPackages = [];
let allPortfolioItems = [];

// Memeriksa apakah Supabase telah dikonfigurasi
const isSupabaseReady = () => typeof window.isSupabaseConfigured === "function" 
  ? window.isSupabaseConfigured() 
  : (window.SUPABASE_URL && !window.SUPABASE_URL.includes("PASTE_") && window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.includes("PASTE_"));

// Inisialisasi saat dokumen siap
document.addEventListener("DOMContentLoaded", () => {
  // Engine Tema (Gelap Permanen)
  initThemeEngine();

  // Tahun Hak Cipta di Footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Batasi tanggal minimal di input tanggal acara (tidak bisa memilih tanggal lampau)
  const dateInput = document.getElementById("bookingDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // Navigasi & Menu Mobile
  initNavigation();

  // Animasi Muncul Halus & Parallax
  initScrollAnimations();
  initParallaxEffects();

  // Lightbox Modal Portofolio
  initLightbox();

  // Formulir Pemesanan ke Supabase Database & WhatsApp
  initBookingForm();

  // Modal Ulasan Pengantin / Konsumen
  initReviewSubmissionModal();

  // Muat Data (Dari Supabase atau Data Cadangan)
  loadSiteData();
});

/* ==========================================================================
   ENGINE TEMA (KHUSUS MODE GELAP / DARK LUXURY EDITORIAL ONLY)
   ========================================================================== */
function initThemeEngine() {
  // Tetapkan tema gelap secara permanen
  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("wcc_theme", "dark");

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", "#121110");
  }
}

/* ==========================================================================
   NAVIGASI
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("nav");
  const siteHeader = document.getElementById("siteHeader");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("open");
      });
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add("scrolled");
    } else {
      siteHeader?.classList.remove("scrolled");
    }
  }, { passive: true });
}

/* ==========================================================================
   ANIMASI SCROLL & PARALLAX
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(el => observer.observe(el));

  // Animasi susun kartu saat digulir
  attachStackAnimations(document);
}

function attachStackAnimations(rootEl = document) {
  if (!rootEl) return;
  const stackElements = rootEl.querySelectorAll(".reveal-stack");
  if (!("IntersectionObserver" in window)) {
    stackElements.forEach(el => el.classList.add("in-view"));
    return;
  }
  const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });

  stackElements.forEach(el => {
    el.classList.add("in-view");
    stackObserver.observe(el);
  });
}

function initParallaxEffects() {
  const glow1 = document.getElementById("glow1");
  const glow2 = document.getElementById("glow2");
  const heroParallaxFrame = document.getElementById("heroParallaxFrame");

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;

        if (glow1) {
          glow1.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0)`;
        }
        if (glow2) {
          glow2.style.transform = `translate3d(0, ${-scrolled * 0.07}px, 0)`;
        }

        if (heroParallaxFrame && scrolled < 900) {
          heroParallaxFrame.style.transform = `translate3d(0, ${scrolled * 0.06}px, 0)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   MEMUAT DATA DARI SUPABASE DATABASE (KONTEN PUBLIK)
   ========================================================================== */
async function loadSiteData() {
  // Pastikan kredensial Supabase terinisialisasi
  if (typeof window.ensureSupabaseConfig === "function") {
    try {
      await window.ensureSupabaseConfig();
    } catch (e) {
      console.warn("Koneksi Supabase config:", e);
    }
  }

  if (isSupabaseReady()) {
    try {
      const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      
      // 1. Muat Paket Layanan secara independen (tidak bergantung query lain)
      try {
        const { data: pkgs, error: pkgErr } = await db
          .from("packages")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!pkgErr && pkgs && pkgs.length > 0) {
          loadedPackages = pkgs;
        } else if (!pkgErr && pkgs && pkgs.length === 0) {
          // Jika owner belum menginput paket atau sedang kosong
          loadedPackages = DATA_AWAL.packages;
        } else {
          console.warn("Koneksi tabel packages:", pkgErr?.message);
          loadedPackages = DATA_AWAL.packages;
        }
      } catch (errPkg) {
        console.warn("Exception memuat paket:", errPkg);
        loadedPackages = DATA_AWAL.packages;
      }
      renderPackages(loadedPackages);

      // 2. Muat Portofolio secara independen
      try {
        const { data: ports, error: portErr } = await db
          .from("portfolio")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!portErr && ports && ports.length > 0) {
          allPortfolioItems = ports;
        } else {
          allPortfolioItems = DATA_AWAL.portfolio;
        }
      } catch (errPort) {
        console.warn("Exception memuat portofolio:", errPort);
        allPortfolioItems = DATA_AWAL.portfolio;
      }
      renderPortfolio(allPortfolioItems);
      initPortfolioFilters();

      // 3. Muat Ulasan secara independen
      try {
        const { data: revs, error: revErr } = await db
          .from("reviews")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!revErr && revs && revs.length > 0) {
          renderReviews(revs);
        } else {
          renderReviews(DATA_AWAL.reviews);
        }
      } catch (errRev) {
        console.warn("Exception memuat ulasan:", errRev);
        renderReviews(DATA_AWAL.reviews);
      }

      // 4. Muat Pengaturan Situs secara independen
      try {
        const { data: setRow, error: setErr } = await db
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (!setErr && setRow) {
          applySettings(setRow);
        } else {
          applySettings(DATA_AWAL.settings);
        }
      } catch (errSet) {
        console.warn("Exception memuat pengaturan situs:", errSet);
        applySettings(DATA_AWAL.settings);
      }

      return;
    } catch (err) {
      console.warn("Koneksi Supabase tertunda, menampilkan data default:", err);
    }
  }

  // Jika Supabase belum aktif atau gagal, tampilkan data awal
  loadedPackages = DATA_AWAL.packages;
  allPortfolioItems = DATA_AWAL.portfolio;
  renderPackages(loadedPackages);
  renderPortfolio(allPortfolioItems);
  initPortfolioFilters();
  renderReviews(DATA_AWAL.reviews);
  applySettings(DATA_AWAL.settings);
}

function applySettings(s) {
  if (!s) return;

  // Baca juga dari localStorage untuk backup teks dinamis
  let localExtra = {};
  try {
    localExtra = JSON.parse(localStorage.getItem("wcc_custom_settings") || "{}");
  } catch (e) {}

  // Deteksi metadata tambahan yang tersemat rapi di about_text jika skema DB belum di-alter
  let cleanAbout = s.about_text || "";
  let embeddedMeta = {};
  if (typeof cleanAbout === "string" && cleanAbout.includes("<!--WCC_META:")) {
    try {
      const match = cleanAbout.match(/<!--WCC_META:(.*?)-->/);
      if (match && match[1]) {
        embeddedMeta = JSON.parse(match[1]);
        cleanAbout = cleanAbout.replace(/<!--WCC_META:.*?-->/g, "").trim();
      }
    } catch (e) {}
  }

  const merged = { ...DATA_AWAL.settings, ...embeddedMeta, ...localExtra, ...s, about_text: cleanAbout };

  const setText = (id, val) => {
    if (!val && val !== "") return;
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setHtml = (id, val) => {
    if (!val && val !== "") return;
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };

  // 1. HERO SECTION
  if (merged.hero_eyebrow) setText("heroEyebrowText", merged.hero_eyebrow);
  if (merged.hero_title_top) setText("heroTitleTop", merged.hero_title_top);
  if (merged.hero_title_gold) setText("heroTitleGold", merged.hero_title_gold);
  if (merged.hero_title && !merged.hero_title_top && !merged.hero_title_gold) {
    const parts = merged.hero_title.split("\n");
    if (parts.length > 1) {
      setText("heroTitleTop", parts[0]);
      setText("heroTitleGold", parts.slice(1).join(" "));
    } else {
      setText("heroTitleGold", merged.hero_title);
    }
  }
  if (merged.hero_lead || merged.hero_text) setText("heroLead", merged.hero_lead || merged.hero_text);
  if (merged.hero_btn_reserve) setText("heroBtnReserve", merged.hero_btn_reserve);
  if (merged.hero_btn_portfolio) setText("heroBtnPortfolio", merged.hero_btn_portfolio);
  if (merged.hero_meta_area || merged.area_text) setText("heroMetaArea", merged.hero_meta_area || merged.area_text);
  if (merged.hero_meta_device || merged.device_text) setText("heroMetaDevice", merged.hero_meta_device || merged.device_text);
  if (merged.hero_float_tag) setText("heroFloatTag", merged.hero_float_tag);
  if (merged.hero_float_text) setText("heroFloatText", merged.hero_float_text);
  if (merged.ticker_text) {
    const ticker = document.getElementById("tickerTrack");
    if (ticker) {
      const items = merged.ticker_text.split("·").map(t => t.trim()).filter(Boolean);
      if (items.length > 0) {
        ticker.innerHTML = items.map(t => `<span>${escapeHtml(t)}</span><span class="ticker-dot">·</span>`).join(" ");
      }
    }
  }

  // 2. ABOUT SECTION
  if (merged.about_eyebrow) setText("aboutEyebrow", merged.about_eyebrow);
  if (merged.about_title) setHtml("aboutTitle", merged.about_title);
  if (merged.about_subtitle) setText("aboutSubtitle", merged.about_subtitle);
  if (merged.about_story_title) setText("aboutStoryTitle", merged.about_story_title);
  if (merged.about_text) setText("aboutText", merged.about_text);
  if (merged.pillar1_title) setText("pillar1Title", merged.pillar1_title);
  if (merged.pillar1_desc) setText("pillar1Desc", merged.pillar1_desc);
  if (merged.pillar2_title) setText("pillar2Title", merged.pillar2_title);
  if (merged.pillar2_desc) setText("pillar2Desc", merged.pillar2_desc);
  if (merged.pillar3_title) setText("pillar3Title", merged.pillar3_title);
  if (merged.pillar3_desc) setText("pillar3Desc", merged.pillar3_desc);
  if (merged.about_sig_name) setText("aboutSigName", merged.about_sig_name);

  // 3. PACKAGES (PRICELIST) SECTION
  if (merged.packages_eyebrow) setText("packagesEyebrow", merged.packages_eyebrow);
  if (merged.packages_title) setHtml("packagesTitle", merged.packages_title);
  if (merged.packages_desc) setText("packagesDesc", merged.packages_desc);
  if (merged.custom_inquiry_title) setText("customInquiryTitle", merged.custom_inquiry_title);
  if (merged.custom_inquiry_desc) setText("customInquiryDesc", merged.custom_inquiry_desc);

  // 4. PORTFOLIO SECTION
  if (merged.portfolio_eyebrow) setText("portfolioEyebrow", merged.portfolio_eyebrow);
  if (merged.portfolio_title) setHtml("portfolioTitle", merged.portfolio_title);
  if (merged.portfolio_desc) setText("portfolioDesc", merged.portfolio_desc);

  // 5. REVIEWS SECTION
  if (merged.reviews_eyebrow) setText("reviewsEyebrow", merged.reviews_eyebrow);
  if (merged.reviews_title) setHtml("reviewsTitle", merged.reviews_title);
  if (merged.reviews_desc) setText("reviewsDesc", merged.reviews_desc);
  if (merged.review_cta_prompt) setText("reviewCtaPrompt", merged.review_cta_prompt);

  // 6. BOOKING SECTION
  if (merged.booking_eyebrow) setText("bookingEyebrow", merged.booking_eyebrow);
  if (merged.booking_title) setHtml("bookingTitle", merged.booking_title);
  if (merged.booking_desc) setText("bookingDesc", merged.booking_desc);

  // 7. FOOTER & SOCIALS
  if (merged.footer_quote) setText("footerQuote", merged.footer_quote);
  if (merged.whatsapp_number) {
    currentWhatsAppNumber = merged.whatsapp_number.replace(/\D/g, "");
    const waText = encodeURIComponent("Halo WCC.BYFARIHA, saya ingin konsultasi layanan wedding content creator.");
    const waLink = document.getElementById("directWaLink");
    if (waLink) waLink.href = `https://wa.me/${currentWhatsAppNumber}?text=${waText}`;
    const floatWa = document.getElementById("floatingWaBtn");
    if (floatWa) floatWa.href = `https://wa.me/${currentWhatsAppNumber}?text=${waText}`;
    const footerWa = document.getElementById("footerWaLink");
    if (footerWa) footerWa.href = `https://wa.me/${currentWhatsAppNumber}?text=${waText}`;
  }
  if (merged.instagram_url) {
    const igLink = document.getElementById("directIgLink");
    if (igLink) {
      igLink.href = merged.instagram_url;
      const cleanHandle = merged.instagram_url.replace("https://www.instagram.com/", "").replace(/\/$/, "");
      igLink.textContent = `@${cleanHandle} ↗`;
    }
    const footerIg = document.getElementById("footerIgLink");
    if (footerIg) footerIg.href = merged.instagram_url;
  }
}

/* ==========================================================================
   MENAMPILKAN PAKET LAYANAN
   ========================================================================== */
function renderPackages(packages) {
  const container = document.getElementById("packageGrid");
  const selectBox = document.getElementById("bookingPackage");

  if (!container) return;

  if (!packages || packages.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>Daftar paket akan segera hadir.</p></div>`;
    return;
  }

  // Isi dropdown pilihan paket pada formulir pemesanan
  if (selectBox) {
    selectBox.innerHTML = `<option value="" disabled selected>Pilih salah satu paket...</option>` +
      packages.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (${formatRupiah(p.price)})</option>`).join("") +
      `<option value="Paket Kustom / Konsultasi Dulu">Paket Kustom / Konsultasi Dulu</option>`;
  }

  // Render kartu paket dengan animasi susun saat digulir (Stacking Cards)
  container.innerHTML = packages.map((pkg, index) => {
    const features = (pkg.description || "")
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const featureListHtml = features.map(item => `
      <li>
        <span class="feature-check">✓</span>
        <span>${escapeHtml(item)}</span>
      </li>
    `).join("");

    return `
      <article class="package-card ${pkg.is_featured ? "featured" : ""} stack-scroll-item reveal-stack in-view" style="--stack-index: ${index}; --stack-offset: ${index * 22}px;">
        ${pkg.is_featured ? `<span class="package-badge">PILIHAN UTAMA</span>` : ""}
        <div>
          <p class="package-eyebrow">LAYANAN EKSKLUSIF</p>
          <h3 class="package-title">${escapeHtml(pkg.name)}</h3>
          <div class="package-price">${formatRupiah(pkg.price)}</div>
          
          <ul class="package-features">
            ${featureListHtml}
          </ul>
        </div>

        <button type="button" class="btn ${pkg.is_featured ? "btn-terracotta" : "btn-champagne-outline"} btn-choose-package" onclick="selectPackageForBooking('${escapeHtml(pkg.name)}')">
          <span>Pilih Paket Ini</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </article>
    `;
  }).join("");

  attachStackAnimations(container);
}

// Fungsi global untuk memilih paket dan scroll otomatis ke formulir booking
window.selectPackageForBooking = function(pkgName) {
  const selectBox = document.getElementById("bookingPackage");
  if (selectBox) {
    selectBox.value = pkgName;
  }
  const bookingSection = document.getElementById("booking");
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
    const nameInput = document.getElementById("bookingName");
    if (nameInput) setTimeout(() => nameInput.focus(), 600);
  }
};

/* ==========================================================================
   MENAMPILKAN PORTOFOLIO & FILTER
   ========================================================================== */
function renderPortfolio(items, filter = "all") {
  const container = document.getElementById("portfolioGrid");
  if (!container) return;

  const filtered = filter === "all" ? items : items.filter(item => item.type === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>Belum ada karya pada kategori ini.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((item, index) => {
    const isVideo = item.type === "video";
    const mediaUrl = safeUrl(item.media_url);

    const thumbUrl = isVideo 
      ? "https://images.unsplash.com/photo-1519225424982-f5f73c68df8e?auto=format&fit=crop&w=800&q=80" 
      : mediaUrl;

    return `
      <div class="portfolio-card" onclick="openLightbox(${index}, '${filter}')" title="Klik untuk melihat karya">
        <img src="${thumbUrl}" alt="${escapeHtml(item.title)}" loading="lazy">
        
        <span class="portfolio-type-pill">
          ${isVideo ? "<span>▶</span> VIDEO REELS" : "<span>📷</span> FOTO"}
        </span>

        ${isVideo ? `<div class="video-play-badge">▶</div>` : ""}

        <div class="portfolio-overlay">
          <h3 class="portfolio-title">${escapeHtml(item.title)}</h3>
          <p class="portfolio-caption">${escapeHtml(item.description || "Dokumentasi Pernikahan")}</p>
        </div>
      </div>
    `;
  }).join("");
}

function initPortfolioFilters() {
  const tabBtns = document.querySelectorAll(".portfolio-tabs .tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter") || "all";
      renderPortfolio(allPortfolioItems, filter);
    });
  });
}

/* ==========================================================================
   MENAMPILKAN ULASAN KLIEN
   ========================================================================== */
function renderReviews(reviews) {
  const container = document.getElementById("reviewGrid");
  if (!container) return;

  if (!reviews || reviews.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>Testimoni akan segera hadir.</p></div>`;
    return;
  }

  container.innerHTML = reviews.map((rev, index) => {
    const initial = rev.client_name ? rev.client_name.trim().charAt(0) : "W";
    const stars = Number(rev.rating) > 0 ? "★".repeat(Math.min(5, Number(rev.rating))) : "★★★★★";
    return `
      <article class="review-card stack-scroll-item reveal-stack in-view" style="--stack-index: ${index};">
        <div>
          <div class="quote-mark">“</div>
          <div class="review-stars">${stars}</div>
          <p class="review-quote">${escapeHtml(rev.content)}</p>
        </div>
        <div class="review-author">
          <div class="author-monogram">${escapeHtml(initial)}</div>
          <div>
            <span class="author-name">${escapeHtml(rev.client_name)}</span>
            <span class="author-venue">${escapeHtml(rev.venue || "Klien Pernikahan")}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");

  attachStackAnimations(container);
}

/* ==========================================================================
   MODAL ULASAN KONSUMEN (SUBMIT CONSUMER REVIEW)
   ========================================================================== */
function initReviewSubmissionModal() {
  const modal = document.getElementById("reviewModal");
  const openBtn = document.getElementById("openReviewModalBtn");
  const closeBtn = document.getElementById("closeReviewModalBtn");
  const cancelBtn = document.getElementById("revCancelBtn");
  const form = document.getElementById("publicReviewForm");
  const noticeEl = document.getElementById("revNotice");
  const starBtns = document.querySelectorAll("#starRatingSelect .star-btn");
  const ratingInput = document.getElementById("revRating");
  const submitBtn = document.getElementById("revSubmitBtn");

  if (!modal) return;

  const open = () => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (noticeEl) noticeEl.style.display = "none";
  };

  const close = () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
    if (form) form.reset();
    if (ratingInput) ratingInput.value = "5";
    updateStars(5);
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  cancelBtn?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // Star rating selector
  function updateStars(val) {
    starBtns.forEach(btn => {
      const starVal = Number(btn.getAttribute("data-value") || 1);
      if (starVal <= val) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  starBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = Number(btn.getAttribute("data-value") || 5);
      if (ratingInput) ratingInput.value = val;
      updateStars(val);
    });
  });

  // Submit handler
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const clientName = document.getElementById("revClientName")?.value.trim() || "";
      const venue = document.getElementById("revVenue")?.value.trim() || "";
      const rating = Number(ratingInput?.value) || 5;
      const content = document.getElementById("revContent")?.value.trim() || "";

      if (!clientName || !content) {
        alert("Harap isi nama dan ulasan Anda.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim Ulasan...";
      }

      const reviewRow = {
        client_name: clientName,
        content: content,
        is_active: false // Menunggu persetujuan pemilik sebelum tampil
      };

      try {
        if (isSupabaseReady()) {
          const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
          let { error } = await db.from("reviews").insert(reviewRow);
          
          if (error) {
            console.warn("Kirim ulasan via Supabase (RLS):", error.message);
            // Simpan juga ke antrean lokal (localStorage)
            try {
              const queue = JSON.parse(localStorage.getItem("wcc_offline_reviews") || "[]");
              queue.push({
                ...reviewRow,
                venue,
                rating,
                id: "local-" + Date.now(),
                created_at: new Date().toISOString()
              });
              localStorage.setItem("wcc_offline_reviews", JSON.stringify(queue));
            } catch (e) {}
          }
        }

        if (noticeEl) {
          noticeEl.className = "form-notice success";
          noticeEl.style.display = "block";
          noticeEl.innerHTML = "<b>Terima kasih banyak!</b> Ulasan indah Anda telah kami terima dan akan segera ditampilkan setelah diverifikasi oleh pemilik.";
        }

        setTimeout(() => {
          close();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim Ulasan";
          }
        }, 2800);

      } catch (err) {
        if (noticeEl) {
          noticeEl.className = "form-notice success";
          noticeEl.style.display = "block";
          noticeEl.innerHTML = "<b>Terima kasih!</b> Ulasan Anda telah tercatat dengan baik.";
        }
        setTimeout(() => {
          close();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim Ulasan";
          }
        }, 2200);
      }
    });
  }
}

/* ==========================================================================
   MODAL LIGHTBOX
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById("mediaLightbox");
  const closeBtn = document.getElementById("modalClose");
  const backdrop = document.getElementById("modalBackdrop");

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    const modalBody = document.getElementById("modalBody");
    if (modalBody) modalBody.innerHTML = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("open")) {
      closeModal();
    }
  });
}

window.openLightbox = function(index, filter) {
  const filtered = filter === "all" ? allPortfolioItems : allPortfolioItems.filter(item => item.type === filter);
  const item = filtered[index];
  if (!item) return;

  const modal = document.getElementById("mediaLightbox");
  const modalBody = document.getElementById("modalBody");
  const modalCaption = document.getElementById("modalCaption");

  if (!modal || !modalBody) return;

  const safeMedia = safeUrl(item.media_url);

  if (item.type === "video") {
    modalBody.innerHTML = `
      <video controls autoplay playsinline style="max-height: 74vh; width: 100%;">
        <source src="${safeMedia}" type="video/mp4">
        Browser Anda tidak mendukung pemutar video. Silakan buka tautan: <a href="${safeMedia}" target="_blank" style="color:var(--champagne)">Tonton Video</a>
      </video>
    `;
  } else {
    modalBody.innerHTML = `<img src="${safeMedia}" alt="${escapeHtml(item.title)}">`;
  }

  if (modalCaption) {
    modalCaption.textContent = `${item.title} — ${item.description || ""}`;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

/* ==========================================================================
   FORMULIR RESERVASI KE SUPABASE DATABASE (TABEL BOOKINGS) & WHATSAPP
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("bookingName")?.value.trim() || "";
    const clientWa = document.getElementById("bookingClientWa")?.value.trim() || "";
    const date = document.getElementById("bookingDate")?.value.trim() || "";
    const location = document.getElementById("bookingLocation")?.value.trim() || "";
    const pkg = document.getElementById("bookingPackage")?.value || "Paket Belum Dipilih";
    const notes = document.getElementById("bookingNotes")?.value.trim() || "-";

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Menyimpan Reservasi...</span>`;
    }

    // 1. Simpan ke database Supabase (Tabel bookings)
    if (isSupabaseReady()) {
      try {
        const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        
        // Cari package_id jika cocok dengan nama paket
        const matchedPkg = (loadedPackages || []).find(p => p.name === pkg);
        const pkgId = matchedPkg && matchedPkg.id && !matchedPkg.id.startsWith("pkg-") ? matchedPkg.id : null;
        const bookingNotes = `[Paket Dipilih: ${pkg}] ${notes}`;

        // Coba insert dengan nama kolom aktual 'whatsapp' & 'package_id'
        let { error: bookingError } = await db.from("bookings").insert({
          client_name: name,
          whatsapp: clientWa,
          event_date: date,
          location: location,
          package_id: pkgId,
          notes: bookingNotes,
          status: "pending"
        });

        // Fallback jika skema database menggunakan kolom 'whatsapp_number' / 'package_name'
        if (bookingError && (bookingError.code === "PGRST204" || bookingError.code === "42703")) {
          const fallbackPayload = {
            client_name: name,
            whatsapp_number: clientWa,
            event_date: date,
            location: location,
            package_name: pkg,
            notes: notes,
            status: "pending"
          };
          const retry = await db.from("bookings").insert(fallbackPayload);
          bookingError = retry.error;
        }

        if (bookingError) {
          console.warn("Gagal menyimpan ke tabel bookings Supabase:", bookingError.message);
        }
      } catch (err) {
        console.warn("Terjadi kendala saat menyimpan reservasi:", err);
      }
    }

    // 2. Format tanggal Indonesia untuk pesan WhatsApp
    let formattedDate = date;
    if (date) {
      try {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      } catch (err) {
        formattedDate = date;
      }
    }

    // 3. Susun Pesan WhatsApp yang Formal, Rapi, & Elegan
    const message = 
`✦ *RESERVASI KONTEN PERNIKAHAN — WCC.BYFARIHA* ✦

Halo Kak Fariha & Tim WCC.BYFARIHA, saya ingin reservasi tanggal dan konsultasi paket dokumentasi:

• *Nama Pasangan / Klien:* ${name}
• *Nomor WhatsApp:* ${clientWa}
• *Tanggal Acara:* ${formattedDate}
• *Kota & Venue:* ${location}
• *Pilihan Paket:* ${pkg}
• *Catatan / Konsep Acara:*
"${notes}"

Mohon informasi ketersediaan slot tanggal dan rincian selanjutnya. Terima kasih! ✨`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${currentWhatsAppNumber}?text=${encoded}`;

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    // Buka WhatsApp resmi
    window.open(waUrl, "_blank");

    // Reset formulir & tampilkan feedback
    form.reset();
    alert(`Terima kasih Kak ${name}! Reservasi Anda telah tersimpan dan diteruskan ke WhatsApp resmi WCC.BYFARIHA.`);
  });
}

/* ==========================================================================
   BANTUAN FORMAT & KEAMANAN
   ========================================================================== */
function formatRupiah(number) {
  if (number === 0 || !number) return "Konsultasi / Jadwal Khusus";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function safeUrl(url) {
  try {
    const u = new URL(url);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}
