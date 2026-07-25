// ─── MK Brand API Client ───────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Store the JWT token in memory (backed by localStorage)
let _token = localStorage.getItem('mk1974_admin_token') || null

export function setToken(token) {
  _token = token
  if (token) localStorage.setItem('mk1974_admin_token', token)
  else localStorage.removeItem('mk1974_admin_token')
}

export function getToken() {
  return _token
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new Error('Network error: Unable to connect to server. ' + err.message)
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const text = await res.text()
      if (text) {
        try {
          const d = JSON.parse(text)
          msg = d.message || d.title || d.error || (Array.isArray(d.errors) ? d.errors.join(', ') : msg)
        } catch {
          msg = text
        }
      }
    } catch {}
    throw new Error(msg)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login:    (body) => request('POST', '/api/Auth/login', body),
  register: (body) => request('POST', '/api/Auth/register', body),
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = {
  getAll:   (categoryId) => request('GET', `/api/Product${categoryId ? `?categoryId=${categoryId}` : ''}`),
  getOne:   (id)         => request('GET', `/api/Product/${id}`),
  create:   (body)       => request('POST', '/api/Product', body),
  update:   (id, body)   => request('PUT', `/api/Product/${id}`, body),
  remove:   (id)         => request('DELETE', `/api/Product/${id}`),
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = {
  getAll: () => request('GET', '/api/Category'),
  create: (body) => request('POST', '/api/Category', body),
  remove: (id)   => request('DELETE', `/api/Category/${id}`),
}

// ─── Colors ───────────────────────────────────────────────────────────────────
export const colors = {
  getAll: () => request('GET', '/api/Color'),
  create: (body) => request('POST', '/api/Color', body),
  remove: (id)   => request('DELETE', `/api/Color/${id}`),
}

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const sizes = {
  getAll: () => request('GET', '/api/Size'),
  create: (body) => request('POST', '/api/Size', body),
  remove: (id)   => request('DELETE', `/api/Size/${id}`),
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customers = {
  getAll: () => request('GET', '/api/User'),
  getOne: (id) => request('GET', `/api/User/${id}`),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = {
  getAll: () => request('GET', '/api/Order'),
  getOne: (id) => request('GET', `/api/Order/${id}`),
  updateStatus: (id, status) => request('PUT', `/api/Order/${id}/status`, status),
}
