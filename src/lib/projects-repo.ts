import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { sampleProjects, type Project } from '@/data/projects'

export type ProjectInput = Omit<Project, 'slug'>

const COLLECTION = 'projects'

/**
 * Subscribes to the live projects list. Falls back to the bundled sample
 * projects when Firebase hasn't been configured yet, so the site never
 * looks broken or empty before /dash has been set up.
 */
export function subscribeProjects(callback: (projects: Project[]) => void) {
  if (!isFirebaseConfigured || !db) {
    callback(sampleProjects)
    return () => {}
  }

  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((docSnap) => ({
        slug: docSnap.id,
        ...docSnap.data(),
      })) as Project[]
      callback(projects)
    },
    () => {
      callback(sampleProjects)
    },
  )
}

export async function createProject(slug: string, data: ProjectInput) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, COLLECTION, slug), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProject(slug: string, data: ProjectInput) {
  if (!db) throw new Error('Firebase is not configured.')
  await updateDoc(doc(db, COLLECTION, slug), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProject(slug: string) {
  if (!db) throw new Error('Firebase is not configured.')
  await deleteDoc(doc(db, COLLECTION, slug))
}
