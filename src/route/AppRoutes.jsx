import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../layout/PublicLayout'
import Home from '../page/Home'
import About from '../page/About'
import Academics from '../page/Academics'
import Teachers from '../page/Teachers'
import TeacherDetail from '../page/TeacherDetail'
import Notices from '../page/Notices'
import Contact from '../page/Contact'
import Admission from '../page/Admission'
import AdmissionApply from '../page/AdmissionApply'
import AdmissionConfirmation from '../page/AdmissionConfirmation'
import Login from '../page/Login'
import Register from '../page/Register'
import Legal from '../page/Legal'
import NotFound from '../page/NotFound'
import AdminHome from '../page/AdminHome'
import AdminPages from '../page/AdminPages'
import AdminPageEdit from '../page/AdminPageEdit'
import AdminCards from '../page/AdminCards'
import AdminTeachers from '../page/AdminTeachers'
import AdminNotices from '../page/AdminNotices'
import AdminMedia from '../page/AdminMedia'
import AdminApplications from '../page/AdminApplications'
import AdminLayout from '../layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import RequireAdmin from './RequireAdmin'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="teachers/:id" element={<TeacherDetail />} />
        <Route path="notices" element={<Notices />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admission" element={<Admission />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="privacy" element={<Legal page="privacy" />} />
        <Route path="terms" element={<Legal page="terms" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admission/apply" element={<AdmissionApply />} />
          <Route path="admission/application/:id" element={<AdmissionConfirmation />} />
        </Route>

        <Route path="admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="pages/:page" element={<AdminPageEdit />} />
            <Route path="cards" element={<AdminCards />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="applications" element={<AdminApplications />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
