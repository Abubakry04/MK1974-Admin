import { useAdmin } from '../context/AdminContext'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: '◈' },
  { id: 'products',   label: 'Products',     icon: '▦' },
  { id: 'categories', label: 'Categories',   icon: '⊞' },
  { id: 'inventory',  label: 'Inventory',    icon: '⬡' },
  { id: 'orders',     label: 'Orders',       icon: '◎' },
  { id: 'customers',  label: 'Customers',    icon: '◈' },
  { id: 'reviews',    label: 'Reviews',      icon: '★' },
  { id: 'payments',   label: 'Payments',     icon: '◇' },
  { id: 'analytics',  label: 'Analytics',    icon: '▲' },
  { id: 'staff',      label: 'Staff',        icon: '⊕' },
  { id: 'settings',   label: 'Settings',     icon: '⚙' },
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
      width: sidebarCollapsed ? 72 : 240,
      minHeight: '100vh',
      background: '#141517',
      borderRight: '1px solid rgba(250,249,246,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
      zIndex: 50,
    }}>
      {/* Header Emblem */}
      <div style={{
        padding: sidebarCollapsed ? '20px 0' : '20px 20px',
        borderBottom: '1px solid rgba(250,249,246,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        minHeight: 64,
      }}>
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, background: 'linear-gradient(135deg, #968574 0%, #786858 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(150,133,116,0.25)'
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 14, color: '#FAF9F6', fontStyle: 'italic' }}>MK</span>
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700, lineHeight: 1.2 }}>MK 1974</p>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,249,246,0.4)', margin: 0, fontWeight: 400, lineHeight: 1.2 }}>Control Panel</p>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div style={{
            width: 34, height: 34, background: 'linear-gradient(135deg, #968574 0%, #786858 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(150,133,116,0.25)'
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 14, color: '#FAF9F6', fontStyle: 'italic' }}>MK</span>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            id="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,249,246,0.4)', fontSize: 16, padding: 4, lineHeight: 1, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FAF9F6'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,249,246,0.4)'}
          >‹</button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,249,246,0.4)', fontSize: 16, padding: '10px 0', lineHeight: 1, textAlign: 'center' }}
          onMouseEnter={e => e.currentTarget.style.color = '#FAF9F6'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,249,246,0.4)'}
        >›</button>
      )}

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id
          const badge = badgeCounts[item.id]
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '12px 0' : '12px 20px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(150,133,116,0.18)' : 'none',
                borderLeft: isActive ? '3px solid #968574' : '3px solid transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(250,249,246,0.04)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
            >
              <span style={{ fontSize: 14, color: isActive ? '#968574' : 'rgba(250,249,246,0.4)', flexShrink: 0, width: 20, textAlign: 'center' }}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <>
                  <span style={{
                    fontSize: 12, fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#FAF9F6' : 'rgba(250,249,246,0.6)',
                    letterSpacing: '0.04em'
                  }}>
                    {item.label}
                  </span>
                  {badge > 0 && (
                    <span style={{
                      marginLeft: 'auto', background: '#968574', color: '#FAF9F6',
                      fontSize: 9, fontWeight: 700, padding: '2px 7px',
                      borderRadius: 10, letterSpacing: '0.05em', minWidth: 18, textAlign: 'center',
                    }}>{badge}</span>
                  )}
                </>
              )}
              {sidebarCollapsed && badge > 0 && (
                <span style={{
                  position: 'absolute', top: 8, right: 12,
                  width: 7, height: 7, background: '#968574', borderRadius: '50%',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Admin User Footer */}
      <div style={{
        padding: sidebarCollapsed ? '16px 0' : '16px 20px',
        borderTop: '1px solid rgba(250,249,246,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{
          width: 32, height: 32, background: 'rgba(150,133,116,0.2)',
          border: '1px solid rgba(150,133,116,0.4)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#968574' }}>{adminUser?.avatar || 'MK'}</span>
        </div>
        {!sidebarCollapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#FAF9F6', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminUser?.name}</p>
            <p style={{ fontSize: 9, color: 'rgba(250,249,246,0.4)', margin: '1px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{adminUser?.role}</p>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            id="admin-logout-btn"
            onClick={adminLogout}
            title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,249,246,0.4)', fontSize: 11, fontWeight: 500, padding: 4, flexShrink: 0, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,249,246,0.4)'}
          >Exit</button>
        )}
      </div>
    </aside>
  )
}
