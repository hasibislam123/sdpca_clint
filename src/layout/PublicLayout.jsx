import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar/Navbar'
import Footer from '../component/Footer/Footer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
