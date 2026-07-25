import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard } from './DashboardOverview'

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersSection() {
  const { orders, updateOrderStatus, stats } = useAdmin()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const selectedOrder = orders.find(o => o.id === selected)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'awaiting_payment').length,
    paid: orders.filter(o => o.status === 'paid').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Order Management"
        sub={`${orders.length} total orders recorded · ${statusCounts.pending} require processing`}
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="Total Orders" value={orders.length} icon="◎" />
        <StatCard label="Pending Orders" value={statusCounts.pending} accent="#d97706" icon="⏳" />
        <StatCard label="Paid & Shipped" value={statusCounts.paid + statusCounts.shipped} accent="#16a34a" icon="✓" />
        <StatCard label="Delivered" value={statusCounts.delivered} accent="#968574" icon="📦" />
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '9px 16px', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", borderRadius: 4,
            background: filter === s ? '#968574' : '#ffffff',
            color: filter === s ? '#ffffff' : 'rgba(30,31,33,0.6)',
            border: `1px solid ${filter === s ? '#968574' : 'rgba(30,31,33,0.12)'}`,
            transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            {s.replace('_', ' ')} {statusCounts[s] > 0 && `(${statusCounts[s]})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
        {/* Orders Table */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(30,31,33,0.08)', background: '#FAF9F6' }}>
                  {['Order ID', 'Customer', 'Country', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}
                    style={{
                      borderBottom: '1px solid rgba(30,31,33,0.04)',
                      background: selected === o.id ? 'rgba(150,133,116,0.08)' : 'none',
                      cursor: 'pointer', transition: 'background 0.15s'
                    }}
                    onClick={() => setSelected(selected === o.id ? null : o.id)}
                    onMouseEnter={e => { if (selected !== o.id) e.currentTarget.style.background = 'rgba(150,133,116,0.03)' }}
                    onMouseLeave={e => { if (selected !== o.id) e.currentTarget.style.background = 'none' }}
                  >
                    <td style={{ padding: '14px 18px', color: '#968574', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>{o.id}</td>
                    <td style={{ padding: '14px 18px', color: '#1E1F21', fontWeight: 600 }}>{o.customer}</td>
                    <td style={{ padding: '14px 18px', color: 'rgba(30,31,33,0.6)' }}>{o.country}</td>
                    <td style={{ padding: '14px 18px', color: 'rgba(30,31,33,0.7)', fontWeight: 500 }}>{o.items} items</td>
                    <td style={{ padding: '14px 18px', color: '#1E1F21', fontWeight: 700 }}>₦{Number(o.total || 0).toLocaleString()}</td>
                    <td style={{ padding: '14px 18px' }}><StatusBadge status={o.status} /></td>
                    <td style={{ padding: '14px 18px', color: 'rgba(30,31,33,0.5)' }}>{o.date}</td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <span style={{ fontSize: 14, color: '#968574', fontWeight: 700 }}>{selected === o.id ? '▼' : '▶'}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '50px 18px', textAlign: 'center', color: 'rgba(30,31,33,0.5)', fontSize: 13 }}>No orders match the selected filter status.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Drawer Panel */}
        {selectedOrder && (
          <div style={{
            background: '#ffffff', border: '1px solid rgba(30,31,33,0.1)',
            padding: 28, borderRadius: 8, alignSelf: 'start', boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
          }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '1px solid rgba(30,31,33,0.06)', pb: 16 }}>
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 4px', fontWeight: 700 }}>Order Specification</p>
                <p style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21', margin: 0 }}>{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(30,31,33,0.4)', fontSize: 20 }}>×</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', margin: '0 0 4px', fontWeight: 600 }}>Customer Info</p>
              <p style={{ fontSize: 14, color: '#1E1F21', margin: 0, fontWeight: 600 }}>{selectedOrder.customer}</p>
              <p style={{ fontSize: 12, color: 'rgba(30,31,33,0.6)', margin: '2px 0 0' }}>{selectedOrder.email}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Total Amount', value: `₦${Number(selectedOrder.total || 0).toLocaleString()}` },
                { label: 'Total Items', value: `${selectedOrder.items} units` },
                { label: 'Country', value: selectedOrder.country },
                { label: 'Order Date', value: selectedOrder.date },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#FAF9F6', padding: '10px 14px', borderRadius: 4, border: '1px solid rgba(30,31,33,0.06)' }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#1E1F21', margin: 0, fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Status Update Options */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#968574', margin: '0 0 12px', fontWeight: 700 }}>Update Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STATUS_OPTIONS.map(s => {
                  const active = String(selectedOrder.status).toLowerCase() === s
                  return (
                    <button
                      key={s}
                      onClick={() => updateOrderStatus(selectedOrder.id, s.charAt(0).toUpperCase() + s.slice(1))}
                      style={{
                        padding: '10px 14px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                        fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", borderRadius: 4,
                        background: active ? '#968574' : '#FAF9F6',
                        color: active ? '#ffffff' : 'rgba(30,31,33,0.7)',
                        border: `1px solid ${active ? '#968574' : 'rgba(30,31,33,0.1)'}`,
                        textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{s}</span>
                      {active && <span>✓ Active</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
