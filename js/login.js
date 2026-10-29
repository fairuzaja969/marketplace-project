// ============================================================
// PERHATIAN: ini versi demo tanpa server. Data akun disimpan di
// localStorage browser, jadi TIDAK aman untuk marketplace sungguhan.
// Untuk produksi, pindahkan proses login/daftar ke backend.
// ============================================================

const USERS_KEY = 'pasarku_users';
const SESSION_KEY = 'pasarku_session';

const $ = (sel, root = document) => root.querySelector(sel);
const authEl = $('#auth');
const profileEl = $('#profile');
const banner = $('#banner');
const forms = { login: $('#login-form'), register: $('#register-form') };

/* ---------- Penyimpanan ---------- */
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function saveSession(email, remember) {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, email);
}
function getSession() {
  return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/* ---------- Hash kata sandi (SHA-256 + salt) ---------- */
async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error('Browser ini tidak mendukung enkripsi. Buka lewat localhost atau HTTPS.');
  }
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function randomSalt() {
  return [...crypto.getRandomValues(new Uint8Array(16))]
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- Validasi ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+62|62|0)8[0-9]{8,12}$/;

function validateRegister(d) {
  const errors = {};
  if (d.name.length < 2 || d.name.length > 60) errors.name = 'Nama harus 2–60 karakter.';
  if (!EMAIL_RE.test(d.email)) errors.email = 'Format email tidak valid.';
  if (d.phone && !PHONE_RE.test(d.phone)) errors.phone = 'Nomor HP tidak valid (contoh: 081234567890).';
  if (d.password.length < 8) errors.password = 'Kata sandi minimal 8 karakter.';
  else if (!/[A-Za-z]/.test(d.password) || !/[0-9]/.test(d.password))
    errors.password = 'Kata sandi harus mengandung huruf dan angka.';
  if (d.password !== d.password2) errors.password2 = 'Kata sandi tidak sama.';
  if (d.role === 'seller' && (d.store_name.length < 3 || d.store_name.length > 40))
    errors.store_name = 'Nama toko harus 3–40 karakter.';
  return errors;
}

/* ---------- Tampilan error ---------- */
function clearErrors() {
  banner.classList.add('hidden');
  document.querySelectorAll('.field').forEach(f => {
    f.classList.remove('invalid');
    const e = $('.err', f);
    if (e) e.textContent = '';
  });
}
function showFieldErrors(errors) {
  clearErrors();
  for (const [name, msg] of Object.entries(errors)) {
    const field = $(`#register-form [name="${name}"]`)?.closest('.field');
    if (!field) continue;
    field.classList.add('invalid');
    $('.err', field).textContent = msg;
  }
  $('#register-form .invalid input')?.focus();
}
function showBanner(message) {
  clearErrors();
  banner.textContent = message;
  banner.classList.remove('hidden');
}

/* ---------- Tab, lihat sandi, pilihan peran ---------- */
function showTab(name) {
  for (const [key, form] of Object.entries(forms)) {
    form.classList.toggle('hidden', key !== name);
    $('#tab-' + key).setAttribute('aria-selected', String(key === name));
  }
  clearErrors();
}
$('#tab-login').onclick = () => showTab('login');
$('#tab-register').onclick = () => showTab('register');

document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.onclick = () => {
    const input = document.getElementById(btn.dataset.toggle);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Sembunyikan' : 'Lihat';
  };
});

document.querySelectorAll('input[name="role"]').forEach(radio => {
  radio.onchange = () => {
    const isSeller = $('input[name="role"]:checked').value === 'seller';
    $('#store-field').classList.toggle('hidden', !isSeller);
  };
});

/* ---------- Daftar ---------- */
forms.register.onsubmit = async (e) => {
  e.preventDefault();
  const f = forms.register;
  const btn = $('.btn', f);
  const raw = new FormData(f);
  const role = raw.get('role') === 'seller' ? 'seller' : 'buyer';
  const data = {
    name: String(raw.get('name')).trim(),
    email: String(raw.get('email')).trim().toLowerCase(),
    phone: String(raw.get('phone')).replace(/[\s-]/g, ''),
    password: String(raw.get('password')),
    password2: String(raw.get('password2')),
    role,
    store_name: role === 'seller' ? String(raw.get('store_name')).trim() : '',
  };

  const errors = validateRegister(data);
  if (Object.keys(errors).length) return showFieldErrors(errors);

  const users = getUsers();
  if (users.some(u => u.email === data.email))
    return showFieldErrors({ email: 'Email sudah terdaftar. Silakan masuk.' });

  btn.disabled = true;
  try {
    const salt = randomSalt();
    const user = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      store_name: data.store_name || null,
      salt,
      passwordHash: await hashPassword(data.password, salt),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers(users);
    saveSession(user.email, true);
    f.reset();
    $('#store-field').classList.add('hidden');
    showProfile(user);
  } catch (err) {
    showBanner(err.message);
  } finally {
    btn.disabled = false;
  }
};

/* ---------- Masuk ---------- */
forms.login.onsubmit = async (e) => {
  e.preventDefault();
  const f = forms.login;
  const btn = $('.btn', f);
  const email = f.email.value.trim().toLowerCase();
  const password = f.password.value;

  if (!email || !password) return showBanner('Isi email dan kata sandi.');

  btn.disabled = true;
  try {
    const user = getUsers().find(u => u.email === email);
    const hash = user ? await hashPassword(password, user.salt) : null;
    // Pesan sama untuk email salah dan sandi salah
    if (!user || hash !== user.passwordHash)
      return showBanner('Email atau kata sandi salah.');

    saveSession(user.email, f.remember.checked);
    f.reset();
    showProfile(user);
  } catch (err) {
    showBanner(err.message);
  } finally {
    btn.disabled = false;
  }
};

/* ---------- Profil & keluar ---------- */
function showProfile(user) {
  clearErrors();
  authEl.classList.add('hidden');
  profileEl.classList.remove('hidden');
  $('#hello').textContent = `Halo, ${user.name}!`;

  const rows = [
    ['Email', user.email],
    ['Peran', user.role === 'seller' ? 'Penjual' : 'Pembeli'],
  ];
  if (user.store_name) rows.push(['Toko', user.store_name]);
  if (user.phone) rows.push(['Nomor HP', user.phone]);

  const dl = $('#info');
  dl.replaceChildren();
  for (const [label, value] of rows) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value; // textContent mencegah XSS
    dl.append(dt, dd);
  }
}

$('#logout').onclick = () => {
  clearSession();
  profileEl.classList.add('hidden');
  authEl.classList.remove('hidden');
  showTab('login');
};

/* ---------- Cek sesi saat halaman dibuka ---------- */
const sessionEmail = getSession();
const current = sessionEmail && getUsers().find(u => u.email === sessionEmail);
if (current) showProfile(current);
