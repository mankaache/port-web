import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageBackdrop from '@/components/layout/PageBackdrop'
import CursorGlow from '@/components/layout/CursorGlow'

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      <PageBackdrop />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
