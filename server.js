/**
 * WCC.BYFARIHA — Local Development Server & Vercel Handler
 * Menjalankan website & dashboard lokal serta memuat environment variables dari .env.local / .env
 * Menggunakan modul bawaan Node.js (tanpa dependensi eksternal).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = process.cwd();

// 1. Membaca Environment Variables dari .env lalu dioverride oleh .env.local
function loadEnv() {
  const env = {
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: ''
  };

  const isPlaceholder = (val) => !val || val.includes('PASTE_') || val.includes('your-project') || val.includes('your-anon');

  // Urutan: .env terlebih dahulu, kemudian .env.local menimpa .env
  const files = ['.env', '.env.local'];
  for (const f of files) {
    const p = path.join(ROOT_DIR, f);
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [k, ...v] = trimmed.split('=');
            const key = k.trim();
            const val = v.join('=').trim().replace(/^["']|["']$/g, '');
            if ((key === 'SUPABASE_URL' || key === 'NEXT_PUBLIC_SUPABASE_URL' || key === 'VITE_SUPABASE_URL')) {
              if (!isPlaceholder(val) || !env.SUPABASE_URL) {
                env.SUPABASE_URL = val;
              }
            }
            if ((key === 'SUPABASE_ANON_KEY' || key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' || key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' || key === 'VITE_SUPABASE_ANON_KEY')) {
              if (!isPlaceholder(val) || !env.SUPABASE_ANON_KEY) {
                env.SUPABASE_ANON_KEY = val;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Gagal membaca file ' + f + ':', e.message);
      }
    }
  }

  // Cek juga process.env
  if (process.env.SUPABASE_URL && !isPlaceholder(process.env.SUPABASE_URL)) {
    env.SUPABASE_URL = process.env.SUPABASE_URL;
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    env.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  if (process.env.SUPABASE_ANON_KEY && !isPlaceholder(process.env.SUPABASE_ANON_KEY)) {
    env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  } else if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
    env.SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }

  return env;
}

const env = loadEnv();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Parse URL
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Keamanan: Blokir akses langsung ke file konfigurasi atau repositori git
  const lowerPath = pathname.toLowerCase();
  if (lowerPath.includes('.env') || lowerPath.includes('.git') || lowerPath.endsWith('.sql')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: Akses ke file konfigurasi atau database dibatasi.');
    return;
  }

  // Endpoint khusus untuk melayani js/config.js dengan injeksi environment variables
  if (pathname.endsWith('/js/config.js') || pathname === '/js/config.js') {
    const configPath = path.join(ROOT_DIR, 'js', 'config.js');
    if (fs.existsSync(configPath)) {
      let content = fs.readFileSync(configPath, 'utf8');
      
      // Jika di .env.local terdapat nilai yang valid, injeksikan langsung ke window
      if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
        content = `// [Server Injected Config from .env.local]\n` +
          `window.SUPABASE_URL = ${JSON.stringify(env.SUPABASE_URL)};\n` +
          `window.SUPABASE_ANON_KEY = ${JSON.stringify(env.SUPABASE_ANON_KEY)};\n` +
          `window.NEXT_PUBLIC_SUPABASE_URL = ${JSON.stringify(env.SUPABASE_URL)};\n` +
          `window.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(env.SUPABASE_ANON_KEY)};\n\n` +
          content;
      }

      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
      return;
    }
  }

  // File request normal
  const safePath = path.normalize(path.join(ROOT_DIR, pathname));

  // Cegah directory traversal
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Jika tidak ditemukan, coba periksa apakah folder dan cari index.html
      const tryIndex = path.join(safePath, 'index.html');
      if (fs.existsSync(tryIndex)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(tryIndex).pipe(res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(safePath).pipe(res);
  });
});

if (require.main === module || !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log('================================================================');
    console.log('✦ WCC.BYFARIHA — Server Lokal Berjalan');
    console.log('================================================================');
    console.log(`🌐 Website Utama   : http://localhost:${PORT}/index.html`);
    console.log(`🔐 Login Pemilik   : http://localhost:${PORT}/admin/login.html`);
    console.log(`📊 Dashboard Admin : http://localhost:${PORT}/admin/index.html`);
    console.log('----------------------------------------------------------------');
    if (env.SUPABASE_URL && !env.SUPABASE_URL.includes('your-project') && !env.SUPABASE_URL.includes('PASTE_')) {
      console.log(`✅ Supabase URL     : ${env.SUPABASE_URL}`);
      console.log(`✅ Supabase Key     : Terkonfigurasi (${env.SUPABASE_ANON_KEY.substring(0, 16)}...)`);
    } else {
      console.log(`ℹ️  Supabase         : Menunggu pengisian kredensial di .env.local`);
    }
    console.log('================================================================');
  });
}

module.exports = server;

