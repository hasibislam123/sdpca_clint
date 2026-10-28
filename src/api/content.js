import { request } from './client'

// Public read: page wording, image slots, cards and published notices in one round trip.
export const apiPublicContent = () => request('/content')

// Everything below is admin-only; the API checks the role behind the session cookie, so a plain
// user calling these gets 403 no matter what their browser says about who they are.
export const apiAdminContent = () => request('/admin/content')
export const apiContentSchema = () => request('/admin/schema')

export const apiSavePage = (page, payload) => request(`/admin/pages/${page}`, { method: 'PUT', body: payload })

export const apiCreateCard = (card) => request('/admin/cards', { method: 'POST', body: card })
export const apiUpdateCard = (id, card) => request(`/admin/cards/${id}`, { method: 'PUT', body: card })
export const apiDeleteCard = (id) => request(`/admin/cards/${id}`, { method: 'DELETE' })

export const apiCreateNotice = (notice) => request('/admin/notices', { method: 'POST', body: notice })
export const apiUpdateNotice = (id, notice) => request(`/admin/notices/${id}`, { method: 'PUT', body: notice })
export const apiDeleteNotice = (id) => request(`/admin/notices/${id}`, { method: 'DELETE' })

export const apiCreateTeacher = (teacher) => request('/admin/teachers', { method: 'POST', body: teacher })
export const apiUpdateTeacher = (id, teacher) => request(`/admin/teachers/${id}`, { method: 'PUT', body: teacher })
export const apiDeleteTeacher = (id) => request(`/admin/teachers/${id}`, { method: 'DELETE' })

export const apiUploadMedia = (data, alt) => request('/admin/media', { method: 'POST', body: { data, alt } })
export const apiDeleteMedia = (id) => request(`/admin/media/${id}`, { method: 'DELETE' })
