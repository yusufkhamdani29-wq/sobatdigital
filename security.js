/* =====================================================================
   SOBAT DIGITAL — Modul Keamanan (file TERPISAH dari desain)
   1) Penjaga integritas QRIS: NMID + sidik SHA-256 payload resmi.
      Bila QRIS berubah/diganti -> pembayaran diblokir + peringatan.
   2) Pengirim peringatan keamanan ke Telegram admin via CallMeBot
      (gratis; hanya bisa mengirim ke akun Telegram admin yang sudah
      diotorisasi, jadi aman ditanam di file ini). Selama username
      Telegram kosong: peringatan tampil sebagai banner + tombol WA.
   ===================================================================== */
window.SD_ALERT_CONFIG = {
  adminWa: '6281411113564',
  telegramUser: '@Yassop299'
};
window.SD_QRIS_GUARD = {
  nmid: 'ID1026572814253',
  payloadSha256: '46eb081bd5d41f6683b742964086d255b61a936baea026075de9ecbdaf0b3e7c'
};
window.SD_QRIS_TAMPERED = false;

window.sdSecurityAlert = function (title, details) {
  var cfg = window.SD_ALERT_CONFIG || {};
  var lines = [
    '🚨 PERINGATAN KEAMANAN SOBAT DIGITAL',
    title || 'Insiden keamanan',
    details || '',
    'Waktu: ' + new Date().toLocaleString('id-ID'),
    'Halaman: ' + location.href
  ];
  var msg = lines.filter(Boolean).join('\n');
  try { console.warn('[SD-SECURITY]', msg); } catch (e) {}
  if (cfg.telegramUser) {
    try {
      var url = 'https://api.callmebot.com/text.php?user=' + encodeURIComponent(cfg.telegramUser) +
        '&text=' + encodeURIComponent(msg);
      fetch(url, { mode: 'no-cors' }).catch(function () {});
    } catch (e) {}
  }
  window.__sdLastSecurityIncident = { title: title, details: details, at: Date.now(), message: msg };
  sdShowSecurityBanner(title, details, msg);
};

function sdShowSecurityBanner(title, details, msg) {
  function render() {
    if (document.getElementById('sdSecurityBanner')) return;
    var cfg = window.SD_ALERT_CONFIG || {};
    var bar = document.createElement('div');
    bar.id = 'sdSecurityBanner';
    bar.setAttribute('style', 'position:fixed;left:0;right:0;top:0;z-index:100000;background:#B91C1C;color:#fff;padding:10px 14px;font-size:13px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.35);');
    var wa = 'https://wa.me/' + (cfg.adminWa || '6281411113564') + '?text=' + encodeURIComponent(msg || (title + ' — ' + (details || '')));
    bar.innerHTML = '<strong>🚨 ' + title + '</strong><span>' + (details || '') + '</span>' +
      '<a href="' + wa + '" target="_blank" rel="noopener noreferrer" style="background:#fff;color:#B91C1C;font-weight:800;padding:6px 12px;border-radius:999px;text-decoration:none;">Kirim Peringatan ke WA Admin</a>' +
      '<button type="button" id="sdSecurityBannerClose" style="background:transparent;border:1px solid rgba(255,255,255,.6);color:#fff;border-radius:999px;padding:5px 11px;cursor:pointer;">Tutup</button>';
    document.body.appendChild(bar);
    document.getElementById('sdSecurityBannerClose').addEventListener('click', function () { bar.remove(); });
  }
  if (document.body) render(); else document.addEventListener('DOMContentLoaded', render);
}

function sdSha256Hex(text) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  });
}

window.sdVerifyQrisIntegrity = function (payload, sourceLabel) {
  if (!payload) return;
  var guard = window.SD_QRIS_GUARD;
  var fail = function (reason) {
    if (window.SD_QRIS_TAMPERED) return;
    window.SD_QRIS_TAMPERED = true;
    window.sdSecurityAlert('QRIS TIDAK LOLOS PEMERIKSAAN KEAMANAN',
      'Kode QRIS (' + sourceLabel + ') ' + reason + '. Pembayaran QRIS diblokir otomatis. Segera periksa file website & akun GitHub/Hostinger.');
  };
  if (String(payload).indexOf(guard.nmid) === -1) { fail('tidak memuat NMID resmi ' + guard.nmid); return; }
  if (window.crypto && crypto.subtle) {
    sdSha256Hex(String(payload)).then(function (hex) {
      if (hex !== guard.payloadSha256) fail('sidik digitalnya berbeda dari QRIS resmi yang terdaftar');
    }).catch(function () {});
  }
};

document.addEventListener('DOMContentLoaded', function () {
  try {
    if (window.SD_QRIS_CONFIG) window.sdVerifyQrisIntegrity(window.SD_QRIS_CONFIG.qrisPayload, 'file konfigurasi');
    var raw = localStorage.getItem('sobat_digital_settings_v2');
    if (raw) {
      var st = JSON.parse(raw);
      if (st && st.qrisPayload) window.sdVerifyQrisIntegrity(st.qrisPayload, 'pengaturan tersimpan');
    }
  } catch (e) {}
});
