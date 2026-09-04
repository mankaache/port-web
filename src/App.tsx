import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

const DashApp = lazy(() => import('@/pages/dash/DashApp'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))

const dashFallback = (
  <div className="flex min-h-screen items-center justify-center bg-void text-sm text-muted">
    Loading dashboard…
  </div>
)

const projectFallback = (
  <div className="flex min-h-[70svh] items-center justify-center text-sm text-muted">
    Loading project…
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={projectFallback}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/dash/*"
        element={
          <Suspense fallback={dashFallback}>
            <DashApp />
          </Suspense>
        }
      />
    </Routes>
  )
}
