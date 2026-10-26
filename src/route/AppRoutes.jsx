import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../layout/PublicLayout'
import Home from '../page/Home'
import About from '../page/About'
import Academics from '../page/Academics'
import Teachers from '../page/Teachers'
import Notices from '../page/Notices'
import Contact from '../page/Contact'
import Admission from '../page/Admission'
import Legal from '../page/Legal'
import NotFound from '../page/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="notices" element={<Notices />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admission" element={<Admission />} />
        <Route path="privacy" element={<Legal page="privacy" />} />
        <Route path="terms" element={<Legal page="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
