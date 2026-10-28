import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar/Navbar'
import Footer from '../component/Footer/Footer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      {/* The navigation and the footer are screen furniture: a printed application sheet is the
          record, so both are hidden when the browser prints or saves to PDF. */}
      <div className="no-print">
        <Navbar />
      </div>
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}
