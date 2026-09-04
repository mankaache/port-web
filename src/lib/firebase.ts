import { getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.projectId && config.appId,
)

/**
 * Only firebase/app + firebase/firestore are imported here, so the public
 * site's bundle never pulls in firebase/auth (that's reserved for the
 * lazy-loaded /dash bundle  see firebase-auth.ts).
 */
export const firebaseApp = isFirebaseConfigured ? (getApps()[0] ?? initializeApp(config)) : null

export const db = firebaseApp ? getFirestore(firebaseApp) : null
