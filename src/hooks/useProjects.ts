import { useEffect, useState } from 'react'
import { subscribeProjects } from '@/lib/projects-repo'
import type { Project } from '@/data/projects'

/** Live project list. Returns `null` while the initial data is loading. */
export function useProjects(): Project[] | null {
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    return subscribeProjects(setProjects)
  }, [])

  return projects
}
