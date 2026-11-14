/**
 * WCC.BYFARIHA — Dashboard Pemilik (Admin)
 * Terintegrasi penuh dengan Supabase Database & Supabase Storage bucket 'wcc-portfolio'
 */

const isConfigured = () => typeof window.isSupabaseConfigured === "function" 
  ? window.isSupabaseConfigured() 
  : (window.SUPABASE_URL && !window.SUPABASE_URL.includes("PASTE_") && window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.includes("PASTE_"));

const $ = id => document.getElementById(id);

let db = null;
let currentPackages = [];
let currentPortfolio = [];
let currentReviews = [];
let currentBookings = [];
let currentBookingFilter = "all";

// Inisialisasi Sesi & Autentikasi
(async () => {
  if (!isConfigured()) {
    $("adminNotice").textContent = "Konfigurasi Supabase belum terdeteksi. Silakan periksa file .env atau js/config.js.";
    $("adminNotice").style.color = "#d9534f";
    return;
  }

  db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  // 1. Cek sesi aktif
  const { data: { session }, error: sessionError } = await db.auth.getSession();
  if (sessionError || !session) {
    location.href = "login.html";
    return;
  }

  // 2. Verifikasi hak akses: Pastikan akun memiliki role 'owner' di tabel profiles
  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "owner") {
    await db.auth.signOut();
    alert("Akses Ditolak: Akun ini tidak memiliki hak akses sebagai pemilik (role 'owner') di sistem.");
    location.href = "login.html";
    return;
  }

  // 3. Update status info
  $("adminNotice").textContent = `Masuk sebagai: ${session.user.email} (Akses Pemilik Terverifikasi)`;
  $("adminNotice").style.color = "var(--champagne)";

  // Setup event listener untuk logout
  $("logoutBtn").onclick = async () => {
    await db.auth.signOut();
    location.href = "login.html";
  };

  // Muat seluruh data
  await refreshAll();
})();

async function refreshAll() {
  await Promise.all([
    loadBookings(),
    loadPackages(),
    loadPortfolio(),
    loadReviews(),
    loadSettings()
  ]);
}

/* ==========================================================================
   1. KELOLA RESERVASI (BOOKINGS)
   ========================================================================== */
async function loadBookings() {
  if (!db) return;
  const { data, error } = await db
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    notice("Gagal memuat reservasi: " + error.message);
    return;
  }

  currentBookings = data || [];
  $("countBookings").textContent = currentBookings.length;
  renderBookingsList();
}

window.filterBookings = function(status) {
  currentBookingFilter = status;
  ["all", "pending", "confirmed", "completed"].forEach(s => {
    const btn = $(`filterBooking${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (btn) {
      if (s === status) {
        btn.classList.add("btn-terracotta");
        btn.classList.remove("btn-champagne-outline");
      } else {
        btn.classList.remove("btn-terracotta");
        btn.classList.add("btn-champagne-outline");
      }
    }
  });
  renderBookingsList();
};

function renderBookingsList() {
  const container = $("bookingList");
  if (!container) return;

  const filtered = currentBookingFilter === "all" 
    ? currentBookings 
    : currentBookings.filter(b => b.status === currentBookingFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="muted" style="padding: 20px 0;">Belum ada data reservasi ${currentBookingFilter === "all" ? "" : "dengan status ini"}.</p>`;
    return;
  }

  const statusLabels = {
    pending: '<span style="color: #f0ad4e; font-weight: 600;">Menunggu Konfirmasi</span>',
    confirmed: '<span style="color: #5cb85c; font-weight: 600;">Dikonfirmasi</span>',
    completed: '<span style="color: var(--champagne); font-weight: 600;">Selesai</span>',
    cancelled: '<span style="color: #d9534f; font-weight: 600;">Dibatalkan</span>'
  };

  container.innerHTML = filtered.map(b => {
    let cleanWa = (b.whatsapp_number || "").replace(/\D/g, "");
    if (cleanWa.startsWith("0")) cleanWa = "62" + cleanWa.slice(1);

    const waChatMsg = encodeURIComponent(`Halo Kak ${b.client_name}, terima kasih telah melakukan reservasi di WCC.BYFARIHA untuk tanggal ${b.event_date}. Kami ingin mengonfirmasi detail acara pernikahan Anda.`);
    const waChatLink = `https://wa.me/${cleanWa}?text=${waChatMsg}`;

    return `
      <div class="admin-row" style="flex-direction: column; align-items: flex-start; gap: 12px; padding: 20px 0;">
        <div style="display: flex; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 10px;">
          <div>
            <b style="font-size: 16px;">${esc(b.client_name)}</b>
            <span style="font-size: 13px; color: var(--champagne);">Paket: ${esc(b.package_name)} · Tanggal: ${esc(b.event_date)}</span>
            <span style="color: var(--text-muted); font-size: 12px;">Lokasi: ${esc(b.location)} · WhatsApp: ${esc(b.whatsapp_number)}</span>
          </div>
          <div>
            ${statusLabels[b.status] || b.status}
          </div>
        </div>

        ${b.notes ? `<div style="background: var(--bg-primary); padding: 10px 14px; border-radius: 2px; width: 100%; font-size: 12.5px; border-left: 2px solid var(--terracotta);"><b>Catatan Klien:</b> ${esc(b.notes)}</div>` : ""}

        <div style="display: flex; gap: 10px; width: 100%; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-top: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 11px; text-transform: uppercase; margin: 0; color: var(--text-muted);">Ubah Status:</label>
            <select onchange="updateBookingStatus('${b.id}', this.value)" style="padding: 6px 10px; font-size: 12px; width: auto; background: var(--bg-primary); border: 1px solid var(--border-card);">
              <option value="pending" ${b.status === "pending" ? "selected" : ""}>Menunggu Konfirmasi</option>
              <option value="confirmed" ${b.status === "confirmed" ? "selected" : ""}>Dikonfirmasi</option>
              <option value="completed" ${b.status === "completed" ? "selected" : ""}>Selesai</option>
              <option value="cancelled" ${b.status === "cancelled" ? "selected" : ""}>Dibatalkan</option>
            </select>
          </div>

          <div style="display: flex; gap: 8px;">
            <a class="btn btn-terracotta small" href="${waChatLink}" target="_blank" rel="noopener">
              Hubungi via WhatsApp ↗
            </a>
            <button class="btn danger small" onclick="deleteRow('bookings', '${b.id}')">Hapus</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.updateBookingStatus = async function(id, status) {
  if (!db) return;
  const { error } = await db.from("bookings").update({ status }).eq("id", id);
  if (error) return notice("Gagal memperbarui status: " + error.message);
  notice("Status reservasi berhasil diperbarui.");
  await loadBookings();
};

/* ==========================================================================
   2. KELOLA PAKET HARGA (PACKAGES)
   ========================================================================== */
async function loadPackages() {
  if (!db) return;
  const { data, error } = await db
    .from("packages")
    .select("*")
    .order("sort_order");

  if (error) return notice("Gagal memuat paket: " + error.message);
  currentPackages = data || [];
  $("countPackages").textContent = currentPackages.filter(p => p.is_active).length;

  $("packageList").innerHTML = currentPackages.map(x => `
    <div class="admin-row">
      <div>
        <b>${esc(x.name)} ${x.is_featured ? '<span style="color:var(--terracotta); font-size:11px;">(Pilihan Utama)</span>' : ''}</b>
        <span>${rupiah(x.price)} · Status: ${x.is_active ? '<span style="color:#5cb85c;">Tampil</span>' : '<span style="color:#d9534f;">Disembunyikan</span>'}</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn outline small" onclick="editPackage('${x.id}')">Edit</button>
        <button class="btn danger small" onclick="deleteRow('packages', '${x.id}')">Hapus</button>
      </div>
    </div>
  `).join("") || '<p class="muted">Belum ada paket.</p>';
}

$("packageForm").onsubmit = async e => {
  e.preventDefault();
  if (!db) return;

  const id = $("packageId").value;
  const submitBtn = $("packageSubmitBtn");
  submitBtn.disabled = true;

  const row = {
    name: $("packageName").value.trim(),
    price: Number($("packagePrice").value) || 0,
    description: $("packageDescription").value.trim(),
    is_featured: $("packageFeatured").checked,
    is_active: $("packageActive") ? $("packageActive").checked : true
  };

  const query = id ? db.from("packages").update(row).eq("id", id) : db.from("packages").insert(row);
  const { error } = await query;
  submitBtn.disabled = false;

  if (error) return notice("Gagal menyimpan paket: " + error.message);

  $("packageForm").reset();
  $("packagePrice").value = 0;
  $("packageId").value = "";
  $("packageSubmitBtn").textContent = "Simpan Paket";
  if ($("packageActive")) $("packageActive").checked = true;

  await loadPackages();
  notice("Paket layanan berhasil disimpan.");
};

window.editPackage = id => {
  const x = currentPackages.find(p => p.id === id);
  if (!x) return;
  $("packageId").value = x.id;
  $("packageName").value = x.name;
  $("packagePrice").value = x.price;
  $("packageDescription").value = x.description || "";
  $("packageFeatured").checked = x.is_featured;
  if ($("packageActive")) $("packageActive").checked = x.is_active;
  $("packageSubmitBtn").textContent = "Perbarui Paket";
  location.hash = "packages";
};

$("resetPackage").onclick = () => {
  $("packageForm").reset();
  $("packageId").value = "";
  $("packagePrice").value = 0;
  $("packageSubmitBtn").textContent = "Simpan Paket";
  if ($("packageActive")) $("packageActive").checked = true;
};

/* ==========================================================================
   3. KELOLA PORTOFOLIO & STORAGE (PORTFOLIO & BUCKET wcc-portfolio)
   ========================================================================== */
async function loadPortfolio() {
  if (!db) return;
  const { data, error } = await db
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return notice("Gagal memuat portofolio: " + error.message);
  currentPortfolio = data || [];
  $("countPortfolio").textContent = currentPortfolio.filter(p => p.is_active).length;

  $("portfolioList").innerHTML = currentPortfolio.map(x => `
    <div class="admin-row">
      <div style="display: flex; gap: 14px; align-items: center;">
        ${x.type === "image" 
          ? `<img src="${safeUrl(x.media_url)}" alt="${esc(x.title)}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 2px; border: 1px solid var(--border-card);">` 
          : `<div style="width: 52px; height: 52px; display: grid; place-items: center; background: var(--bg-primary); border-radius: 2px; border: 1px solid var(--border-card); color: var(--terracotta); font-size: 16px;">▶</div>`}
        <div>
          <b>${esc(x.title)}</b>
          <span>${x.type === "video" ? "Video Reels" : "Foto"} · ${esc(x.description || "Tanpa deskripsi")} · ${x.is_active ? '<span style="color:#5cb85c;">Tampil</span>' : '<span style="color:#d9534f;">Disembunyikan</span>'}</span>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn outline small" onclick="editPortfolio('${x.id}')">Edit</button>
        <button class="btn danger small" onclick="deletePortfolioItem('${x.id}')">Hapus</button>
      </div>
    </div>
  `).join("") || '<p class="muted">Belum ada karya portofolio.</p>';
}

$("portfolioForm").onsubmit = async e => {
  e.preventDefault();
  if (!db) return;

  const id = $("portfolioId").value;
  const fileInput = $("portfolioFile");
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  let mediaUrl = $("portfolioUrl").value.trim();
  const submitBtn = $("portfolioSubmitBtn");

  submitBtn.disabled = true;

  try {
    // Jika ada file yang dipilih, unggah ke Storage bucket 'wcc-portfolio'
    if (file) {
      notice("Mengunggah berkas ke Storage bucket wcc-portfolio...");
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error: uploadError } = await db.storage
        .from("wcc-portfolio")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        submitBtn.disabled = false;
        return notice("Gagal mengunggah berkas ke Storage: " + uploadError.message);
      }

      // Ambil Public URL dari file yang diunggah
      const { data: { publicUrl } } = db.storage
        .from("wcc-portfolio")
        .getPublicUrl(filePath);

      mediaUrl = publicUrl;
    }

    if (!mediaUrl) {
      submitBtn.disabled = false;
      return notice("Harap pilih berkas untuk diunggah atau masukkan tautan URL media.");
    }

    const row = {
      title: $("portfolioTitle").value.trim(),
      type: $("portfolioType").value,
      media_url: mediaUrl,
      description: $("portfolioDescription").value.trim(),
      is_active: $("portfolioActive") ? $("portfolioActive").checked : true
    };

    const query = id 
      ? db.from("portfolio").update(row).eq("id", id) 
      : db.from("portfolio").insert(row);

    const { error: dbError } = await query;
    submitBtn.disabled = false;

    if (dbError) return notice("Gagal menyimpan portofolio: " + dbError.message);

    $("portfolioForm").reset();
    $("portfolioId").value = "";
    if (fileInput) fileInput.value = "";
    $("portfolioSubmitBtn").textContent = "Simpan Portofolio";
    if ($("portfolioActive")) $("portfolioActive").checked = true;

    await loadPortfolio();
    notice("Portofolio berhasil disimpan.");
  } catch (err) {
    submitBtn.disabled = false;
    notice("Terjadi kesalahan: " + err.message);
  }
};

window.editPortfolio = id => {
  const x = currentPortfolio.find(p => p.id === id);
  if (!x) return;
  $("portfolioId").value = x.id;
  $("portfolioTitle").value = x.title;
  $("portfolioType").value = x.type;
  $("portfolioUrl").value = x.media_url;
  $("portfolioDescription").value = x.description || "";
  if ($("portfolioActive")) $("portfolioActive").checked = x.is_active;
  $("portfolioSubmitBtn").textContent = "Perbarui Portofolio";
  location.hash = "portfolio";
};

$("resetPortfolio").onclick = () => {
  $("portfolioForm").reset();
  $("portfolioId").value = "";
  if ($("portfolioFile")) $("portfolioFile").value = "";
  $("portfolioSubmitBtn").textContent = "Simpan Portofolio";
  if ($("portfolioActive")) $("portfolioActive").checked = true;
};

window.deletePortfolioItem = async id => {
  if (!confirm("Yakin ingin menghapus item portofolio ini?")) return;
  if (!db) return;

  const item = currentPortfolio.find(p => p.id === id);

  // Jika media berada di bucket 'wcc-portfolio', hapus juga dari Storage
  if (item && item.media_url && item.media_url.includes("wcc-portfolio")) {
    try {
      const parts = item.media_url.split("wcc-portfolio/");
      if (parts[1]) {
        await db.storage.from("wcc-portfolio").remove([decodeURIComponent(parts[1])]);
      }
    } catch (e) {
      console.warn("Gagal menghapus file dari Storage:", e);
    }
  }

  const { error } = await db.from("portfolio").delete().eq("id", id);
  if (error) return notice("Gagal menghapus portofolio: " + error.message);
  await loadPortfolio();
  notice("Portofolio berhasil dihapus.");
};

/* ==========================================================================
   4. KELOLA TESTIMONI (REVIEWS)
   ========================================================================== */
async function loadReviews() {
  if (!db) return;
  const { data, error } = await db
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return notice("Gagal memuat ulasan: " + error.message);
  currentReviews = data || [];
  $("countReviews").textContent = currentReviews.filter(r => r.is_active).length;

  $("reviewList").innerHTML = currentReviews.map(x => `
    <div class="admin-row">
      <div>
        <b>${esc(x.client_name)}</b>
        <span>“${esc(x.content)}” · ${x.is_active ? '<span style="color:#5cb85c;">Tampil</span>' : '<span style="color:#d9534f;">Disembunyikan</span>'}</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn outline small" onclick="editReview('${x.id}')">Edit</button>
        <button class="btn danger small" onclick="deleteRow('reviews', '${x.id}')">Hapus</button>
      </div>
    </div>
  `).join("") || '<p class="muted">Belum ada testimoni.</p>';
}

$("reviewForm").onsubmit = async e => {
  e.preventDefault();
  if (!db) return;

  const id = $("reviewId").value;
  const submitBtn = $("reviewSubmitBtn");
  submitBtn.disabled = true;

  const row = {
    client_name: $("reviewName").value.trim(),
    content: $("reviewText").value.trim(),
    is_active: $("reviewActive") ? $("reviewActive").checked : true
  };

  const query = id ? db.from("reviews").update(row).eq("id", id) : db.from("reviews").insert(row);
  const { error } = await query;
  submitBtn.disabled = false;

  if (error) return notice("Gagal menyimpan testimoni: " + error.message);

  $("reviewForm").reset();
  $("reviewId").value = "";
  $("reviewSubmitBtn").textContent = "Simpan Testimoni";
  if ($("reviewActive")) $("reviewActive").checked = true;

  await loadReviews();
  notice("Testimoni berhasil disimpan.");
};

window.editReview = id => {
  const x = currentReviews.find(r => r.id === id);
  if (!x) return;
  $("reviewId").value = x.id;
  $("reviewName").value = x.client_name;
  $("reviewText").value = x.content;
  if ($("reviewActive")) $("reviewActive").checked = x.is_active;
  $("reviewSubmitBtn").textContent = "Perbarui Testimoni";
  location.hash = "reviews";
};

$("resetReview").onclick = () => {
  $("reviewForm").reset();
  $("reviewId").value = "";
  $("reviewSubmitBtn").textContent = "Simpan Testimoni";
  if ($("reviewActive")) $("reviewActive").checked = true;
};

/* ==========================================================================
   5. PENGATURAN PROFIL & KONTAK (SITE_SETTINGS)
   ========================================================================== */
async function loadSettings() {
  if (!db) return;
  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) return notice("Gagal memuat pengaturan profil: " + error.message);
  if (data) {
    $("settingHero").value = data.hero_text || "";
    $("settingAbout").value = data.about_text || "";
    $("settingWhatsApp").value = data.whatsapp_number || "";
    $("settingInstagram").value = data.instagram_url || "https://www.instagram.com/wcc.byfariha/";
    $("settingArea").value = data.area_text || "";
  }
}

$("settingsForm").onsubmit = async e => {
  e.preventDefault();
  if (!db) return;

  const row = {
    id: 1,
    hero_text: $("settingHero").value.trim(),
    about_text: $("settingAbout").value.trim(),
    whatsapp_number: $("settingWhatsApp").value.replace(/\D/g, ""),
    instagram_url: $("settingInstagram").value.trim(),
    area_text: $("settingArea").value.trim()
  };

  const { error } = await db.from("site_settings").upsert(row);
  if (error) return notice("Gagal menyimpan profil: " + error.message);
  notice("Profil dan informasi kontak resmi berhasil diperbarui.");
};

/* ==========================================================================
   FUNGSI BANTUAN
   ========================================================================== */
window.deleteRow = async (table, id) => {
  if (!confirm("Yakin ingin menghapus data ini?")) return;
  if (!db) return;

  const { error } = await db.from(table).delete().eq("id", id);
  if (error) return notice("Gagal menghapus data: " + error.message);
  notice("Data berhasil dihapus.");
  await refreshAll();
};

function notice(s) {
  const el = $("adminNotice");
  if (el) {
    el.textContent = s;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function rupiah(n) {
  if (n === 0 || !n) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n || 0);
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function safeUrl(s) {
  try {
    const u = new URL(s);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}
