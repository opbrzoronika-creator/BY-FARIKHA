/**
 * WCC.BYFARIHA — Login Dashboard Pemilik
 * Terintegrasi dengan Supabase Authentication & Validasi Role 'owner' pada tabel profiles
 */

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMessage");
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
const helperCard = document.getElementById("configHelperCard");
const cfgSaveBtn = document.getElementById("cfgSaveBtn");
const cfgUrlInput = document.getElementById("cfgUrlInput");
const cfgKeyInput = document.getElementById("cfgKeyInput");

// Cek konfigurasi saat halaman dimuat
(async function checkConfig() {
  const ready = typeof window.ensureSupabaseConfig === "function" 
    ? await window.ensureSupabaseConfig() 
    : window.isSupabaseConfigured();

  if (!ready && helperCard) {
    helperCard.style.display = "block";
    if (cfgUrlInput && window.SUPABASE_URL && !window.SUPABASE_URL.includes("your-project")) {
      cfgUrlInput.value = window.SUPABASE_URL;
    }
  } else if (helperCard) {
    helperCard.style.display = "none";
  }
})();

// Handler simpan kredensial cepat dari UI helper
if (cfgSaveBtn) {
  cfgSaveBtn.addEventListener("click", () => {
    const url = cfgUrlInput ? cfgUrlInput.value.trim() : "";
    const key = cfgKeyInput ? cfgKeyInput.value.trim() : "";

    if (!url || !key) {
      alert("Harap masukkan SUPABASE_URL dan SUPABASE_ANON_KEY.");
      return;
    }

    if (window.setSupabaseCredentials && window.setSupabaseCredentials(url, key)) {
      if (helperCard) helperCard.style.display = "none";
      if (msg) {
        msg.textContent = "Kredensial berhasil disimpan! Silakan masuk dengan akun pemilik Anda.";
        msg.style.color = "#5cb85c";
      }
    }
  });
}

// Handler form login
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ready = typeof window.ensureSupabaseConfig === "function" 
      ? await window.ensureSupabaseConfig() 
      : window.isSupabaseConfigured();

    if (!ready) {
      if (helperCard) helperCard.style.display = "block";
      msg.textContent = "Supabase belum terkonfigurasi. Silakan isi SUPABASE_URL dan SUPABASE_ANON_KEY pada formulir pengaturan di bawah ini atau pada file .env.local.";
      msg.style.color = "#d9534f";
      return;
    }

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";

    if (!email || !password) {
      msg.textContent = "Harap masukkan email dan kata sandi pemilik.";
      msg.style.color = "#d9534f";
      return;
    }

    msg.textContent = "Memverifikasi akun pemilik...";
    msg.style.color = "var(--champagne)";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
    }

    try {
      const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

      // 1. Autentikasi Supabase Auth
      const { data: authData, error: authError } = await db.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        let errText = authError.message;
        if (errText.includes("Invalid login credentials")) {
          errText = "Email atau kata sandi tidak cocok. Silakan periksa kembali.";
        }
        msg.textContent = "Gagal masuk: " + errText;
        msg.style.color = "#d9534f";
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }
        return;
      }

      // 2. Verifikasi hak akses: Pastikan akun memiliki role 'owner' di tabel profiles
      const { data: profile, error: profileError } = await db
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.role !== "owner") {
        await db.auth.signOut();
        msg.textContent = "Akses Ditolak: Akun Anda tidak terdaftar sebagai pemilik (role 'owner') di tabel profiles.";
        msg.style.color = "#d9534f";
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }
        return;
      }

      // 3. Berhasil
      msg.textContent = "Autentikasi pemilik berhasil! Mengalihkan ke Dashboard...";
      msg.style.color = "#5cb85c";

      setTimeout(() => {
        location.href = "index.html";
      }, 350);

    } catch (err) {
      msg.textContent = "Terjadi kendala koneksi: " + err.message;
      msg.style.color = "#d9534f";
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    }
  });
}
