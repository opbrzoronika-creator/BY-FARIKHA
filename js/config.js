/**
 * WCC.BYFARIHA — Supabase Environment Configuration Hub
 * 
 * Pengaturan Project URL dan Publishable (Anon) Key.
 * ⚠️ KEAMANAN: HANYA gunakan Anon / Publishable Key.
 * JANGAN PERNAH memasukkan service_role key di file ini!
 */

// 1. Variabel Default / Template
window.__ENV__ = window.__ENV__ || {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-publishable-key"
};

// 2. Baca dari variabel global atau localStorage (jika tersimpan di browser)
const localUrl = localStorage.getItem("SUPABASE_URL") || localStorage.getItem("WCC_SUPABASE_URL");
const localKey = localStorage.getItem("SUPABASE_ANON_KEY") || localStorage.getItem("WCC_SUPABASE_ANON_KEY");

if (!window.SUPABASE_URL || window.SUPABASE_URL.includes("PASTE_") || window.SUPABASE_URL.includes("your-project")) {
  if (localUrl && !localUrl.includes("PASTE_") && !localUrl.includes("your-project")) {
    window.SUPABASE_URL = localUrl;
  } else if (window.__ENV__.SUPABASE_URL && !window.__ENV__.SUPABASE_URL.includes("PASTE_")) {
    window.SUPABASE_URL = window.__ENV__.SUPABASE_URL;
  }
}

if (!window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY.includes("PASTE_") || window.SUPABASE_ANON_KEY.includes("your-anon")) {
  if (localKey && !localKey.includes("PASTE_") && !localKey.includes("your-anon")) {
    window.SUPABASE_ANON_KEY = localKey;
  } else if (window.__ENV__.SUPABASE_ANON_KEY && !window.__ENV__.SUPABASE_ANON_KEY.includes("PASTE_")) {
    window.SUPABASE_ANON_KEY = window.__ENV__.SUPABASE_ANON_KEY;
  }
}

// 3. Proteksi Keamanan: Blokir penggunaan service_role key di frontend
if (window.SUPABASE_ANON_KEY && (
  window.SUPABASE_ANON_KEY.includes("service_role") || 
  window.SUPABASE_ANON_KEY.toLowerCase().includes("secret")
)) {
  console.error("🚨 PERINGATAN KEAMANAN FATAL: service_role key terdeteksi! Kunci ini tidak boleh digunakan di frontend.");
  alert("Peringatan Keamanan: Terdeteksi service_role key. Harap hanya gunakan anon / publishable key demi keamanan database Anda.");
  window.SUPABASE_ANON_KEY = "";
}

// 4. Validasi kesiapan kredensial Supabase
window.isSupabaseConfigured = function() {
  const url = window.SUPABASE_URL || "";
  const key = window.SUPABASE_ANON_KEY || "";
  return url.length > 10 && 
         key.length > 20 && 
         !url.includes("PASTE_") && 
         !url.includes("your-project") && 
         !key.includes("PASTE_") && 
         !key.includes("your-anon");
};

// 5. Helper untuk menyimpan kredensial dari UI browser ke localStorage
window.setSupabaseCredentials = function(url, key) {
  if (!url || !key) return false;
  const cleanUrl = url.trim().replace(/\/$/, "");
  const cleanKey = key.trim();

  if (cleanKey.includes("service_role") || cleanKey.toLowerCase().includes("secret")) {
    alert("Ditolak: Jangan gunakan service_role key. Gunakan Publishable/Anon Key saja.");
    return false;
  }

  window.SUPABASE_URL = cleanUrl;
  window.SUPABASE_ANON_KEY = cleanKey;
  localStorage.setItem("SUPABASE_URL", cleanUrl);
  localStorage.setItem("SUPABASE_ANON_KEY", cleanKey);
  return true;
};

// 6. Async helper untuk memastikan konfigurasi termuat dari .env.local atau .env (jika via server HTTP)
window.ensureSupabaseConfig = async function() {
  if (window.isSupabaseConfigured()) return true;

  // Cek localStorage sekali lagi
  const lsUrl = localStorage.getItem("SUPABASE_URL") || localStorage.getItem("WCC_SUPABASE_URL");
  const lsKey = localStorage.getItem("SUPABASE_ANON_KEY") || localStorage.getItem("WCC_SUPABASE_ANON_KEY");
  if (lsUrl && lsKey && !lsUrl.includes("your-project") && !lsKey.includes("your-anon")) {
    window.SUPABASE_URL = lsUrl;
    window.SUPABASE_ANON_KEY = lsKey;
    return true;
  }

  // Jika melalui server HTTP (localhost / domain), coba fetch file .env.local atau .env
  if (window.location.protocol.startsWith("http")) {
    const isInsideAdmin = window.location.pathname.includes("/admin/");
    const envPaths = [
      isInsideAdmin ? "../.env.local" : ".env.local",
      isInsideAdmin ? "../.env" : ".env"
    ];

    for (const p of envPaths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          const text = await res.text();
          const lines = text.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#")) {
              const [k, ...v] = trimmed.split("=");
              const key = k.trim();
              const val = v.join("=").trim().replace(/^["']|["']$/g, "");
              if (key === "SUPABASE_URL" && val && !val.includes("your-project") && !val.includes("PASTE_")) {
                window.SUPABASE_URL = val;
              }
              if (key === "SUPABASE_ANON_KEY" && val && !val.includes("your-anon") && !val.includes("PASTE_")) {
                window.SUPABASE_ANON_KEY = val;
              }
            }
          }
          if (window.isSupabaseConfigured()) return true;
        }
      } catch (e) {
        // Abaikan fetch error
      }
    }
  }

  return window.isSupabaseConfigured();
};
