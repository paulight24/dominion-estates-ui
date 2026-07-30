// Shared plumbing for the check-in admin screens: Firebase setup, the
// sign-in gate, and the header/nav that both pages render.
//
// Each page supplies its own markup inside #admin-view and calls
// startAdmin({ page, onReady }) — onReady only runs once an allow-listed
// admin is signed in.
import { initializeApp } from '../vendor/firebase/firebase-app.js';
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  setPersistence, browserLocalPersistence,
} from '../vendor/firebase/firebase-auth.js';
import { getFirestore } from '../vendor/firebase/firebase-firestore-lite.js';
import { FIREBASE_CONFIG } from '../checkin/firebase-config.js';

// Mirrors the allow-list in firestore.rules. This one only controls what
// the UI shows; the rules are what actually enforce access.
export const ADMIN_EMAILS = [
  'dominionestatesllc7@gmail.com',
  'ebabalola01@gmail.com',
];

export const GUIDE_BASE_URL = 'https://dominionestatesrentals.com/checkin/';

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const $ = (id) => document.getElementById(id);

export function showError(el, message) {
  el.textContent = message;
  el.classList.add('show');
}

export function friendlyError(e) {
  const code = e && e.code ? String(e.code) : '';
  if (code.includes('permission-denied')) {
    return 'Permission denied — check the Firestore rules are published and you are signed in as an admin.';
  }
  if (code.includes('unavailable') || code.includes('network')) {
    return "Couldn't reach the server — check your connection and try again.";
  }
  return (e && e.message) || 'Something went wrong. Please try again.';
}

export function fmtDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : ts;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// `page` is 'codes' or 'properties' — used to highlight the current tab.
export function startAdmin({ page, onReady }) {
  const loginView = $('login-view');
  const adminView = $('admin-view');

  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('login-err');
    const btn = $('login-btn');
    err.classList.remove('show');
    btn.disabled = true; btn.textContent = 'Signing in…';
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, $('email').value.trim(), $('password').value);
    } catch (e2) {
      showError(err, 'Sign-in failed — check your email and password.');
    }
    btn.disabled = false; btn.textContent = 'Sign in';
  });

  onAuthStateChanged(auth, async (user) => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      loginView.classList.add('hidden');
      adminView.classList.remove('hidden');
      $('who').textContent = user.email;
      $('logout-btn').addEventListener('click', () => signOut(auth), { once: true });
      renderNav(page);
      await onReady(user);
    } else {
      if (user) await signOut(auth); // signed in, but not an allow-listed admin
      adminView.classList.add('hidden');
      loginView.classList.remove('hidden');
    }
  });
}

// Each screen is either the /checkin-admin/ root ('codes') or a
// subdirectory of it — hrefs are relative to whichever page is current.
const PAGES = [
  { id: 'codes', label: '🔑 Guest Codes', dir: '' },
  { id: 'properties', label: '🏠 Properties', dir: 'properties/' },
  { id: 'reviews', label: '⭐ Reviews', dir: 'reviews/' },
];

function renderNav(page) {
  const nav = $('nav');
  if (!nav) return;
  const fromDir = PAGES.find((p) => p.id === page)?.dir || '';
  const upToRoot = fromDir ? '../' : './';
  nav.innerHTML = PAGES.map((p) => {
    const href = p.id === page ? '.' : (fromDir ? upToRoot + p.dir : p.dir || './');
    return `<a href="${href || './'}" class="${p.id === page ? 'active' : ''}">${p.label}</a>`;
  }).join('');
}
