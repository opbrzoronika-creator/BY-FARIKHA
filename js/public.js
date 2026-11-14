/**
 * WCC.BYFARIHA — Luxury Editorial Wedding & Event Content Creator
 * Public Website Logic: Dynamic Data, Editorial Animations, Lightbox, & WhatsApp Booking
 */

// Fallback Luxury Editorial Data (shown before Supabase is connected)
const FALLBACK_DATA = {
  settings: {
    hero_text: "Mengabadikan setiap tatapan, senyuman, dan momen sakral hari bahagia Anda dalam balutan estetika editorial sinematik 4K.",
    about_text: "WCC.BYFARIHA hadir untuk pasangan yang mendambakan dokumentasi pernikahan bernilai seni tinggi. Kami memadukan kehangatan momen intim dengan visual berkelas layaknya editorial majalah pernikahan dunia.",
    whatsapp_number: "6285700000000",
    instagram_url: "https://www.instagram.com/wcc.byfariha/",
    area_text: "Magetan, Madiun, Solo, Surabaya & Seluruh Indonesia"
  },
  packages: [
    {
      id: "pkg-1",
      name: "The Intimate Vow",
      price: 2500000,
      description: "Coverage 4-5 Jam (Akad / Pemberkatan)\n1 Creative Content Creator\n2 Edited Cinematic Reels (4K 60fps)\nAll Raw Videos & Photos Delivered in 24 Hours\niPhone 15/16 Pro Max Flagship Gear\nOnline Private Gallery Drive",
      is_featured: false,
      sort_order: 1
    },
    {
      id: "pkg-2",
      name: "The Grand Elegance",
      price: 4500000,
      description: "Coverage Full Day (Up to 10 Jam: Prep to Reception)\n1 Dedicated Content Creator\n4 Edited Cinematic Reels (Teaser & Highlights)\nSame-Day Edit (1 Reel ready in 12h)\nExclusive Behind-The-Scenes Aesthetic Stills\nAll Uncompressed Raw Footage within 24 Hours\nDirect WhatsApp Creative Consultation",
      is_featured: true,
      sort_order: 2
    },
    {
      id: "pkg-3",
      name: "The Editorial Affair",
      price: 6800000,
      description: "Comprehensive Full Day Coverage (Unlimited Hours)\n2 Creative Content Creators\n6 Edited Luxury Editorial Reels + 1 Long Form Reel\nSame-Day Edit (2 Reels ready on the day)\nComplete Behind-The-Scenes + Guest Interviews\nExclusive Color Graded Photo Carousel\nInstant Raw AirDrop / Hard Drive Transfer\nAvailable for Destination Wedding",
      is_featured: false,
      sort_order: 3
    }
  ],
  portfolio: [
    {
      id: "port-1",
      title: "The Royal Classical Vows",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      description: "Intimate Ceremony · Magetan"
    },
    {
      id: "port-2",
      title: "Whispers of Sunlight",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      description: "Pre-Ceremony Moments · Solo"
    },
    {
      id: "port-3",
      title: "Golden Hour Teaser Reel",
      type: "video",
      media_url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-embracing-outdoors-41221-large.mp4",
      description: "Cinematic 4K Highlight Reel"
    },
    {
      id: "port-4",
      title: "Sacred Ring Exchange",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      description: "Aesthetic Details & Macro"
    },
    {
      id: "port-5",
      title: "The Evening Reception",
      type: "video",
      media_url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-41220-large.mp4",
      description: "Grand Ballroom Atmosphere"
    },
    {
      id: "port-6",
      title: "Candid Graceful Laughter",
      type: "image",
      media_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      description: "Spontaneous Raw Emotions"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      client_name: "Nadya & Kevin",
      content: "Hasil konten dari WCC.BYFARIHA bener-bener kayak nonton film bioskop! Paginya akad, malamnya reels udah jadi dan langsung bisa kita upload di Instagram. Tone warnanya mahal banget, nggak norak.",
      venue: "Grand Ballroom Solo"
    },
    {
      id: "rev-2",
      client_name: "Anindya & Fikri",
      content: "Sangat bersyukur pilih Fariha. Timnya santun banget, nggak ganggu momen sakral sama sekali tapi semua momen haru dan detail kebaya sampai dekorasi terekam sempurna. Raw footagenya ratusan klip!",
      venue: "Intimate Wedding Magetan"
    },
    {
      id: "rev-3",
      client_name: "Claudia & Reza",
      content: "Beda banget sama dokumentasi biasa. Ini beneran luxury editorial vibe, cinematic abis. Teman-teman pada kagum liat transisi dan audionya. Worth every single penny!",
      venue: "Royal Heritage Hotel"
    }
  ]
};

let currentWhatsAppNumber = FALLBACK_DATA.settings.whatsapp_number;
let loadedPackages = [];
let allPortfolioItems = [];

// Check if Supabase keys are configured
const isSupabaseReady = () => {
  return window.SUPABASE_URL && 
         window.SUPABASE_ANON_KEY && 
         !window.SUPABASE_URL.includes("PASTE_") && 
         !window.SUPABASE_ANON_KEY.includes("PASTE_");
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navigation Mobile Toggle
  initNavigation();

  // Animations & Parallax
  initScrollAnimations();
  initParallaxEffects();

  // Lightbox Modal
  initLightbox();

  // Booking Form Submission
  initBookingForm();

  // Load Data (Supabase or Fallback)
  loadSiteData();
});

/* ==========================================================================
   NAVIGATION
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

    // Close menu when clicking nav links
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("open");
      });
    });
  }

  // Header background on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add("scrolled");
    } else {
      siteHeader?.classList.remove("scrolled");
    }
  }, { passive: true });
}

/* ==========================================================================
   SCROLL REVEALS & PARALLAX
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
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(el => observer.observe(el));
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

        // Slow ambient glow parallax
        if (glow1) {
          glow1.style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
        }
        if (glow2) {
          glow2.style.transform = `translate3d(0, ${-scrolled * 0.08}px, 0)`;
        }

        // Hero Frame slow parallax
        if (heroParallaxFrame && scrolled < 900) {
          heroParallaxFrame.style.transform = `translate3d(0, ${scrolled * 0.07}px, 0)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   DATA LOADING (SUPABASE OR FALLBACK)
   ========================================================================== */
async function loadSiteData() {
  if (isSupabaseReady()) {
    try {
      const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      
      const [packagesRes, portfolioRes, reviewsRes, settingsRes] = await Promise.all([
        db.from("packages").select("*").eq("is_active", true).order("sort_order"),
        db.from("portfolio").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        db.from("reviews").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        db.from("site_settings").select("*").eq("id", 1).maybeSingle()
      ]);

      // Packages
      if (!packagesRes.error && packagesRes.data && packagesRes.data.length > 0) {
        loadedPackages = packagesRes.data;
      } else {
        loadedPackages = FALLBACK_DATA.packages;
      }
      renderPackages(loadedPackages);

      // Portfolio
      if (!portfolioRes.error && portfolioRes.data && portfolioRes.data.length > 0) {
        allPortfolioItems = portfolioRes.data;
      } else {
        allPortfolioItems = FALLBACK_DATA.portfolio;
      }
      renderPortfolio(allPortfolioItems);
      initPortfolioFilters();

      // Reviews
      if (!reviewsRes.error && reviewsRes.data && reviewsRes.data.length > 0) {
        renderReviews(reviewsRes.data);
      } else {
        renderReviews(FALLBACK_DATA.reviews);
      }

      // Settings
      if (!settingsRes.error && settingsRes.data) {
        applySettings(settingsRes.data);
      } else {
        applySettings(FALLBACK_DATA.settings);
      }

      return;
    } catch (err) {
      console.warn("Supabase query error, fallback loaded:", err);
    }
  }

  // If Supabase not connected yet, render fallback luxury starter content
  loadedPackages = FALLBACK_DATA.packages;
  allPortfolioItems = FALLBACK_DATA.portfolio;
  renderPackages(loadedPackages);
  renderPortfolio(allPortfolioItems);
  initPortfolioFilters();
  renderReviews(FALLBACK_DATA.reviews);
  applySettings(FALLBACK_DATA.settings);
}

function applySettings(s) {
  if (!s) return;
  
  if (s.hero_text) {
    const el = document.getElementById("heroText");
    if (el) el.textContent = s.hero_text;
  }
  if (s.about_text) {
    const el = document.getElementById("aboutText");
    if (el) el.textContent = s.about_text;
  }
  if (s.area_text) {
    const heroArea = document.getElementById("heroArea");
    if (heroArea) heroArea.textContent = s.area_text;
    const bookingArea = document.getElementById("bookingAreaNotice");
    if (bookingArea) bookingArea.textContent = s.area_text;
  }
  if (s.whatsapp_number) {
    currentWhatsAppNumber = s.whatsapp_number.replace(/\D/g, "");
    const waLink = document.getElementById("directWaLink");
    if (waLink) waLink.href = `https://wa.me/${currentWhatsAppNumber}?text=${encodeURIComponent("Halo WCC.BYFARIHA, saya ingin konsultasi layanan wedding content creator.")}`;
  }
  if (s.instagram_url) {
    const igLink = document.getElementById("directIgLink");
    if (igLink) {
      igLink.href = s.instagram_url;
      const cleanHandle = s.instagram_url.replace("https://www.instagram.com/", "").replace(/\/$/, "");
      igLink.textContent = `@${cleanHandle} ↗`;
    }
  }
}

/* ==========================================================================
   RENDER PACKAGES
   ========================================================================== */
function renderPackages(packages) {
  const container = document.getElementById("packageGrid");
  const selectBox = document.getElementById("bookingPackage");

  if (!container) return;

  if (!packages || packages.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>Daftar paket akan segera hadir.</p></div>`;
    return;
  }

  // Populate booking dropdown
  if (selectBox) {
    selectBox.innerHTML = `<option value="" disabled selected>Pilih salah satu paket...</option>` +
      packages.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (${formatRupiah(p.price)})</option>`).join("") +
      `<option value="Paket Kustom / Lainnya">Paket Kustom / Konsultasi Dulu</option>`;
  }

  // Render cards
  container.innerHTML = packages.map(pkg => {
    const features = (pkg.description || "")
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const featureListHtml = features.map(item => `
      <li>
        <span class="feature-check">✦</span>
        <span>${escapeHtml(item)}</span>
      </li>
    `).join("");

    return `
      <article class="package-card ${pkg.is_featured ? "featured" : ""}">
        ${pkg.is_featured ? `<span class="package-badge">RECOMMENDED</span>` : ""}
        <div>
          <p class="package-eyebrow">WCC.BYFARIHA EXPERIENCES</p>
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
}

// Global action to select package and scroll to booking form
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
   RENDER PORTFOLIO & FILTERS
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

    // If video, use a nice wedding poster thumbnail or background
    const thumbUrl = isVideo 
      ? "https://images.unsplash.com/photo-1519225424982-f5f73c68df8e?auto=format&fit=crop&w=800&q=80" 
      : mediaUrl;

    return `
      <div class="portfolio-card" onclick="openLightbox(${index}, '${filter}')">
        <img src="${thumbUrl}" alt="${escapeHtml(item.title)}" loading="lazy">
        
        <span class="portfolio-type-pill">
          ${isVideo ? "<span>▶</span> VIDEO REELS" : "<span>✦</span> PHOTO"}
        </span>

        ${isVideo ? `<div class="video-play-badge">▶</div>` : ""}

        <div class="portfolio-overlay">
          <h3 class="portfolio-title">${escapeHtml(item.title)}</h3>
          <p class="portfolio-caption">${escapeHtml(item.description || "Wedding Archive")}</p>
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
   RENDER REVIEWS
   ========================================================================== */
function renderReviews(reviews) {
  const container = document.getElementById("reviewGrid");
  if (!container) return;

  if (!reviews || reviews.length === 0) {
    container.innerHTML = `<div class="loading-state"><p>Testimoni akan segera hadir.</p></div>`;
    return;
  }

  container.innerHTML = reviews.map(rev => {
    const initial = rev.client_name ? rev.client_name.trim().charAt(0) : "W";
    return `
      <article class="review-card">
        <div>
          <div class="quote-mark">“</div>
          <div class="review-stars">★★★★★</div>
          <p class="review-quote">${escapeHtml(rev.content)}</p>
        </div>
        <div class="review-author">
          <div class="author-monogram">${escapeHtml(initial)}</div>
          <div>
            <span class="author-name">${escapeHtml(rev.client_name)}</span>
            <span class="author-venue">${escapeHtml(rev.venue || "Wedding Client")}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

/* ==========================================================================
   LIGHTBOX MODAL
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
      <video controls autoplay playsinline style="max-height: 75vh; width: 100%;">
        <source src="${safeMedia}" type="video/mp4">
        Browser Anda tidak mendukung tag video. Silakan buka tautan: <a href="${safeMedia}" target="_blank" style="color:var(--champagne)">Buka Video</a>
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
   BOOKING FORM TO WHATSAPP
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("bookingName")?.value.trim() || "";
    const clientWa = document.getElementById("bookingClientWa")?.value.trim() || "";
    const date = document.getElementById("bookingDate")?.value.trim() || "";
    const location = document.getElementById("bookingLocation")?.value.trim() || "";
    const pkg = document.getElementById("bookingPackage")?.value || "Paket Belum Dipilih";
    const notes = document.getElementById("bookingNotes")?.value.trim() || "-";

    // Format readable Indonesian date
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

    // Build Luxury Editorial WhatsApp Message
    const message = 
`✦ *RESERVASI WEDDING CONTENT CREATOR — WCC.BYFARIHA* ✦

Halo Kak Fariha & Tim WCC.BYFARIHA, saya ingin mengecek ketersediaan tanggal dan booking layanan dokumentasi:

• *Nama Pasangan / Klien:* ${name}
• *Nomor WhatsApp:* ${clientWa}
• *Tanggal Acara:* ${formattedDate}
• *Lokasi / Venue:* ${location}
• *Pilihan Paket:* ${pkg}
• *Catatan / Konsep Acara:*
"${notes}"

Mohon informasi ketersediaan slot dan langkah selanjutnya. Terima kasih! ✨`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${currentWhatsAppNumber}?text=${encoded}`;

    window.open(waUrl, "_blank");
  });
}

/* ==========================================================================
   HELPERS & SANITIZERS
   ========================================================================== */
function formatRupiah(number) {
  if (number === 0 || !number) return "Konsultasi / Sesuai Jadwal";
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
