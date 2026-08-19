import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import * as api from '../api/apiClient'

// ─── Admin Context ─────────────────────────────────────────────────────────────
export const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

const getSectionFromPath = (path) => {
  const clean = (path || '').toLowerCase().replace(/^\/+|\/+$/g, '')
  if (!clean || clean === 'dashboard') return 'dashboard'
  if (clean === 'review' || clean === 'reviews') return 'reviews'
  if (clean === 'product' || clean === 'products') return 'products'
  if (clean === 'category' || clean === 'categories') return 'categories'
  if (clean === 'order' || clean === 'orders') return 'orders'
  if (clean === 'customer' || clean === 'customers') return 'customers'
  if (clean === 'payment' || clean === 'payments') return 'payments'
  if (clean === 'discount' || clean === 'discounts') return 'discounts'
  if (clean === 'setting' || clean === 'settings') return 'settings'
  if (clean === 'staff') return 'staff'
  if (clean === 'inventory') return 'inventory'
  if (clean === 'shipping') return 'shipping'
  if (clean === 'analytics') return 'analytics'
  return clean
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminProvider({ children }) {
  // ── Admin auth ──
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_admin') || 'null') } catch { return null }
  })

  // ── UI state & URL Path Routing ──
  const [activeSection, setActiveSectionState] = useState(() => {
    try {
      const urlSection = getSectionFromPath(window.location.pathname)
      if (urlSection && urlSection !== 'dashboard') return urlSection
      return localStorage.getItem('mk1974_admin_active_section') || 'dashboard'
    } catch {
      return 'dashboard'
    }
  })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const setActiveSection = useCallback((section) => {
    setActiveSectionState(section)
    try {
      localStorage.setItem('mk1974_admin_active_section', section)
      const targetPath = section === 'dashboard' ? '/' : `/${section}`
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const section = getSectionFromPath(window.location.pathname)
      setActiveSectionState(section)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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
      const stored = localStorage.getItem('mk1974_orders')
      if (!stored) return []
      const localOrders = JSON.parse(stored)
      if (!Array.isArray(localOrders)) return []
      return localOrders.map(o => ({
        id: String(o.id || ''),
        customer: `${o.firstName || ''} ${o.lastName || ''}`.trim() || 'Customer',
        email: o.email || 'N/A',
        items: o.items && Array.isArray(o.items) ? o.items.reduce((sum, item) => sum + (item.qty || 1), 0) : 1,
        total: Number(o.total) || 0,
        status: o.status || 'pendingpayment',
        date: o.createdAt ? String(o.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
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

  const fetchAllApiData = useCallback(async (isInitial = false) => {
    if (!adminUser || !api.getToken()) {
      console.log('[AdminContext] No admin user or token, skipping API fetch.')
      return
    }
    if (isInitial) setApiLoading(true)
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
      parsedPays.sort((a, b) => {
        const idA = Number(a.paymentId ?? a.id ?? a.paymentReviewId ?? 0)
        const idB = Number(b.paymentId ?? b.id ?? b.paymentReviewId ?? 0)
        if (idB && idA && idB !== idA) return idB - idA

        const dateA = new Date(a.createdAt || a.createdDate || a.date || 0).getTime()
        const dateB = new Date(b.createdAt || b.createdDate || b.date || 0).getTime()
        return dateB - dateA
      })
      
      setPendingPayments(parsedPays)
      
      const onlyCustomerUsers = parsedCusts.filter(c => {
        if (!c.role) return true
        const r = String(c.role).toLowerCase().trim()
        return r === 'customer' || r === '0' || r === 'user' || r === 'client'
      })

      setCustomers(onlyCustomerUsers.map(c => ({
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
        status: c.status || 'active',
        role: 'Customer'
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

      setProducts(parsedProds.map(p => ({
        ...p,
        id: p.productId ?? p.id,
        // API returns categories as plain strings e.g. ["Jersey shorts"].
        // Store them as { id: null, name: "..." } so the modal's name-lookup
        // path is used rather than a wrong numeric id.
        categories: (p.categories || []).map(c => {
          if (typeof c === 'string') return { id: null, name: c };
          return { ...c, id: c.categoryId ?? c.id };
        })
      })))

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

      if (parsedProds.length === 0 && isInitial) {
        setTimeout(() => fetchAllApiData(false), 4000)
      }
    } catch (err) {
      setApiError(err.message || 'Failed to fetch API data.')
      if (isInitial) {
        setTimeout(() => fetchAllApiData(false), 4000)
      }
    } finally {
      if (isInitial) setApiLoading(false)
    }
  }, [adminUser])

  useEffect(() => {
    if (adminUser) {
      fetchAllApiData(true)
    }
  }, [adminUser, fetchAllApiData])

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
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Check your credentials.' }
    }
  }, [])

  const adminRegister = useCallback(async (userData) => {
    try {
      await api.auth.register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || userData.name?.split(' ')[0] || 'Admin',
        lastName: userData.lastName || userData.name?.split(' ')[1] || 'User',
        role: 'Admin',
      })
      // Auto login after successful registration
      return await adminLogin({ email: userData.email, password: userData.password })
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' }
    }
  }, [adminLogin])

  const adminLogout = useCallback(() => {
    setAdminUser(null)
    api.setToken(null)
    localStorage.removeItem('mk1974_admin')
    localStorage.removeItem('mk1974_admin_token')
    localStorage.removeItem('mk1974_admin_active_section')
    
    // Clear all admin data from memory to secure the UI state
    setProducts([])
    setCategories([])
    setColors([])
    setSizes([])
    setOrders([])
    setCustomers([])
    setReviews([])
    setDashboardSummary(null)
    setDashboardOverview(null)
    setPendingPayments([])
    setApiError(null)

    setActiveSection('dashboard')
  }, [setActiveSection])

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

  const updateProduct = useCallback(async (id, body, imageFiles) => {
    const data = await api.products.update(id, body)
    if (id && imageFiles && imageFiles.length > 0) {
      try {
        await api.products.uploadImages(id, imageFiles)
      } catch (err) {
        console.error('[Image Upload] Failed:', err.message)
      }
    }
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
  const calculatedRevenue = orders
    .filter(o => {
      const s = String(o.status || '').toLowerCase()
      return s !== 'cancelled' && s !== 'refunded' && s !== 'pendingpayment' && s !== 'pending' && s !== 'awaiting_payment'
    })
    .reduce((s, o) => s + (Number(o.total || o.totalAmount) || 0), 0)

  const pendingOrdersCount = orders.filter(o => {
    const s = String(o.status || '').toLowerCase()
    return ['pending', 'pendingpayment', 'paymentsubmitted', 'submitted', 'awaiting_payment'].includes(s)
  }).length

  const stats = {
    totalRevenue: (dashboardSummary?.totalRevenue && dashboardSummary.totalRevenue > 0) ? dashboardSummary.totalRevenue : calculatedRevenue,
    totalOrders: Math.max(dashboardSummary?.totalOrders || 0, orders.length),
    totalCustomers: customers.length,
    totalProducts: products.length,
    pendingOrders: pendingOrdersCount,
  }

  // ─── Analytics ────────────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyRevenue = Array(12).fill(0)
    const monthlyOrders = Array(12).fill(0)

    orders.forEach(o => {
      const s = String(o.status || '').toLowerCase()
      if (s !== 'cancelled' && s !== 'refunded') {
        const rawDate = o.rawDate || o.date
        if (rawDate) {
          try {
            const d = new Date(rawDate)
            if (!isNaN(d.getTime())) {
              const mIdx = d.getMonth()
              if (s !== 'pendingpayment' && s !== 'pending' && s !== 'awaiting_payment') {
                monthlyRevenue[mIdx] += (Number(o.total || o.totalAmount) || 0)
              }
              monthlyOrders[mIdx] += 1
            }
          } catch {}
        }
      }
    })

    const rawTop = dashboardOverview?.topProducts || dashboardOverview?.topSellingProducts || []

    return {
      revenue: (Array.isArray(dashboardOverview?.monthlyRevenue) && dashboardOverview.monthlyRevenue.some(v => v > 0))
        ? dashboardOverview.monthlyRevenue
        : monthlyRevenue,
      orders: (Array.isArray(dashboardOverview?.monthlyOrders) && dashboardOverview.monthlyOrders.some(v => v > 0))
        ? dashboardOverview.monthlyOrders
        : monthlyOrders,
      months: dashboardOverview?.months || months,
      topProducts: Array.isArray(rawTop) ? rawTop : [],
      traffic: [
        { source: 'Direct Storefront', pct: 65 },
        { source: 'Organic Search', pct: 20 },
        { source: 'Social Media', pct: 15 },
      ],
    }
  }, [dashboardOverview, orders])

  const value = {
    adminUser,
    adminLogin,
    adminRegister,
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
    analytics,
    updateOrderStatus,
    approveReview,
    deleteReview,
    toggleDiscount,
    reviewPayment,
    stats,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
