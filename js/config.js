/**
 * WCC.BYFARIHA — Supabase Environment Configuration
 * 
 * Pengaturan Project URL dan Publishable (Anon) Key.
 * ⚠️ KEAMANAN: HANYA gunakan Anon / Publishable Key.
 * JANGAN PERNAH memasukkan service_role key di file ini!
 */

// Konfigurasi Kredensial Supabase
window.__ENV__ = window.__ENV__ || {
  SUPABASE_URL: "PASTE_SUPABASE_PROJECT_URL_HERE",
  SUPABASE_ANON_KEY: "PASTE_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE"
};

// Cek apakah ada kredensial yang tersimpan di localStorage (berguna untuk pengujian runtime di browser)
const savedUrl = localStorage.getItem("WCC_SUPABASE_URL");
const savedKey = localStorage.getItem("WCC_SUPABASE_ANON_KEY");

window.SUPABASE_URL = savedUrl || window.__ENV__.SUPABASE_URL;
window.SUPABASE_ANON_KEY = savedKey || window.__ENV__.SUPABASE_ANON_KEY;

// Proteksi Keamanan: Cegah penggunaan service_role key di sisi frontend
if (window.SUPABASE_ANON_KEY && (
  window.SUPABASE_ANON_KEY.includes("service_role") || 
  window.SUPABASE_ANON_KEY.toLowerCase().includes("secret")
)) {
  console.error("🚨 PERINGATAN KEAMANAN FATAL: service_role key terdeteksi! Kunci ini tidak boleh digunakan di frontend.");
  alert("Peringatan Keamanan: Terdeteksi service_role key. Harap hanya gunakan anon / publishable key demi keamanan database Anda.");
  window.SUPABASE_ANON_KEY = "";
}

// Helper untuk memeriksa kesiapan konfigurasi
window.isSupabaseConfigured = function() {
  return window.SUPABASE_URL && 
         window.SUPABASE_ANON_KEY && 
         !window.SUPABASE_URL.includes("PASTE_") && 
         !window.SUPABASE_ANON_KEY.includes("PASTE_");
};

// Coba muat dari .env jika dijalankan melalui server lokal (fetch didukung)
(async function loadEnvIfLocal() {
  if (window.isSupabaseConfigured()) return;
  try {
    const envPath = window.location.pathname.includes('/admin/') ? '../.env' : '.env';
    const res = await fetch(envPath);
    if (res.ok) {
      const text = await res.text();
      const lines = text.split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...vals] = trimmed.split('=');
          const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
          if (key.trim() === 'SUPABASE_URL' && val && !val.includes('PASTE_')) {
            window.SUPABASE_URL = val;
            window.__ENV__.SUPABASE_URL = val;
          }
          if (key.trim() === 'SUPABASE_ANON_KEY' && val && !val.includes('PASTE_')) {
            window.SUPABASE_ANON_KEY = val;
            window.__ENV__.SUPABASE_ANON_KEY = val;
          }
        }
      });
    }
  } catch (e) {
    // Mode file:// atau fetch dibatasi browser
  }
})();
