// Logika Login & Register Modal untuk Ada Teknik
const USERS_KEY = 'ada_teknik_users';
const SESSION_KEY = 'ada_teknik_session';

const $ = (sel, root = document) => root.querySelector(sel);

function toggleAuthModal(defaultTab = 'login') {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  const isHidden = overlay.classList.contains('hidden');
  if (isHidden) {
    overlay.classList.remove('hidden');
    showTab(defaultTab);
  } else {
    overlay.classList.add('hidden');
  }
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function saveSession(email, remember) {
  localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY);
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, email);
}
function getSession() { return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY); }
function clearSession() { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); }

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) throw new Error('Browser tidak mendukung enkripsi.');
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function randomSalt() {
  return [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
}

function showTab(name) {
  const forms = { login: $('#login-form'), register: $('#register-form') };
  for (const [key, form] of Object.entries(forms)) {
    if (form) {
      form.classList.toggle('hidden', key !== name);
      const tabBtn = $('#tab-' + key);
      if (tabBtn) tabBtn.setAttribute('aria-selected', String(key === name));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginTab = $('#tab-login');
  const registerTab = $('#tab-register');
  if (loginTab) loginTab.onclick = () => showTab('login');
  if (registerTab) registerTab.onclick = () => showTab('register');

  const logoutBtn = $('#logout');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      clearSession();
      $('#profile')?.classList.add('hidden');
      $('#auth')?.classList.remove('hidden');
      showTab('login');
    };
  }

  const sessionEmail = getSession();
  const current = sessionEmail && getUsers().find(u => u.email === sessionEmail);
  if (current && typeof showProfile === 'function') showProfile(current);
});