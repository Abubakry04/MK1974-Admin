import { useAdmin } from '../context/AdminContext'
import mkLogo from '../../assets/mk2.png'

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  products: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  categories: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  ),
  inventory: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  orders: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  customers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  reviews: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  payments: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  staff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  signOut: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
}

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: 'dashboard' },
  { id: 'products',   label: 'Products',   icon: 'products' },
  { id: 'categories', label: 'Categories', icon: 'categories' },
  { id: 'inventory',  label: 'Inventory',  icon: 'inventory' },
  { id: 'orders',     label: 'Orders',     icon: 'orders' },
  { id: 'customers',  label: 'Customers',  icon: 'customers' },
  // { id: 'reviews',    label: 'Reviews',    icon: 'reviews' },
  { id: 'payments',   label: 'Payments',   icon: 'payments' },
  { id: 'analytics',  label: 'Analytics',  icon: 'analytics' },
  { id: 'staff',      label: 'Staff',      icon: 'staff' },
  { id: 'settings',   label: 'Settings',   icon: 'settings' },
]

export default function AdminSidebar({ onNavigate }) {
  const { activeSection, setActiveSection, adminUser, adminLogout, sidebarCollapsed, setSidebarCollapsed, stats } = useAdmin()

  const badgeCounts = {
    orders: stats?.pendingOrders || 0,
    reviews: stats?.pendingReviews || 0,
  }

  const handleNavClick = (id) => {
    setActiveSection(id)
    if (onNavigate) onNavigate()
  }

  return (
    <aside style={{
      width: sidebarCollapsed ? 68 : 232,
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
      zIndex: 50,
    }}>

      {/* Brand Header */}
      <div style={{
        padding: sidebarCollapsed ? '0 16px' : '0 20px',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        height: 60,
        flexShrink: 0,
      }}>
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={mkLogo}
              alt="MK 1974"
              style={{ height: 28, width: 'auto', filter: 'invert(1)', opacity: 0.95 }}
            />
            <div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 15,
                color: '#FFFFFF',
                letterSpacing: '0.08em',
                display: 'block',
                lineHeight: 1,
              }}>
                1974
              </span>
              <span style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--sidebar-text)',
                letterSpacing: '0.06em',
                marginTop: 2,
                fontWeight: 400,
              }}>
                Admin
              </span>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <img
            src={mkLogo}
            alt="MK"
            style={{ height: 22, width: 'auto', filter: 'invert(1)', opacity: 0.9 }}
          />
        )}
        {/* Desktop collapse toggle */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="mobile-hide"
          style={{
            color: 'var(--sidebar-text)',
            padding: 6,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s, background 0.15s',
            flexShrink: 0,
            marginLeft: sidebarCollapsed ? 0 : 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--sidebar-text)'; e.currentTarget.style.background = 'transparent'; }}
        >
          {sidebarCollapsed ? Icons.chevronRight : Icons.chevronLeft}
        </button>

        {/* Mobile close button */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="desktop-hide"
            title="Close menu"
            style={{
              color: 'var(--sidebar-text)',
              padding: 6,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id
          const badge = badgeCounts[item.id]
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: sidebarCollapsed ? '10px 0' : '9px 16px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                border: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{
                color: isActive ? '#FFFFFF' : 'var(--sidebar-text)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                transition: 'color 0.15s',
              }}>
                {Icons[item.icon]}
              </span>
              {!sidebarCollapsed && (
                <>
                  <span style={{
                    fontSize: 13.5,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#FFFFFF' : 'var(--sidebar-text)',
                    transition: 'color 0.15s',
                    flex: 1,
                    textAlign: 'left',
                  }}>
                    {item.label}
                  </span>
                  {badge > 0 && (
                    <span style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 10,
                      minWidth: 18,
                      textAlign: 'center',
                    }}>
                      {badge}
                    </span>
                  )}
                </>
              )}
              {sidebarCollapsed && badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 7,
                  right: 10,
                  width: 6,
                  height: 6,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* User Footer */}
      <div style={{
        padding: sidebarCollapsed ? '14px 0' : '14px 16px',
        borderTop: '1px solid var(--sidebar-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 30,
          height: 30,
          background: 'rgba(196, 98, 45, 0.2)',
          border: '1px solid rgba(196, 98, 45, 0.35)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
            {adminUser?.avatar || (adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'MK')}
          </span>
        </div>
        {!sidebarCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: '#E0E0E0',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {adminUser?.name}
              </p>
              <p style={{
                fontSize: 11,
                color: 'var(--sidebar-text)',
                margin: '1px 0 0',
                textTransform: 'capitalize',
              }}>
                {adminUser?.role}
              </p>
            </div>
            <button
              id="admin-logout-btn"
              onClick={adminLogout}
              title="Sign out"
              style={{
                color: 'var(--sidebar-text)',
                display: 'flex',
                alignItems: 'center',
                padding: 5,
                borderRadius: 4,
                transition: 'color 0.15s, background 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,100,100,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--sidebar-text)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {Icons.signOut}
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
