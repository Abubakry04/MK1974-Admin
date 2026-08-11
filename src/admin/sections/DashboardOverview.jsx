import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

// ─── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent, growth }) {
  return (
    <div
      className="card-lift"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '22px 24px',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <p style={{
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--text-muted)',
        margin: '0 0 12px',
        letterSpacing: '0.01em',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 34,
        fontWeight: 600,
        color: accent || 'var(--text-primary)',
        margin: 0,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </p>
      {(sub || growth) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          {growth && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--success)',
              background: 'var(--success-dim)',
              padding: '2px 7px',
              borderRadius: 20,
            }}>
              ↑ {growth}
            </span>
          )}
          {sub && (
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 400 }}>{sub}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, sub, action }) {
  const { fetchAllApiData } = useAdmin()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllApiData(true)
    setTimeout(() => setRefreshing(false), 400)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 24,
      gap: 10,
      width: '100%',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: '20px 24px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Title & Refresh Button Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontSize: 26,
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}>
          {title}
        </h2>

        {/* Refresh Pill Button (Positioned Far Right) */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5.5px 14px',
            fontSize: 11.5,
            fontWeight: 600,
            color: 'var(--text-primary)',
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 20,
            cursor: refreshing ? 'default' : 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={e => { if (!refreshing) e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { if (!refreshing) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
          title="Refresh live store data"
        >
          <svg
            width="12" height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: refreshing ? 'spin 0.7s linear infinite' : 'none',
              transformOrigin: 'center'
            }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {/* Subtitle text */}
      {sub && (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 12.5,
          margin: 0,
          fontWeight: 400,
          letterSpacing: '0.01em',
        }}>
          {sub}
        </p>
      )}

      {/* Action Button (+ Add Product) aligned to the right UNDER the Refresh Button */}
      {action && (
        <div className="section-header-action" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 6,
          paddingTop: 10,
          borderTop: '1px solid var(--border)',
        }}>
          {action}
        </div>
      )}
    </div>
  )
}

// ─── Table ─────────────────────────────────────────────────────────────────────
export function Table({ headers, rows }) {
  return (
    <div style={{
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
    }}>
      <table style={{ width: '100%', minWidth: 540, borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {headers.map(h => (
              <th key={h} style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: '#FAFAFA',
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '13px 16px',
                  color: j === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: j === 0 ? 500 : 400,
                  fontSize: 13,
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pendingpayment:    { color: 'var(--warning)',  bg: 'var(--warning-dim)',  label: 'Pending Payment' },
    paymentsubmitted:  { color: 'var(--info)',     bg: 'var(--info-dim)',     label: 'Payment Submitted' },
    paid:              { color: 'var(--success)',  bg: 'var(--success-dim)',  label: 'Paid' },
    paymentrejected:   { color: 'var(--danger)',   bg: 'var(--danger-dim)',   label: 'Rejected' },
    processing:        { color: 'var(--warning)',  bg: 'var(--warning-dim)',  label: 'Processing' },
    shipped:           { color: 'var(--info)',     bg: 'var(--info-dim)',     label: 'Shipped' },
    delivered:         { color: 'var(--success)',  bg: 'var(--success-dim)',  label: 'Delivered' },
    cancelled:         { color: 'var(--text-secondary)', bg: '#F0F0F0',      label: 'Cancelled' },
    refunded:          { color: 'var(--purple)',   bg: 'var(--purple-dim)',   label: 'Refunded' },
    awaiting_payment:  { color: 'var(--danger)',   bg: 'var(--danger-dim)',   label: 'Awaiting Payment' },
    active:            { color: 'var(--success)',  bg: 'var(--success-dim)',  label: 'Active' },
    inactive:          { color: 'var(--text-secondary)', bg: '#F0F0F0',      label: 'Inactive' },
    expired:           { color: 'var(--danger)',   bg: 'var(--danger-dim)',   label: 'Expired' },
    approved:          { color: 'var(--success)',  bg: 'var(--success-dim)',  label: 'Approved' },
    pending:           { color: 'var(--warning)',  bg: 'var(--warning-dim)',  label: 'Pending' },
    vip:               { color: 'var(--accent)',   bg: 'var(--accent-dim)',   label: 'VIP' },
    instock:           { color: 'var(--success)',  bg: 'var(--success-dim)',  label: 'In Stock' },
    outofstock:        { color: 'var(--danger)',   bg: 'var(--danger-dim)',   label: 'Out of Stock' },
  }
  const key = status ? String(status).toLowerCase().replace(/[^a-z_]/g, '') : 'pending'
  const s = map[key] || { color: 'var(--text-secondary)', bg: '#F0F0F0', label: status || 'Unknown' }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '3px 9px 3px 7px',
      background: s.bg,
      borderRadius: 4,
      fontSize: 11.5,
      fontWeight: 500,
      color: s.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: s.color,
        flexShrink: 0,
      }} />
      {s.label}
    </span>
  )
}

// ─── Admin Button ──────────────────────────────────────────────────────────────
export function AdminBtn({ children, onClick, variant = 'primary', id, disabled }) {
  const styles = {
    primary:   { background: '#111111',           color: '#FFFFFF', border: '1px solid #111111' },
    secondary: { background: 'var(--accent)',      color: '#FFFFFF', border: '1px solid var(--accent)' },
    ghost:     { background: 'var(--surface)',     color: 'var(--text-primary)', border: '1px solid var(--border-strong)' },
    danger:    { background: 'var(--danger-dim)',  color: 'var(--danger)',  border: '1px solid rgba(208,49,49,0.25)' },
    success:   { background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(45,138,78,0.25)' },
  }
  const hoverStyles = {
    primary:   { background: '#333333', border: '1px solid #333333' },
    secondary: { background: '#A8501F', border: '1px solid #A8501F' },
    ghost:     { background: '#F0F0F0', border: '1px solid var(--border-strong)' },
    danger:    { background: 'rgba(208,49,49,0.15)', border: '1px solid rgba(208,49,49,0.35)' },
    success:   { background: 'rgba(45,138,78,0.15)', border: '1px solid rgba(45,138,78,0.35)' },
  }
  const base = styles[variant] || styles.primary
  const hover = hoverStyles[variant] || hoverStyles.primary

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        borderRadius: 'var(--radius)',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = hover.background
          e.currentTarget.style.borderColor = hover.border.replace('1px solid ', '')
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.background = base.background
          e.currentTarget.style.borderColor = base.border.replace('1px solid ', '')
        }
      }}
    >
      {children}
    </button>
  )
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ data = [], labels = [], color = 'var(--accent)', height = 210, prefix = '' }) {
  const safeData = Array.isArray(data) ? data : []
  const safeLabels = Array.isArray(labels) ? labels : []
  const max = Math.max(...safeData, 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 36, paddingBottom: 6 }}>
      {safeData.map((v, i) => {
        const val = v || 0
        const isMax = val > 0 && val === max

        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              height: '100%',
              justifyContent: 'flex-end',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                background: color,
                borderRadius: '3px 3px 0 0',
                height: `${(val / max) * 100}%`,
                minHeight: 4,
                transition: 'height 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
                opacity: 0.88,
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '1'
                const tip = e.currentTarget.parentNode.querySelector('.tip')
                if (tip) tip.style.display = 'block'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '0.88'
                const tip = e.currentTarget.parentNode.querySelector('.tip')
                if (tip && !isMax) tip.style.display = 'none'
              }}
              onTouchStart={e => {
                const tip = e.currentTarget.parentNode.querySelector('.tip')
                if (tip) tip.style.display = tip.style.display === 'block' ? 'none' : 'block'
              }}
            />

            {/* Tooltip Figure — Always visible for positive values & highest bar */}
            <div
              className="tip"
              style={{
                display: (isMax || val > 0) ? 'block' : 'none',
                position: 'absolute',
                top: -28,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0F0F0F',
                padding: '3px 7px',
                borderRadius: 4,
                fontSize: 10.5,
                fontWeight: 700,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                zIndex: 30,
                pointerEvents: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {prefix}{val.toLocaleString()}
            </div>

            <span style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              fontWeight: 400,
              textAlign: 'center',
            }}>
              {safeLabels[i] || ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { stats, orders, analytics, setActiveSection, adminUser } = useAdmin()

  const recentOrders = orders.slice(0, 6)

  return (
    <div className="animate-fade-up">
      <SectionHeader
        title={`Welcome back, ${adminUser?.name?.split(' ')[0] || 'Admin'}`}
        sub="Here's what's happening with your store today."
        action={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <AdminBtn variant="secondary" onClick={() => setActiveSection('products')}>
              + Add Product
            </AdminBtn>
            <AdminBtn variant="ghost" onClick={() => setActiveSection('orders')}>
              View Orders
            </AdminBtn>
          </div>
        }
      />

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        <StatCard
          label="Total Revenue"
          value={`₦${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}`}
          sub="Delivered & paid"
          growth="12.4%"
          accent="var(--accent)"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
          sub={`${stats?.pendingOrders || 0} pending`}
          growth="8.1%"
        />
        <StatCard
          label="Customers"
          value={stats?.totalCustomers || 0}
          sub="Registered"
          growth="15.2%"
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts || 0}
          sub="Active items"
        />
      </div>

      {/* Analytics + Top Products */}
      <div className="responsive-grid-split" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 16,
        marginBottom: 28,
      }}>
        {/* Revenue Chart */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '20px 22px',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 4px' }}>Revenue</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                Last 12 Months
              </h3>
            </div>
            <span style={{
              fontSize: 12,
              color: 'var(--success)',
              fontWeight: 600,
              background: 'var(--success-dim)',
              padding: '3px 10px',
              borderRadius: 20,
            }}>
              +18.5%
            </span>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
            <BarChart data={analytics?.revenue || []} labels={analytics?.months || []} prefix="₦" height={180} />
          </div>
        </div>

        {/* Top Products */}
        {/* <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '20px 22px',
          borderRadius: 'var(--radius-lg)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 4px' }}>Highlights</p>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            Top Selling Products
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {(analytics?.topProducts || []).length > 0 ? (
              (analytics?.topProducts || []).map((p) => (
                <div key={p.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{
                      fontSize: 13,
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '68%',
                    }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{p.sold} sold</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'var(--accent)',
                      width: `${(p.sold / (analytics.topProducts[0].sold || 1)) * 100}%`,
                      borderRadius: 2,
                      opacity: 0.7,
                    }} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                Notice: No top selling product analytics recorded yet.
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 3px' }}>Live Activity</p>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              Recent Orders
            </h3>
          </div>
          <AdminBtn variant="ghost" onClick={() => setActiveSection('orders')} id="view-all-orders-btn">
            View all →
          </AdminBtn>
        </div>
        {recentOrders.length > 0 ? (
          <Table
            headers={['S/N', 'Customer', 'Items', 'Total', 'Status', 'Date']}
            rows={recentOrders.map((o, idx) => [
              <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{idx + 1}</span>,
              o.customer,
              o.items,
              `₦${Number(o.total || 0).toLocaleString()}`,
              <StatusBadge status={o.status} />,
              o.date,
            ])}
          />
        ) : (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 13,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}>
            Notice: No order transactions recorded yet. Live API synced.
          </div>
        )}
      </div>
    </div>
  )
}
