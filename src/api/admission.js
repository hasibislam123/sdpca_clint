import { request } from './client'

// Everything here needs the session cookie: the API works out whose account is asking and refuses
// anyone else, so a guessed application id in the URL never becomes another family's details.
export const apiSubmitApplication = (application) =>
  request('/admission/applications', { method: 'POST', body: application })

export const apiApplication = (id) => request(`/admission/applications/${encodeURIComponent(id)}`)

export const apiMyApplications = () => request('/admission/applications/mine')

// Admin-only: the API re-reads the role from the database behind the cookie, so a plain user calling
// these gets 401/403 however their browser describes them.
export const apiAdminApplications = ({ status = '', search = '' } = {}) =>
  request(`/admin/applications?${new URLSearchParams({ status, search })}`)

export const apiSetApplicationStatus = (id, status) =>
  request(`/admin/applications/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status } })

export const apiDeleteApplication = (id) => request(`/admin/applications/${encodeURIComponent(id)}`, { method: 'DELETE' })
