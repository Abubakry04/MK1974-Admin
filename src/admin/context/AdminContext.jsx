import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as api from '../api/apiClient'

// ─── Admin Context ─────────────────────────────────────────────────────────────
export const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminProvider({ children }) {
  // ── Admin auth ──
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_admin') || 'null') } catch { return null }
  })

  // ── UI state ──
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // ── Live API data ──
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  // ── Live arrays only — NO dummy/mock fallback data ──
  const [orders, setOrders] = useState(() => {
    try {
      const localOrders = JSON.parse(localStorage.getItem('mk1974_orders') || '[]')
      return localOrders.map(o => ({
        id: o.id,
        customer: `${o.firstName || ''} ${o.lastName || ''}`.trim() || 'Customer',
        email: o.email || 'N/A',
        items: o.items ? o.items.reduce((sum, item) => sum + (item.qty || 1), 0) : 1,
        total: o.total || 0,
        status: o.status || 'pendingpayment',
        date: o.createdAt ? o.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        country: o.country || 'Nigeria'
      }))
    } catch {
      return []
    }
  })
  const [customers, setCustomers] = useState([])
  const [reviews, setReviews] = useState([])
  const [staff] = useState([])
  const [discounts, setDiscounts] = useState([])

  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [dashboardOverview, setDashboardOverview] = useState(null)
  const [pendingPayments, setPendingPayments] = useState([])

  const fetchAllApiData = useCallback(async () => {
    setApiLoading(true)
    setApiError(null)
    try {
      const [prods, cats, cols, szs, custs, ords, dashSummary, dashOverview, pendingPays] = await Promise.all([
        api.products.getAll().catch(err => { console.error("Failed to fetch products from API", err); return []; }),
        api.categories.getAll().catch(err => { console.error("Failed to fetch categories from API", err); return []; }),
        api.colors.getAll().catch(err => { console.error("Failed to fetch colors from API", err); return []; }),
        api.sizes.getAll().catch(err => { console.error("Failed to fetch sizes from API", err); return []; }),
        api.customers.getAll().catch(err => { console.error("Failed to fetch customers from API", err); return []; }),
        api.orders.getAll().catch(err => { console.error("Failed to fetch orders from API", err); return []; }),
        api.dashboard.getSummary().catch(err => { console.error("Failed to fetch dashboard summary from API", err); return null; }),
        api.dashboard.getOverview().catch(err => { console.error("Failed to fetch dashboard overview from API", err); return null; }),
        api.payments.getPending().catch(err => { console.error("Failed to fetch pending payments from API", err); return []; }),
      ])
      
      function extractArray(res) {
        if (!res) return []
        if (Array.isArray(res)) return res
        if (Array.isArray(res.data?.results)) return res.data.results
        if (Array.isArray(res.data?.items)) return res.data.items
        if (Array.isArray(res.data?.$values)) return res.data.$values
        if (Array.isArray(res.data)) return res.data
        if (Array.isArray(res.results)) return res.results
        if (Array.isArray(res.items)) return res.items
        if (Array.isArray(res.$values)) return res.$values
        return []
      }

      const parsedCusts = extractArray(custs)
      const parsedOrds = extractArray(ords)
      const parsedProds = extractArray(prods)
      const parsedCats = extractArray(cats)
      const parsedCols = extractArray(cols)
      const parsedSzs = extractArray(szs)
      const parsedPays = extractArray(pendingPays)
      
      setPendingPayments(parsedPays)
      
      setCustomers(parsedCusts.map(c => ({
        ...c,
        id: c.userId ?? c.id,
        firstName: c.firstName || '',
        lastName: c.lastName || '',
        phoneNumber: c.phoneNumber || 'N/A',
        name: c.firstName ? `${c.firstName} ${c.lastName || ''}`.trim() : (c.name || c.email?.split('@')[0] || 'Unknown'),
        email: c.email || 'No email',
        orders: c.orders || 0,
        totalSpent: c.totalSpent || 0,
        joined: c.createdAt ? c.createdAt.split('T')[0] : 'Recently',
        status: c.status || (c.role === 'Admin' || c.role === 1 || String(c.role).toLowerCase() === 'admin' ? 'vip' : 'active'),
        role: c.role ?? 'Customer'
      })))
      
      if (parsedOrds.length > 0) {
        const mappedOrds = parsedOrds.map(o => {
          const rawDate = o.orderDate || o.submittedAt || o.paidAt || (o.createdAt && !o.createdAt.startsWith('0001') ? o.createdAt : null) || o.date
          let displayDate = new Date().toISOString().split('T')[0]
          if (rawDate && !String(rawDate).startsWith('0001')) {
            try {
              const d = new Date(rawDate)
              if (!isNaN(d.getTime())) {
                displayDate = d.toISOString().split('T')[0]
              } else {
                displayDate = String(rawDate).split('T')[0]
              }
            } catch {
              displayDate = String(rawDate).split('T')[0]
            }
          }

          return {
            ...o,
            id: String(o.orderId ?? o.id ?? `ORD-${Math.floor(Math.random()*10000)}`),
            customer: o.customerName || (o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() : 'Unknown'),
            email: o.email || o.customerEmail || o.user?.email || 'N/A',
            items: Array.isArray(o.items) ? o.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : (o.totalItems || 1),
            total: o.totalAmount ?? o.total ?? 0,
            status: o.status ? String(o.status).toLowerCase() : 'processing',
            date: displayDate,
            rawDate: rawDate || new Date().toISOString(),
            country: o.country || o.shippingAddress?.country || 'N/A'
          }
        })

        mappedOrds.sort((a, b) => {
          const timeA = new Date(a.rawDate).getTime() || 0
          const timeB = new Date(b.rawDate).getTime() || 0
          if (timeB !== timeA) return timeB - timeA
          return Number(b.id || 0) - Number(a.id || 0)
        })

        setOrders(mappedOrds)
      }

      if (parsedProds.length > 0) {
        setProducts(parsedProds.map(p => ({
          ...p,
          id: p.productId ?? p.id,
          categories: (p.categories || []).map(c => {
            if (typeof c === 'string') return { id: c, name: c };
            return { ...c, id: c.categoryId ?? c.id };
          })
        })))
      }

      if (parsedCats.length > 0) {
        setCategories(parsedCats.map(c => ({
          ...c,
          id: c.categoryId ?? c.id
        })))
      }

      if (parsedCols.length > 0) {
        setColors(parsedCols.map(c => ({
          ...c,
          id: c.colorId ?? c.id
        })))
      }

      if (parsedSzs.length > 0) {
        setSizes(parsedSzs.map(s => ({
          ...s,
          id: s.sizeId ?? s.id
        })))
      }

      if (dashSummary) setDashboardSummary(dashSummary)
      if (dashOverview) setDashboardOverview(dashOverview)
    } catch (err) {
      setApiError(err.message || 'Failed to fetch API data.')
    } finally {
      setApiLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllApiData()
  }, [fetchAllApiData])

  // ── Auth helpers ──
  const adminLogin = useCallback(async (credentials) => {
    try {
      const data = await api.auth.login({
        email: credentials.email,
        password: credentials.password,
      })
      const token = typeof data === 'string' ? data : (data?.token || data?.accessToken || data?.jwt)
      if (token) api.setToken(token)

      const adminData = {
        email: credentials.email,
        name: data?.firstName ? `${data.firstName} ${data.lastName}` : (data?.name || credentials.email.split('@')[0]),
        role: data?.role || 'Admin',
        avatar: (data?.firstName?.[0] || credentials.email[0]).toUpperCase(),
        token,
        rawResponse: data,
      }
      setAdminUser(adminData)
      localStorage.setItem('mk1974_admin', JSON.stringify(adminData))
      fetchAllApiData()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Check your credentials.' }
    }
  }, [fetchAllApiData])

  const adminLogout = useCallback(() => {
    setAdminUser(null)
    api.setToken(null)
    localStorage.removeItem('mk1974_admin')
    localStorage.removeItem('mk1974_admin_token')
    setProducts([])
    setCategories([])
    setColors([])
    setSizes([])
    setActiveSection('dashboard')
  }, [])

  // Auto-logout when session expires or backend returns HTTP 401
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('[AdminContext] Session expired — logging out admin automatically.')
      adminLogout()
    }
    window.addEventListener('auth_session_expired', handleSessionExpired)
    return () => window.removeEventListener('auth_session_expired', handleSessionExpired)
  }, [adminLogout])

  // ─── Product CRUD ─────────────────────────────────────────────────────
  const createProduct = useCallback(async (body, imageFiles) => {
    const data = await api.products.create(body)
    const unwrap = (v) => v?.data ?? v
    const raw = unwrap(data)
    const productId = raw?.productId ?? raw?.id ?? raw?.product?.productId ?? raw?.product?.id ?? (typeof raw === 'number' ? raw : undefined)

    if (productId && imageFiles && imageFiles.length > 0) {
      try {
        await api.products.uploadImages(productId, imageFiles)
      } catch (err) {
        console.error('[Image Upload] Failed:', err.message)
      }
    }
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const updateProduct = useCallback(async (id, body) => {
    const data = await api.products.update(id, body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteProduct = useCallback(async (id) => {
    await api.products.remove(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  // ─── Category CRUD ────────────────────────────────────────────────────────
  const createCategory = useCallback(async (body) => {
    const data = await api.categories.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteCategory = useCallback(async (id) => {
    await api.categories.remove(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  // ─── Color CRUD ───────────────────────────────────────────────────────────
  const createColor = useCallback(async (body) => {
    const data = await api.colors.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteColor = useCallback(async (id) => {
    await api.colors.remove(id)
    setColors(prev => prev.filter(c => c.id !== id))
  }, [])

  // ─── Size CRUD ────────────────────────────────────────────────────────────
  const createSize = useCallback(async (body) => {
    const data = await api.sizes.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteSize = useCallback(async (id) => {
    await api.sizes.remove(id)
    setSizes(prev => prev.filter(s => s.id !== id))
  }, [])

  // ─── Order / Review / Discount helpers ─────────────────────────────
  const updateOrderStatus = useCallback(async (orderId, status) => {
    const norm = String(status || '').trim().toLowerCase().replace(/[^a-z]/g, '')
    const orderIdStr = String(orderId).toLowerCase()

    try {
      // Order status updates handle fulfillment stages (Processing, Shipped, Delivered, Cancelled)
      // Payment receipt approval is handled separately in the Payments section via /api/Payment/{id}/review
      const apiStatus = (norm === 'paid' || norm === 'paymentapproved') ? 'Processing' : status
      await api.orders.updateStatus(orderId, apiStatus)

      setOrders(prev => prev.map(o => String(o.id).toLowerCase() === orderIdStr ? { ...o, status: norm } : o))
      await fetchAllApiData()
      return { success: true }
    } catch (err) {
      console.error('[Update Order Status Error]:', err.message)
      return { success: false, error: err.message }
    }
  }, [fetchAllApiData])

  const approveReview = useCallback((reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r))
  }, [])

  const deleteReview = useCallback((reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }, [])

  const toggleDiscount = useCallback((discountId) => {
    setDiscounts(prev => prev.map(d =>
      d.id === discountId ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    ))
  }, [])

  const reviewPayment = useCallback(async (paymentId, decision, notes) => {
    try {
      await api.payments.review(paymentId, decision, notes)
      setPendingPayments(prev => prev.filter(p => (p.paymentId ?? p.id) !== paymentId))
      await fetchAllApiData()
      return { success: true }
    } catch (err) {
      console.error('[Review Payment Error]:', err.message)
      return { success: false, error: err.message }
    }
  }, [fetchAllApiData])

  // ─── Stats ────────────────────────────────────────────────────────────────
  const stats = {
    totalRevenue: dashboardSummary?.totalRevenue ?? orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0),
    totalOrders: dashboardSummary?.totalOrders ?? orders.length,
    totalCustomers: dashboardSummary?.totalCustomers ?? customers.length,
    totalProducts: dashboardSummary?.totalProducts ?? products.length,
    pendingOrders: dashboardSummary?.pendingOrdersCount ?? orders.filter(o => ['pending', 'pendingpayment'].includes(o.status)).length,
  }

  const value = {
    adminUser,
    adminLogin,
    adminLogout,
    activeSection,
    setActiveSection,
    sidebarCollapsed,
    setSidebarCollapsed,
    // Live API Data
    products,
    categories,
    colors,
    sizes,
    apiLoading,
    apiError,
    fetchAllApiData,
    // CRUD
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    deleteCategory,
    createColor,
    deleteColor,
    createSize,
    deleteSize,
    // Live State
    orders,
    customers,
    reviews,
    staff,
    discounts,
    pendingPayments,
    dashboardSummary,
    dashboardOverview,
    updateOrderStatus,
    approveReview,
    deleteReview,
    toggleDiscount,
    reviewPayment,
    stats,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
