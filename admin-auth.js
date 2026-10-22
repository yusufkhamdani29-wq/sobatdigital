/* =====================================================================
   SOBAT DIGITAL — Gerbang Login Dashboard Admin (file TERPISAH)
   Hash password + kunci 5x gagal (60 detik) + kait peringatan keamanan.
   ===================================================================== */
/* ===== SOBAT DIGITAL — Kunci Login Dashboard Admin (khusus admin) ===== */
(function () {
  var DEFAULT_HASH = 'f4eac65c7407bdd65e351d3e9b73dd38b40864454a94bd060368b3adcddda51c';
  var sha256=function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;64>n;p++)if(!o[p]){for(d=0;313>d;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;64>d;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=16>d?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;8>d;d++)l[d]=l[d]+r[d]|0}for(d=0;8>d;d++)for(e=3;e+1;e--){var y=l[d]>>8*e&255;i+=(16>y?0:"")+y.toString(16)}return i}
  function getHash(){ try { return localStorage.getItem('sd_admin_hash_v1') || DEFAULT_HASH; } catch (e) { return DEFAULT_HASH; } }
  window.__sdAdminAuthed = function () { try { return sessionStorage.getItem('sd_admin_auth_v1') === '1'; } catch (e) { return false; } };
  function lockInfo(){ try { return JSON.parse(localStorage.getItem('sd_admin_attempts_v1') || '{"n":0,"until":0}'); } catch (e) { return { n: 0, until: 0 }; } }
  function setLock(o){ try { localStorage.setItem('sd_admin_attempts_v1', JSON.stringify(o)); } catch (e) {} }
  var modal = null, errEl = null, userEl = null, passEl = null;
  function buildModal() {
    modal = document.createElement('div');
    modal.id = 'sdAdminLoginModal';
    modal.setAttribute('style', 'position:fixed;inset:0;z-index:99999;background:rgba(8,15,35,.72);display:none;align-items:center;justify-content:center;padding:16px;');
    modal.innerHTML =
      '<form id="sdAdminLoginForm" style="background:#0F2044;color:#E8EEF9;border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:26px 24px;max-width:360px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.45);font-family:inherit;">' +
      '<div style="font-size:2rem;text-align:center;">🔐</div>' +
      '<h3 style="margin:8px 0 4px;text-align:center;font-size:1.15rem;">Login Dashboard Admin</h3>' +
      '<p style="margin:0 0 16px;text-align:center;font-size:.82rem;color:#9FB3D9;">Area khusus admin SOBAT DIGITAL. Pembeli tidak memerlukan login ini.</p>' +
      '<label style="display:block;font-size:.8rem;margin-bottom:6px;color:#C7D5F2;">Username</label>' +
      '<input id="sdAdminUser" type="text" autocomplete="username" placeholder="admin" style="width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:#0B1830;color:#fff;margin-bottom:12px;">' +
      '<label style="display:block;font-size:.8rem;margin-bottom:6px;color:#C7D5F2;">Password</label>' +
      '<input id="sdAdminPass" type="password" autocomplete="current-password" placeholder="••••••••" style="width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:#0B1830;color:#fff;">' +
      '<div id="sdAdminErr" style="display:none;margin-top:12px;font-size:.82rem;color:#FF9C9C;background:rgba(255,60,60,.12);border:1px solid rgba(255,60,60,.35);padding:9px 11px;border-radius:10px;"></div>' +
      '<button type="submit" style="width:100%;margin-top:16px;padding:12px;border:none;border-radius:10px;background:#FF7A00;color:#fff;font-weight:800;cursor:pointer;">MASUK DASHBOARD</button>' +
      '<button type="button" id="sdAdminCancel" style="width:100%;margin-top:9px;padding:11px;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:transparent;color:#C7D5F2;cursor:pointer;">Batal</button>' +
      '</form>';
    document.body.appendChild(modal);
    errEl = modal.querySelector('#sdAdminErr');
    userEl = modal.querySelector('#sdAdminUser');
    passEl = modal.querySelector('#sdAdminPass');
    modal.querySelector('#sdAdminCancel').addEventListener('click', hideLogin);
    modal.addEventListener('click', function (e) { if (e.target === modal) hideLogin(); });
    modal.querySelector('#sdAdminLoginForm').addEventListener('submit', onSubmit);
  }
  function showErr(msg) { if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; } }
  function hideLogin() { if (modal) modal.style.display = 'none'; }
  window.__sdShowAdminLogin = function () {
    if (!modal) buildModal();
    if (errEl) errEl.style.display = 'none';
    if (passEl) passEl.value = '';
    modal.style.display = 'flex';
    setTimeout(function () { if (userEl) userEl.focus(); }, 60);
  };
  function onSubmit(e) {
    e.preventDefault();
    var now = Date.now(), lk = lockInfo();
    if (lk.until && now < lk.until) { showErr('Terlalu banyak percobaan gagal. Coba lagi dalam ' + Math.ceil((lk.until - now) / 1000) + ' detik.'); return; }
    var u = (userEl.value || '').trim().toLowerCase();
    var p = passEl.value || '';
    if (sha256(u + ':' + p) === getHash()) {
      setLock({ n: 0, until: 0 });
      try { sessionStorage.setItem('sd_admin_auth_v1', '1'); } catch (err) {}
      hideLogin();
      var b = document.getElementById('modeBtnAdmin'); if (b) b.click();
    } else {
      lk.n = (lk.n || 0) + 1;
      if (lk.n >= 5) { lk.until = now + 60000; lk.n = 0; showErr('5x percobaan gagal. Login dikunci 60 detik.'); }
      else { showErr('Username atau password salah. Sisa percobaan: ' + (5 - lk.n) + '.'); }
      setLock(lk);
      if (window.sdSecurityAlert) {
        if (lk.until && Date.now() < lk.until) {
          window.sdSecurityAlert('PERCOBAAN LOGIN ADMIN DIBLOKIR', '5x percobaan login Dashboard Admin gagal — login dikunci 60 detik. Bila ini bukan kamu, segera ganti password admin & periksa keamanan akun.');
        } else if (lk.n === 3) {
          window.sdSecurityAlert('PERCOBAAN LOGIN ADMIN GAGAL 3X', 'Ada 3x percobaan login Dashboard Admin yang gagal. Bila ini bukan kamu, waspadai upaya pembobolan.');
        }
      }
    }
  }
  /* Toolbar admin: ganti password & keluar (muncul hanya saat dashboard admin aktif) */
  var toolbar = null;
  function buildToolbar() {
    toolbar = document.createElement('div');
    toolbar.setAttribute('style', 'position:fixed;right:14px;bottom:14px;z-index:99998;display:none;gap:8px;');
    toolbar.innerHTML =
      '<button type="button" id="sdAdminChPass" style="padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:#0F2044;color:#E8EEF9;font-weight:700;cursor:pointer;box-shadow:0 10px 24px rgba(0,0,0,.35);">🔑 Ganti Password</button>' +
      '<button type="button" id="sdAdminLogout" style="padding:10px 14px;border-radius:999px;border:none;background:#D93636;color:#fff;font-weight:800;cursor:pointer;box-shadow:0 10px 24px rgba(0,0,0,.35);">Keluar Admin</button>';
    document.body.appendChild(toolbar);
    toolbar.querySelector('#sdAdminLogout').addEventListener('click', function () {
      try { sessionStorage.removeItem('sd_admin_auth_v1'); } catch (e) {}
      var b = document.getElementById('modeBtnStore'); if (b) b.click();
      alert('Kamu sudah keluar dari Dashboard Admin.');
    });
    toolbar.querySelector('#sdAdminChPass').addEventListener('click', function () {
      var old = prompt('Masukkan password admin saat ini:'); if (old === null) return;
      if (sha256('admin:' + old) !== getHash()) { alert('Password saat ini salah.'); return; }
      var nw = prompt('Masukkan password admin baru (minimal 8 karakter):'); if (nw === null) return;
      if (nw.length < 8) { alert('Password baru terlalu pendek (minimal 8 karakter).'); return; }
      try { localStorage.setItem('sd_admin_hash_v1', sha256('admin:' + nw)); alert('Password admin berhasil diganti untuk browser ini.'); }
      catch (e) { alert('Gagal menyimpan password baru.'); }
    });
  }
  setInterval(function () {
    var av = document.getElementById('adminDashboardView');
    var show = window.__sdAdminAuthed() && av && av.style.display !== 'none';
    if (show && !toolbar) buildToolbar();
    if (toolbar) toolbar.style.display = show ? 'flex' : 'none';
  }, 800);
})();
