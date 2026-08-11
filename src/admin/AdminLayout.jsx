import { useState, useEffect, useRef } from 'react'
import { useAdmin } from './context/AdminContext'
import AdminSidebar from './components/AdminSidebar'
import AdminLogin from './components/AdminLogin'
import BrandLoader from '../components/BrandLoader'
import mkLogo from '../assets/mk2.png'

// Sub-sections
import DashboardOverview from './sections/DashboardOverview'
import CategoriesSection from './sections/CategoriesSection'
import ProductsSection from './sections/ProductsSection'
import InventorySection from './sections/InventorySection'
import OrdersSection from './sections/OrdersSection'
import CustomersSection from './sections/CustomersSection'
// import ReviewsSection from './sections/ReviewsSection'
import PaymentsSection from './sections/PaymentsSection'
import DiscountsSection from './sections/DiscountsSection'
import ShippingSection from './sections/ShippingSection'
import StaffSection from './sections/StaffSection'
import AnalyticsSection from './sections/AnalyticsSection'
import SettingsSection from './sections/SettingsSection'

const SECTIONS = {
  dashboard:  DashboardOverview,
  categories: CategoriesSection,
  products:   ProductsSection,
  inventory:  InventorySection,
  orders:     OrdersSection,
  customers:  CustomersSection,
  // reviews:    ReviewsSection,
  payments:   PaymentsSection,
  discounts:  DiscountsSection,
  shipping:   ShippingSection,
  staff:      StaffSection,
  analytics:  AnalyticsSection,
  settings:   SettingsSection,
}

const SECTION_LABELS = {
  dashboard:  'Overview',
  categories: 'Product Categories',
  products:   'Products Catalogue',
  inventory:  'Stock & Inventory Control',
  orders:     'Orders Management',
  customers:  'Customer Accounts',
  // reviews:    'Customer Reviews',
  payments:   'Payment Operations',
  discounts:  'Promotions & Discounts',
  shipping:   'Shipping & Delivery Rates',
  staff:      'Administrative Staff',
  analytics:  'Reports & Analytics',
  settings:   'System Settings',
}

// Hamburger icon
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 3, display: 'inline' }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export default function AdminLayout() {
  const { adminUser, activeSection, setActiveSection, apiLoading, apiError, adminLogout, stats } = useAdmin()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const userMenuRef = useRef(null)
  const notificationsRef = useRef(null)
  const mainScrollRef = useRef(null)
  const prevY = useRef(0)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const el = mainScrollRef.current
      const windowY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      const containerY = el ? el.scrollTop : 0
      const y = Math.max(windowY, containerY)

      // Hide on scroll down past 40px, show on scroll up (matching storefront Nav)
      if (y > 40 && y > prevY.current + 3) {
        setNavHidden(true)
      } else if (y < prevY.current - 3) {
        setNavHidden(false)
      }
      prevY.current = y
      setScrolled(y > 20)
    }

    handleScroll()

    const container = mainScrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setNavHidden(false)
  }, [activeSection])

  if (!adminUser) return <AdminLogin />

  const ActiveSection = SECTIONS[activeSection] || DashboardOverview
  const totalNotifications = (stats?.pendingOrders || 0) + (stats?.pendingReviews || 0)
  const sectionLabel = SECTION_LABELS[activeSection] || activeSection

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)',
      fontFamily: "'DM Sans', sans-serif",
      color: 'var(--text-primary)',
      position: 'relative',
    }}>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`mobile-sidebar-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div ref={mainScrollRef} style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Storefront-Style Smooth Hide/Show Topbar */}
        <header className="admin-topbar-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: 60,
          borderBottom: '1px solid var(--border)',
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--surface)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          transform: navHidden && !mobileMenuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, box-shadow 0.3s',
          boxShadow: scrolled && !navHidden ? '0 6px 20px -4px rgba(0, 0, 0, 0.08)' : 'none',
        }}>

          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile Brand Logo */}
            <div className="desktop-hide" style={{ display: 'flex', alignItems: 'center', paddingRight: 4 }}>
              <img
                src={mkLogo}
                alt="Brand Logo"
                style={{ height: 26, width: 'auto', opacity: 0.95 }}
              />
            </div>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="desktop-hide"
              style={{
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
                borderRadius: 4,
              }}
              title="Toggle Menu"
            >
              <MenuIcon />
            </button>

            {/* Section title */}
            <h1 style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              {sectionLabel}
            </h1>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

            {/* API status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              background: apiError
                ? 'var(--danger-dim)'
                : apiLoading
                  ? 'var(--warning-dim)'
                  : 'var(--success-dim)',
              border: `1px solid ${apiError ? 'rgba(208,49,49,0.2)' : apiLoading ? 'rgba(180,83,9,0.2)' : 'rgba(45,138,78,0.2)'}`,
            }}>
              <span
                className="animate-pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: apiError ? 'var(--danger)' : apiLoading ? 'var(--warning)' : 'var(--success)',
                  display: 'inline-block',
                }}
              />
              <span
                className="mobile-hide"
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: apiError ? 'var(--danger)' : apiLoading ? 'var(--warning)' : 'var(--success)',
                }}
              >
                {apiError ? 'API Error' : apiLoading ? 'Syncing' : 'Live'}
              </span>
            </div>

            {/* Storefront link */}
            {/* <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-hide"
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Storefront <ExternalIcon />
            </a> */}

            {/* Separator */}
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} className="mobile-hide" />

            {/* Notifications */}
            <div ref={notificationsRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
                style={{
                  position: 'relative',
                  padding: 7,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 6,
                  transition: 'background 0.15s, color 0.15s',
                }}
                title="Notifications"
                onMouseEnter={e => { e.currentTarget.style.background = '#F0F0F0'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <BellIcon />
                {totalNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 4, right: 4,
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    width: 14, height: 14,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {totalNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 44,
                  width: 268,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '4px 0',
                  zIndex: 50,
                }} className="animate-fade-in">
                  <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
                    {totalNotifications > 0 && (
                      <span style={{ float: 'right', fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{totalNotifications} pending</span>
                    )}
                  </div>
                  <div style={{ padding: '6px 0' }}>
                    <div
                      onClick={() => { setActiveSection('orders'); setShowNotifications(false) }}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F7F7F5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Pending Orders</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{stats?.pendingOrders || 0}</span>
                    </div>
                    <div
                      onClick={() => { setActiveSection('reviews'); setShowNotifications(false) }}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F7F7F5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Pending Reviews</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{stats?.pendingReviews || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '4px 8px 4px 4px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  background: 'rgba(196, 98, 45, 0.12)',
                  border: '1px solid rgba(196, 98, 45, 0.25)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}>
                  {adminUser?.avatar || (adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'MK')}
                </div>
                <span className="mobile-hide" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {adminUser?.name?.split(' ')[0]}
                </span>
                <svg className="mobile-hide" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 44,
                  width: 208,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden',
                  zIndex: 50,
                }} className="animate-fade-in">
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{adminUser?.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{adminUser?.role}</p>
                  </div>
                  <div style={{ padding: '4px 0' }}>
                    <button
                      onClick={() => { setShowUserMenu(false); adminLogout() }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: 13,
                        color: 'var(--danger)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'background 0.12s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-dim)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="admin-main-container"
          style={{ padding: '32px 36px 80px', maxWidth: 1440, width: '100%', margin: '0 auto', flex: 1, position: 'relative' }}
        >
          {apiLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(6px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 360,
              borderRadius: 'var(--radius-lg)',
            }}>
              <BrandLoader  size="lg" />
            </div>
          )}
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
