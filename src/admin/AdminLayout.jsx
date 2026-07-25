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

export default function AdminLayout() {
  const { adminUser, activeSection, setActiveSection, apiLoading, apiError, adminLogout, stats } = useAdmin()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!adminUser) return <AdminLogin />

  const ActiveSection = SECTIONS[activeSection] || DashboardOverview
  const totalNotifications = (stats?.pendingOrders || 0) + (stats?.pendingReviews || 0)

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#FAF9F6',
      fontFamily: "'Inter', sans-serif",
      color: '#1E1F21',
      position: 'relative'
    }}>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)', zIndex: 90
          }}
        />
      )}

      {/* Sidebar (Off-Canvas Drawer on Mobile) */}
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
          padding: '0 36px',
          height: 64,
          borderBottom: '1px solid rgba(30,31,33,0.08)',
          background: 'rgba(250,249,246,0.92)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          {/* Breadcrumbs & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="desktop-hide"
              style={{
                fontSize: 18, color: '#1E1F21', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4
              }}
              title="Toggle Menu"
            >
              ☰
            </button>
            <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', fontWeight: 500 }} className="mobile-hide">MK 1974</span>
            <span style={{ color: 'rgba(30,31,33,0.2)', fontSize: 11 }} className="mobile-hide">/</span>
            <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#968574', fontWeight: 600 }}>{activeSection}</span>
          </div>

          {/* Actions & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Live API Status Indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: apiError ? 'rgba(239,68,68,0.08)' : (apiLoading ? 'rgba(234,179,8,0.08)' : 'rgba(34,197,94,0.08)'),
              border: `1px solid ${apiError ? 'rgba(239,68,68,0.2)' : (apiLoading ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.2)')}`,
              padding: '4px 10px', borderRadius: 20, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
              color: apiError ? '#dc2626' : (apiLoading ? '#d97706' : '#16a34a')
            }}>
              <span className="animate-pulse-dot" style={{
                width: 6, height: 6, borderRadius: '50%',
                background: apiError ? '#dc2626' : (apiLoading ? '#d97706' : '#16a34a')
              }} />
              <span className="mobile-hide">{apiError ? 'API Error' : (apiLoading ? 'Syncing...' : 'API Connected')}</span>
            </div>

            {/* Storefront Link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-hide"
              style={{
                fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)',
                fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 4
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#968574'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(30,31,33,0.5)'}
            >
              <span>↗ Storefront</span>
            </a>

            <div style={{ width: 1, height: 16, background: 'rgba(30,31,33,0.12)' }} className="mobile-hide" />

            {/* Notifications Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                style={{ position: 'relative', padding: 6, color: 'rgba(30,31,33,0.6)', fontSize: 14, display: 'flex', alignItems: 'center' }}
                title="Notifications"
              >
                <span>🔔</span>
                {totalNotifications > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2, background: '#968574', color: '#ffffff',
                    fontSize: 8, fontWeight: 700, width: 14, height: 14, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {totalNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute', right: 0, top: 40, width: 280, background: '#ffffff',
                  border: '1px solid rgba(30,31,33,0.1)', borderRadius: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  padding: 16, zIndex: 50
                }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(30,31,33,0.06)', pb: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1E1F21' }}>Notifications</span>
                    <span style={{ fontSize: 9, color: '#968574', fontWeight: 600 }}>{totalNotifications} Pending</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div
                      onClick={() => { setActiveSection('orders'); setShowNotifications(false); }}
                      style={{ padding: '8px 10px', background: '#FAF9F6', borderRadius: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: 11, color: 'rgba(30,31,33,0.8)' }}>Pending Orders</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#968574' }}>{stats?.pendingOrders || 0}</span>
                    </div>
                    <div
                      onClick={() => { setActiveSection('reviews'); setShowNotifications(false); }}
                      style={{ padding: '8px 10px', background: '#FAF9F6', borderRadius: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: 11, color: 'rgba(30,31,33,0.8)' }}>Pending Reviews</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#968574' }}>{stats?.pendingReviews || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '4px 8px', borderRadius: 20, transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: 30, height: 30, background: '#968574', color: '#FAF9F6',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700
                }}>
                  {adminUser?.avatar || 'MK'}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#1E1F21' }} className="mobile-hide">{adminUser?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: 9, color: 'rgba(30,31,33,0.4)' }} className="mobile-hide">▼</span>
              </div>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 42, width: 200, background: '#ffffff',
                  border: '1px solid rgba(30,31,33,0.1)', borderRadius: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  padding: 8, zIndex: 50
                }} className="animate-fade-in">
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(30,31,33,0.06)' }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#1E1F21' }}>{adminUser?.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 9, color: 'rgba(30,31,33,0.5)', textTransform: 'uppercase' }}>{adminUser?.role}</p>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); adminLogout(); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 12px', fontSize: 11,
                      color: '#dc2626', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main-container" style={{ padding: '36px 40px 80px', maxWidth: 1440, width: '100%', margin: '0 auto', flex: 1 }}>
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
