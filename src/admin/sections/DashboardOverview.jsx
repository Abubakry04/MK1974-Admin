import { useAdmin } from '../context/AdminContext'

// ─── Shared UI Components ──────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent, icon, growth }) {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
      padding: '24px 28px', position: 'relative', overflow: 'hidden', borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)'
    }} className="hover-lift">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 10px', fontWeight: 600 }}>{label}</p>
          <p style={{ fontSize: 30, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: accent || '#1E1F21', margin: 0, lineHeight: 1 }}>{value}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            {growth && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                ↑ {growth}
              </span>
            )}
            {sub && <span style={{ fontSize: 11, color: 'rgba(30,31,33,0.5)', fontWeight: 400 }}>{sub}</span>}
          </div>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 8, background: 'rgba(150,133,116,0.08)',
          border: '1px solid rgba(150,133,116,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: accent || '#968574'
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#968574', margin: '0 0 6px', fontWeight: 700 }}>Management</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21', fontSize: 30, margin: 0 }}>{title}</h2>
        {sub && <p style={{ color: 'rgba(30,31,33,0.6)', fontSize: 13, margin: '6px 0 0', fontWeight: 400 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(30,31,33,0.08)', background: '#FAF9F6' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(30,31,33,0.04)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(150,133,116,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '14px 18px', color: j === 0 ? '#1E1F21' : 'rgba(30,31,33,0.7)', fontWeight: j === 0 ? 500 : 400 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    delivered: { bg: 'rgba(34,197,94,0.1)', color: '#15803d', label: 'Delivered' },
    paid: { bg: 'rgba(34,197,94,0.1)', color: '#15803d', label: 'Paid' },
    processing: { bg: 'rgba(234,179,8,0.1)', color: '#a16207', label: 'Processing' },
    awaiting_payment: { bg: 'rgba(239,68,68,0.1)', color: '#b91c1c', label: 'Awaiting Payment' },
    shipped: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'Shipped' },
    cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#374151', label: 'Cancelled' },
    active: { bg: 'rgba(34,197,94,0.1)', color: '#15803d', label: 'Active' },
    inactive: { bg: 'rgba(107,114,128,0.1)', color: '#374151', label: 'Inactive' },
    expired: { bg: 'rgba(239,68,68,0.1)', color: '#b91c1c', label: 'Expired' },
    approved: { bg: 'rgba(34,197,94,0.1)', color: '#15803d', label: 'Approved' },
    pending: { bg: 'rgba(234,179,8,0.1)', color: '#a16207', label: 'Pending' },
    vip: { bg: 'rgba(150,133,116,0.12)', color: '#76685A', label: 'VIP' },
    instock: { bg: 'rgba(34,197,94,0.1)', color: '#15803d', label: 'In Stock' },
    outofstock: { bg: 'rgba(239,68,68,0.1)', color: '#b91c1c', label: 'Out of Stock' },
  }
  const normalizedKey = status ? String(status).toLowerCase().replace(/[^a-z_]/g, '') : 'pending'
  const s = map[normalizedKey] || { bg: 'rgba(107,114,128,0.1)', color: '#374151', label: status || 'Pending' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
      background: s.bg, color: s.color, borderRadius: 4,
      fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  )
}

export function AdminBtn({ children, onClick, variant = 'primary', id, disabled }) {
  const styles = {
    primary: { background: '#1E1F21', color: '#FAF9F6', border: '1px solid #1E1F21' },
    secondary: { background: '#968574', color: '#FAF9F6', border: '1px solid #968574' },
    ghost: { background: '#ffffff', color: '#1E1F21', border: '1px solid rgba(30,31,33,0.15)' },
    danger: { background: 'transparent', color: '#dc2626', border: '1px solid rgba(239,68,68,0.4)' },
    success: { background: 'transparent', color: '#16a34a', border: '1px solid rgba(34,197,94,0.4)' },
  }
  const activeStyle = styles[variant] || styles.primary
  return (
    <button id={id} onClick={onClick} disabled={disabled} style={{
      ...activeStyle,
      padding: '9px 20px', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em',
      textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'Inter', sans-serif", borderRadius: 4, transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
      opacity: disabled ? 0.5 : 1, boxShadow: variant === 'secondary' || variant === 'primary' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.transform = 'none'; } }}
    >{children}</button>
  )
}

// ─── Bar Chart Component ──────────────────────────────────────────────────────
export function BarChart({ data, labels, color = '#968574', height = 160, prefix = '' }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height, paddingTop: 24 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', background: `linear-gradient(180deg, ${color} 0%, rgba(150,133,116,0.6) 100%)`,
            borderRadius: '4px 4px 0 0',
            height: `${(v / max) * 100}%`,
            minHeight: 6, transition: 'height 0.4s cubic-bezier(.4,0,.2,1)',
            position: 'relative',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.filter = 'brightness(1.1)'
              const tip = e.currentTarget.querySelector('.tip')
              if (tip) tip.style.display = 'block'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = 'none'
              const tip = e.currentTarget.querySelector('.tip')
              if (tip) tip.style.display = 'none'
            }}
          >
            <div className="tip" style={{
              display: 'none', position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
              background: '#1E1F21', border: '1px solid rgba(250,249,246,0.1)', padding: '4px 8px', borderRadius: 4,
              fontSize: 10, fontWeight: 600, color: '#FAF9F6', whiteSpace: 'nowrap', zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>{prefix}{v.toLocaleString()}</div>
          </div>
          <span style={{ fontSize: 9, color: 'rgba(30,31,33,0.5)', letterSpacing: '0.05em', fontWeight: 500 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Dashboard Overview Main Section ───────────────────────────────────────────
export default function DashboardOverview() {
  const { stats, orders, analytics, setActiveSection, adminUser } = useAdmin()

  const recentOrders = orders.slice(0, 6)

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Dashboard Overview"
        sub={`Welcome back, ${adminUser?.name || 'Admin'}. Here is your live store performance.`}
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <AdminBtn variant="secondary" onClick={() => setActiveSection('products')}>+ Add Product</AdminBtn>
            <AdminBtn variant="ghost" onClick={() => setActiveSection('orders')}>View Orders</AdminBtn>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="Total Revenue" value={`₦${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`} sub="Delivered & Paid orders" growth="12.4%" accent="#968574" icon="₦" />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} sub={`${stats?.pendingOrders || 0} pending processing`} growth="8.1%" icon="◎" />
        <StatCard label="Total Customers" value={stats?.totalCustomers || 0} sub="Registered user accounts" growth="15.2%" icon="◈" />
        <StatCard label="Catalogue Products" value={stats?.totalProducts || 0} sub="Active store items" icon="▦" />
      </div>

      {/* Analytics & Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 32 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700 }}>Analytics</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E1F21', margin: '4px 0 0' }}>Revenue Trend (Last 12 Months)</h3>
            </div>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, background: 'rgba(34,197,94,0.08)', padding: '4px 10px', borderRadius: 20 }}>
              +18.5% Growth
            </span>
          </div>
          <BarChart data={analytics?.revenue || []} labels={analytics?.months || []} prefix="₦" height={180} />
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 4px', fontWeight: 700 }}>Highlights</p>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E1F21', margin: '0 0 20px' }}>Top Selling Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(analytics?.topProducts || []).map((p, i) => (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: '#968574', fontWeight: 700 }}>{p.sold} sold</span>
                </div>
                <div style={{ height: 4, background: 'rgba(30,31,33,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#968574', width: `${(p.sold / (analytics.topProducts[0].sold || 1)) * 100}%`, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700 }}>Live Store Activity</p>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1E1F21', margin: '4px 0 0' }}>Recent Orders</h3>
          </div>
          <AdminBtn variant="ghost" onClick={() => setActiveSection('orders')} id="view-all-orders-btn">View All Orders →</AdminBtn>
        </div>
        <Table
          headers={['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date']}
          rows={recentOrders.map(o => [
            <span style={{ color: '#968574', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>{o.id}</span>,
            o.customer,
            o.items,
            `₦${Number(o.total || 0).toLocaleString()}`,
            <StatusBadge status={o.status} />,
            o.date,
          ])}
        />
      </div>
    </div>
  )
}
