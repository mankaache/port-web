import { getAuth } from 'firebase/auth'
import { firebaseApp } from '@/lib/firebase'

/**
 * Kept separate from firebase.ts so firebase/auth (and its persistence
 * layer) only ever loads as part of the lazy /dash bundle, never on the
 * public site.
 */
export const auth = firebaseApp ? getAuth(firebaseApp) : null
