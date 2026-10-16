// Demo wishes live only in this browser. For public guest wishes, deploy
// backend/Code.gs and configure VITE_WISHES_SCRIPT_URL in .env and Vercel.
export const WISHES_URL = (import.meta.env.VITE_WISHES_SCRIPT_URL || '').trim();
const STORAGE_KEY = 'jeevitha-valaikappu-demo-wishes-v1';

export const DEMO_WISHES = [
  { id: 'sample-a', name: 'லட்சுமி (மாதிரி)', message: 'தாயும் சேயும் நலமுடன் வாழ இனிய வளைகாப்பு நல்வாழ்த்துகள்! 🌸', createdAt: '2026-10-10T09:00:00+05:30' },
  { id: 'sample-b', name: 'கார்த்திக் (மாதிரி)', message: 'உங்கள் குடும்பத்தில் அன்பும் மகிழ்ச்சியும் என்றும் நிலைக்க வாழ்த்துகிறோம்! 💗', createdAt: '2026-10-11T12:00:00+05:30' },
  { id: 'sample-c', name: 'பிரியா (மாதிரி)', message: 'புதிய வரவை மகிழ்ச்சியுடன் வரவேற்கிறோம். தாயும் குழந்தையும் ஆரோக்கியமாக இருக்கட்டும்! 💐', createdAt: '2026-10-12T10:00:00+05:30' },
];

export function readDemoWishes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(w => w && typeof w.name === 'string' && typeof w.message === 'string').slice(0, 50) : [];
  } catch { return []; }
}
export function saveDemoWish(wish) {
  const next = [wish, ...readDemoWishes()].slice(0, 50);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* preview still works for this tab */ }
  return next;
}

let callbackSequence = 0;
export function loadOnlineWishes() {
  if (!WISHES_URL) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const callbackName = `__invitationWishesCallback${Date.now()}${++callbackSequence}`;
    const script = document.createElement('script');
    let settled = false;
    const cleanup = () => {
      clearTimeout(timeout);
      script.remove();
      try { delete window[callbackName]; } catch { window[callbackName] = undefined; }
    };
    const finish = (error, items) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve(items);
    };
    const timeout = window.setTimeout(() => finish(new Error('Wishes response timeout')), 15000);
    window[callbackName] = (payload) => {
      if (!payload || payload.ok !== true || !Array.isArray(payload.wishes)) {
        finish(new Error(payload?.error || 'Invalid response')); return;
      }
      finish(null, payload.wishes
        .filter(row => row && typeof row.name === 'string' && typeof row.message === 'string')
        .slice(0, 150));
    };
    script.onerror = () => finish(new Error('Wishes loading failed'));
    const url = new URL(WISHES_URL);
    url.searchParams.set('callback', callbackName);
    url.searchParams.set('_', String(Date.now()));
    script.src = url.toString();
    script.async = true;
    document.head.appendChild(script);
  });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export async function submitOnlineWish(wish) {
  if (!WISHES_URL) throw new Error('No online wishes backend');
  const body = new URLSearchParams({
    action: 'wish', id: wish.id, name: wish.name, message: wish.message,
    website: '', // Honeypot; the Apps Script rejects nonempty values.
  });
  // Apps Script redirects across origins. The no-cors opaque response is NOT
  // treated as proof of saving; a later read verifies that the wish exists.
  await fetch(WISHES_URL, { method: 'POST', mode: 'no-cors', body, redirect: 'follow' });
  for (let attempt = 0; attempt < 6; attempt++) {
    await delay(attempt === 0 ? 1200 : 1800);
    const items = await loadOnlineWishes().catch(() => null);
    if (items?.some(item => item.id === wish.id)) return items;
  }
  throw new Error('Wish was not verified in Google Sheets');
}
