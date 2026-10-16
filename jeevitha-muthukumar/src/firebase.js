import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore, collection, doc, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, getDoc,
} from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isLiveConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

const app = isLiveConfigured ? (getApps().length ? getApp() : initializeApp(config)) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const wishesCollection = db ? collection(db, 'wishes') : null;

export function watchWishes(onChange, onError) {
  if (!isLiveConfigured) return () => {};
  return onSnapshot(query(wishesCollection, orderBy('createdAt', 'desc')), (snapshot) => {
    const rows = snapshot.docs.map((row) => ({ id: row.id, ...row.data() }));
    onChange(rows, snapshot.docChanges().map(change => ({
      type: change.type,
      pending: change.doc.metadata.hasPendingWrites,
      id: change.doc.id,
      data: change.doc.data(),
    })));
  }, onError);
}

export async function saveWish({ name, message, emoji }) {
  if (!isLiveConfigured) throw new Error('Live wishes are not configured');
  const credential = auth.currentUser ? { user: auth.currentUser } : await signInAnonymously(auth);
  const uid = credential.user.uid;
  const ref = doc(db, 'wishes', uid);
  const oldWish = await getDoc(ref);
  const input = { name: name.trim(), message: message.trim(), emoji, uid, updatedAt: serverTimestamp() };
  if (!oldWish.exists()) input.createdAt = serverTimestamp();
  await setDoc(ref, input, { merge: true });
  return uid;
}
