import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, StatCard, AdminBtn } from './DashboardOverview'

const STATUS_CONFIG = [
  { key: 'PendingPayment',   label: 'Pending Payment',   desc: 'Awaiting customer payment' },
  { key: 'PaymentSubmitted', label: 'Payment Submitted', desc: 'Receipt uploaded by customer' },
  { key: 'Paid',             label: 'Paid',              desc: 'Payment confirmed & approved' },
  { key: 'Processing',       label: 'Processing',        desc: 'Fulfilling order items' },
  { key: 'Shipped',          label: 'Shipped',           desc: 'Dispatched & in transit' },
  { key: 'Delivered',        label: 'Delivered',         desc: 'Delivered to customer' },
  { key: 'Cancelled',        label: 'Cancelled',         desc: 'Order cancelled' },
  { key: 'Refunded',         label: 'Refunded',          desc: 'Payment refunded' },
]

const filterTabStyle = (active) => ({
  padding: '7px 14px',
  fontSize: 12.5,
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: 'var(--radius)',
  background: active ? 'var(--accent)' : 'var(--surface)',
  color: active ? '#ffffff' : 'var(--text-secondary)',
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border-strong)'}`,
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export default function OrdersSection() {
  const { orders = [], updateOrderStatus, setActiveSection, apiLoading, apiError } = useAdmin()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [statusError, setStatusError] = useState('')
  const [actionNotice, setActionNotice] = useState('')

  const filtered = filter === 'all' ? orders : orders.filter(o => {
    const s = String(o.status || '').toLowerCase()
    const f = String(filter).toLowerCase()
    return s === f || (f === 'pendingpayment' && (s === 'pending' || s === 'awaiting_payment'))
  })
  const selectedOrder = orders.find(o => o.id === selected)

  const statusCounts = {
    all: orders.length,
    PendingPayment: orders.filter(o => {
      const s = String(o.status || '').toLowerCase()
      return s === 'pendingpayment' || s === 'pending' || s === 'awaiting_payment'
    }).length,
    PaymentSubmitted: orders.filter(o => {
      const s = String(o.status || '').toLowerCase()
      return s === 'paymentsubmitted' || s === 'submitted'
    }).length,
    Paid: orders.filter(o => String(o.status || '').toLowerCase() === 'paid').length,
    Processing: orders.filter(o => String(o.status || '').toLowerCase() === 'processing').length,
    Shipped:    orders.filter(o => String(o.status || '').toLowerCase() === 'shipped').length,
    Delivered:  orders.filter(o => String(o.status || '').toLowerCase() === 'delivered').length,
    Cancelled:  orders.filter(o => String(o.status || '').toLowerCase() === 'cancelled').length,
    Refunded:   orders.filter(o => String(o.status || '').toLowerCase() === 'refunded').length,
  }

  const handleSelectOrder = (id) => {
    const nextId = selected === id ? null : id
    setSelected(nextId)
    setStatusError('')
    setActionNotice('')

    // Automatically scroll to the status update panel on mobile screens
    if (nextId) {
      setTimeout(() => {
        const el = document.getElementById('mobile-order-status-panel')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 60)
    }
  }

  const handleStatusClick = async (orderId, targetStatusKey) => {
    setStatusUpdatingId(orderId)
    setStatusError('')
    setActionNotice('')
    const res = await updateOrderStatus(orderId, targetStatusKey)
    setStatusUpdatingId(null)
    if (res && !res.success) {
      setStatusError(res.error || 'Failed to update order status.')
    } else {
      setActionNotice(`Order #${orderId} status updated to ${targetStatusKey}`)
    }
  }

  if (apiLoading) {
    return (
      <div className="animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
        }} />
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      <SectionHeader
        title="Orders Management"
        sub={`${orders.length} total orders · ${statusCounts.PendingPayment + statusCounts.PaymentSubmitted} awaiting payment`}
      />

      {actionNotice && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--success-dim)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius)',
          fontSize: 13,
          color: 'var(--success)',
          marginBottom: 20,
          fontWeight: 500,
        }}>
          ✓ {actionNotice}
        </div>
      )}

      {apiError && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: 13, marginBottom: 20 }}>
          Notice: {apiError}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Orders"       value={orders.length} />
        <StatCard label="Pending Payment"    value={statusCounts.PendingPayment + statusCounts.PaymentSubmitted} accent="var(--warning)" />
        <StatCard label="Paid & Processing"  value={statusCounts.Paid + statusCounts.Processing}        accent="var(--success)" />
        <StatCard label="Delivered"          value={statusCounts.Delivered}                             accent="var(--accent)" />
      </div>

      {/* Horizontal Touch Scrollable Filter Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto',
        WebkitOverflowScrolling: 'touch', paddingBottom: 4
      }}>
        <button onClick={() => setFilter('all')} style={filterTabStyle(filter === 'all')}>
          All ({statusCounts.all})
        </button>
        {STATUS_CONFIG.map(item => {
          const count = statusCounts[item.key] || 0
          const active = filter.toLowerCase() === item.key.toLowerCase()
          return (
            <button key={item.key} onClick={() => setFilter(item.key)} style={filterTabStyle(active)}>
              {item.label}{count > 0 ? ` (${count})` : ''}
            </button>
          )
        })}
      </div>

      <div className="responsive-grid-split" style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16 }}>
        {/* Orders Table */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['S/N', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{
                      padding: '12px 14px',
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
                {filtered.map((o, index) => (
                  <tr
                    key={o.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: selected === o.id ? 'rgba(196,98,45,0.04)' : 'transparent',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (selected !== o.id) e.currentTarget.style.background = '#FAFAFA' }}
                    onMouseLeave={e => { if (selected !== o.id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <td
                      style={{ padding: '13px 14px', color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSelectOrder(o.id)}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{ padding: '13px 14px', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}
                      onClick={() => handleSelectOrder(o.id)}
                    >
                      {o.customer}
                    </td>
                    <td style={{ padding: '13px 14px', color: 'var(--text-secondary)' }}>{o.items} items</td>
                    <td style={{ padding: '13px 14px', color: 'var(--text-primary)', fontWeight: 600 }}>₦{Number(o.total || 0).toLocaleString()}</td>
                    
                    {/* Clean Status Badge */}
                    <td style={{ padding: '13px 14px', cursor: 'pointer' }} onClick={() => handleSelectOrder(o.id)}>
                      <StatusBadge status={o.status} />
                    </td>

                    <td style={{ padding: '13px 14px', color: 'var(--text-secondary)' }}>{o.date}</td>
                    <td style={{ padding: '13px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleSelectOrder(o.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', color: selected === o.id ? 'var(--accent)' : 'var(--text-muted)',
                          padding: 4, display: 'inline-flex', alignItems: 'center'
                        }}
                        title="View details"
                      >
                        <svg
                          width="14" height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transform: selected === o.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
                        >
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                      No orders match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Backdrop Overlay when order detail panel is active */}
        {selectedOrder && (
          <div
            onClick={() => { setSelected(null); setStatusError('') }}
            className="desktop-hide"
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(3px)', zIndex: 110
            }}
          />
        )}

        {/* Order Details Panel — Status Update Controls placed FIRST at the top */}
        {selectedOrder && (
          <div
            id="mobile-order-status-panel"
            className="mobile-order-drawer animate-fade-in"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: 20,
              borderRadius: 'var(--radius-lg)',
              alignSelf: 'start',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 3px' }}>Order #{selectedOrder.id}</p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}>
                  Update Order Status
                </p>
              </div>
              <button
                onClick={() => { setSelected(null); setStatusError(''); setActionNotice('') }}
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 6,
                  borderRadius: 4,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* 1. FRONT & CENTER AT THE VERY TOP: Quick Status Action Buttons */}
            {(selectedOrder.status === 'pendingpayment' || selectedOrder.status === 'paymentsubmitted') && (
              <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--accent-dim)', borderRadius: 'var(--radius)', border: '1px solid rgba(196,98,45,0.25)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', margin: '0 0 6px' }}>
                  📄 Payment Approval Required
                </p>
                <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Customer submitted a bank transfer receipt for Order #{selectedOrder.id}. Review and approve payment in the Payments section.
                </p>
                <AdminBtn
                  variant="secondary"
                  onClick={() => setActiveSection('payments')}
                  id="go-to-payments-btn"
                >
                  Go to Payments Section →
                </AdminBtn>
              </div>
            )}

            <div style={{ marginBottom: 18, padding: 14, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Fulfillment Status</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <AdminBtn
                  variant={selectedOrder.status === 'processing' ? 'secondary' : 'ghost'}
                  disabled={statusUpdatingId === selectedOrder.id}
                  onClick={() => handleStatusClick(selectedOrder.id, 'Processing')}
                >
                  Processing
                </AdminBtn>
                <AdminBtn
                  variant={selectedOrder.status === 'shipped' ? 'secondary' : 'ghost'}
                  disabled={statusUpdatingId === selectedOrder.id}
                  onClick={() => handleStatusClick(selectedOrder.id, 'Shipped')}
                >
                  Shipped
                </AdminBtn>
                <AdminBtn
                  variant={selectedOrder.status === 'delivered' ? 'secondary' : 'ghost'}
                  disabled={statusUpdatingId === selectedOrder.id}
                  onClick={() => handleStatusClick(selectedOrder.id, 'Delivered')}
                >
                  Delivered
                </AdminBtn>
                <AdminBtn
                  variant={selectedOrder.status === 'cancelled' ? 'danger' : 'ghost'}
                  disabled={statusUpdatingId === selectedOrder.id}
                  onClick={() => handleStatusClick(selectedOrder.id, 'Cancelled')}
                >
                  Cancelled
                </AdminBtn>
              </div>
            </div>

            {/* Status Selector Dropdown */}
            <div style={{ marginBottom: 18, padding: 14, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Full Status {statusUpdatingId === selectedOrder.id && <span style={{ color: 'var(--accent)' }}>— updating…</span>}
              </label>
              <select
                value={selectedOrder.status || 'pendingpayment'}
                disabled={statusUpdatingId === selectedOrder.id}
                onChange={(e) => handleStatusClick(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {STATUS_CONFIG.map(sc => (
                  <option key={sc.key} value={sc.key}>{sc.label} — {sc.desc}</option>
                ))}
              </select>
            </div>

            {/* Status Error Notification */}
            {statusError && (
              <div style={{
                background: 'var(--danger-dim)',
                border: '1px solid rgba(208,49,49,0.2)',
                padding: '10px 12px',
                marginBottom: 16,
                fontSize: 12,
                color: 'var(--danger)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {statusError}
              </div>
            )}

            {/* Customer Information (Below Status Update Controls) */}
            <div style={{ marginBottom: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 4px' }}>Customer</p>
              <p style={{ fontSize: 13.5, color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{selectedOrder.customer}</p>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{selectedOrder.email}</p>
            </div>

            {/* Order Summary Attributes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Total Amount', value: `₦${Number(selectedOrder.total || 0).toLocaleString()}` },
                { label: 'Items Count', value: `${selectedOrder.items} units` },
                { label: 'Country', value: selectedOrder.country },
                { label: 'Order Date', value: selectedOrder.date },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}>
                  <p style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
