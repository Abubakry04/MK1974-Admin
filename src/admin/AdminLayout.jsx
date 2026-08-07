import { useState } from 'react'
import { useAdmin } from './context/AdminContext'
import AdminSidebar from './components/AdminSidebar'
import AdminLogin from './components/AdminLogin'

// Sections
import DashboardOverview from './sections/DashboardOverview'
import ProductsSection from './sections/ProductsSection'
import CategoriesSection from './sections/CategoriesSection'
import InventorySection from './sections/InventorySection'
import OrdersSection from './sections/OrdersSection'
import CustomersSection from './sections/CustomersSection'
import ReviewsSection from './sections/ReviewsSection'
import PaymentsSection from './sections/PaymentsSection'
import DiscountsSection from './sections/DiscountsSection'
import ShippingSection from './sections/ShippingSection'
import AnalyticsSection from './sections/AnalyticsSection'
import StaffSection from './sections/StaffSection'
import SettingsSection from './sections/SettingsSection'

const SECTIONS = {
  dashboard:  DashboardOverview,
  products:   ProductsSection,
  categories: CategoriesSection,
  inventory:  InventorySection,
  orders:     OrdersSection,
  customers:  CustomersSection,
  reviews:    ReviewsSection,
  payments:   PaymentsSection,
  discounts:  DiscountsSection,
  shipping:   ShippingSection,
  analytics:  AnalyticsSection,
  staff:      StaffSection,
  settings:   SettingsSection,
}

const SECTION_LABELS = {
  dashboard:  'Dashboard',
  products:   'Products',
  categories: 'Categories',
  inventory:  'Inventory',
  orders:     'Orders',
  customers:  'Customers',
  reviews:    'Reviews',
  payments:   'Payments',
  discounts:  'Discounts',
  shipping:   'Shipping',
  analytics:  'Analytics',
  staff:      'Staff',
  settings:   'Settings',
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export default function AdminLayout() {
  const { adminUser, activeSection, setActiveSection, apiLoading, apiError, adminLogout, stats } = useAdmin()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header className="admin-topbar-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: 60,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>

          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            <a
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
            </a>

            {/* Separator */}
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} className="mobile-hide" />

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
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
            <div style={{ position: 'relative' }}>
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
          style={{ padding: '32px 36px 80px', maxWidth: 1440, width: '100%', margin: '0 auto', flex: 1 }}
        >
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
