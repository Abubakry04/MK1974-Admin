// ─── MK Brand API Client ───────────────────────────────────────────────────────
const DIRECT_BACKEND = 'https://mk-brand-api.onrender.com'
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

export function isTokenExpired(token) {
  if (!token || typeof token !== 'string') return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload && payload.exp) {
      return payload.exp < Math.floor(Date.now() / 1000)
    }
  } catch {}
  return false
}

function handleSessionExpiration() {
  setToken(null)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth_session_expired'))
  }
}

function safeParseJson(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  if (trimmed.startsWith('<')) return null
  try {
    return JSON.parse(trimmed)
  } catch {
    return null
  }
}

function enforceAuth(isPublicRequest) {
  if (isPublicRequest) return

  if (!_token) {
    throw new Error('Authentication required. Please sign in.')
  }

  if (isTokenExpired(_token)) {
    handleSessionExpiration()
    throw new Error('Your session has expired. Please sign in again.')
  }
}

async function request(method, path, body, isPublic = false) {
  const isAuthPath = path.toLowerCase().includes('/auth/')
  const isPublicRequest = isPublic || isAuthPath

  enforceAuth(isPublicRequest)

  const headers = { 'Content-Type': 'application/json' }
  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`
  }

  const primaryUrl = BASE_URL ? `${BASE_URL}${path}` : path
  let res
  try {
    res = await fetch(primaryUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (!primaryUrl.startsWith('http')) {
      try {
        res = await fetch(`${DIRECT_BACKEND}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        })
      } catch (err2) {
        throw new Error('Network error: Unable to connect to server. ' + err2.message)
      }
    } else {
      throw new Error('Network error: Unable to connect to server. ' + err.message)
    }
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const text = await res.text()
      if (text) {
        const d = safeParseJson(text)
        if (d) {
          msg = d.message || d.title || d.error || (Array.isArray(d.errors) ? d.errors.join(', ') : msg)
        } else if (!text.trim().startsWith('<')) {
          msg = text
        }
      }
    } catch {}

    if (res.status === 401) {
      if (isAuthPath) {
        throw new Error(msg && !msg.startsWith('HTTP') ? msg : 'Invalid email or password. Please check your credentials.')
      } else {
        handleSessionExpiration()
        throw new Error('Your session has expired. Please sign in again.')
      }
    }

    throw new Error(msg)
  }

  const text = await res.text()
  return safeParseJson(text)
}

// For multipart/form-data — browser sets the correct Content-Type + boundary automatically
async function requestFormData(method, path, formData) {
  enforceAuth(false)

  const headers = {}
  headers['Authorization'] = `Bearer ${_token}`

  const fullUrl = `${BASE_URL}${path}`
  console.log(`[requestFormData] ${method} ${fullUrl}`)
  for (const [key, val] of formData.entries()) {
    console.log(`  field: ${key} =`, val instanceof File ? `File(${val.name}, ${val.size}b, ${val.type})` : val)
  }

  let res;
  try {
    res = await fetch(fullUrl, { method, headers, body: formData })
  } catch (err) {
    throw new Error('Network error: ' + err.message)
  }

  if (!res.ok) {
    if (res.status === 401) {
      handleSessionExpiration()
      throw new Error('Your session has expired. Please sign in again.')
    }
    let rawBody = ''
    try { rawBody = await res.text() } catch {}
    let msg = `HTTP ${res.status}`
    if (rawBody) {
      const d = safeParseJson(rawBody)
      if (d) {
        msg = d.message || d.title || d.error || JSON.stringify(d)
      } else if (!rawBody.trim().startsWith('<')) {
        msg = rawBody
      }
    }
    console.error(`[requestFormData] ${res.status} error from ${fullUrl}:`, rawBody)
    throw new Error(msg)
  }

  const text = await res.text()
  return safeParseJson(text)
}

// For sending a raw JSON primitive (e.g. a bare enum string) as the request body
// PUT /api/Order/{id}/status expects body: "Processing" (not {"status":"Processing"})
async function requestRaw(method, path, rawValue) {
  enforceAuth(false)

  const headers = { 'Content-Type': 'application/json' }
  headers['Authorization'] = `Bearer ${_token}`

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: JSON.stringify(rawValue),  // serialises a string to "Processing", number to 1, etc.
    })
  } catch (err) {
    throw new Error('Network error: Unable to connect to server. ' + err.message)
  }

  if (!res.ok) {
    if (res.status === 401) {
      handleSessionExpiration()
      throw new Error('Your session has expired. Please sign in again.')
    }
    let msg = `HTTP ${res.status}`
    try {
      const text = await res.text()
      if (text) {
        const d = safeParseJson(text)
        if (d) msg = d.message || d.title || d.error || (Array.isArray(d.errors) ? d.errors.join(', ') : msg)
        else if (!text.trim().startsWith('<')) msg = text
      }
    } catch {}
    throw new Error(msg)
  }

  const text = await res.text()
  return safeParseJson(text)
}


// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login:    (body) => request('POST', '/api/Auth/login', body, true),
  register: (body) => request('POST', '/api/Auth/register', body, true),
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = {
  getAll:        (categoryId) => request('GET', `/api/Product${categoryId ? `?categoryId=${categoryId}` : ''}`, null, true),
  getOne:        (id)         => request('GET', `/api/Product/${id}`, null, true),
  create:        (body)       => request('POST', '/api/Product', body),
  update:        (id, body)   => request('PUT', `/api/Product/${id}`, body),
  remove:        (id)         => request('DELETE', `/api/Product/${id}`),
  // Upload images: accepts an array of File objects
  uploadImages:  (productId, files) => {
    const fd = new FormData()
    files.forEach(f => fd.append('Images', f))
    return requestFormData('POST', `/api/products/${productId}/images`, fd)
  },
  deleteImage:   (productId, imageId) => request('DELETE', `/api/products/${productId}/images/${imageId}`),
  setPrimaryImage: (productId, imageId) => request('PUT', `/api/products/${productId}/images/${imageId}/primary`),
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = {
  getAll: () => request('GET', '/api/Category', null, true),
  create: (body) => request('POST', '/api/Category', body),
  remove: (id)   => request('DELETE', `/api/Category/${id}`),
}

// ─── Colors ───────────────────────────────────────────────────────────────────
export const colors = {
  getAll: () => request('GET', '/api/Color', null, true),
  create: (body) => request('POST', '/api/Color', body),
  remove: (id)   => request('DELETE', `/api/Color/${id}`),
}

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const sizes = {
  getAll: () => request('GET', '/api/Size', null, true),
  create: (body) => request('POST', '/api/Size', body),
  remove: (id)   => request('DELETE', `/api/Size/${id}`),
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customers = {
  getAll: () => request('GET', '/api/User'),
  getOne: (id) => request('GET', `/api/User/${id}`),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
const ORDER_STATUS_MAP = {
  pending: 'PendingPayment',
  pendingpayment: 'PendingPayment',
  awaitingpayment: 'PendingPayment',
  paymentsubmitted: 'PaymentSubmitted',
  submitted: 'PaymentSubmitted',
  paid: 'Paid',
  paymentrejected: 'PaymentRejected',
  rejected: 'PaymentRejected',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export const orders = {
  getAll: () => request('GET', '/api/Order'),
  getOne: (id) => request('GET', `/api/Order/${id}`),
  updateStatus: (id, status) => {
    const key = String(status || '').trim().toLowerCase().replace(/[^a-z]/g, '')
    const validStatus = ORDER_STATUS_MAP[key] || 'PendingPayment'
    // Backend expects body as a raw JSON string enum, e.g. "Processing"
    return requestRaw('PUT', `/api/Order/${id}/status`, validStatus)
  },
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboard = {
  getSummary:      () => request('GET', '/api/admin/Dashboard/summary'),
  getOverview:     () => request('GET', '/api/admin/Dashboard/overview'),
  getTransactions: (params) => {
    const query = new URLSearchParams(params || {}).toString()
    return request('GET', `/api/admin/Dashboard/transactions${query ? `?${query}` : ''}`)
  },
}

// ─── Payments ──────────────────────────────────────────────────────────────────
export const payments = {
  getPending: () => request('GET', '/api/Payment/pending'),
  submit: (orderNumber, receiptFile) => {
    const fd = new FormData()
    if (orderNumber) fd.append('OrderNumber', orderNumber)
    if (receiptFile) fd.append('Receipt', receiptFile)
    return requestFormData('POST', '/api/Payment/submit', fd)
  },
  // paymentId must be a numeric integer matching GET /api/Payment/pending
  review: (paymentId, decision, notes = '') => {
    const cleanId = String(paymentId ?? '').replace(/[^0-9]/g, '')
    const numericId = parseInt(cleanId, 10)
    const targetId = !isNaN(numericId) ? numericId : paymentId
    const validDecision = (typeof decision === 'string' && decision.toLowerCase().startsWith('appr')) ? 'Approved' : 'Rejected'
    return request('POST', `/api/Payment/${targetId}/review`, { decision: validDecision, notes: notes || '' })
  },
}
