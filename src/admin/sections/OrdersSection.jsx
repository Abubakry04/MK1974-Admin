import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard, Table } from './DashboardOverview'

const STATUS_OPTIONS = ['pending', 'paid', 'failed', 'cancelled', 'refunded']

export default function OrdersSection() {
  const { orders, updateOrderStatus, stats } = useAdmin()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const selectedOrder = orders.find(o => o.id === selected)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    failed: orders.filter(o => o.status === 'failed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    refunded: orders.filter(o => o.status === 'refunded').length,
  }

  return (
    <div>
      <SectionHeader title="Orders" sub={`${orders.length} total orders · ${stats.pendingOrders} require action`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        <StatCard label="Total" value={orders.length} icon="◎" />
        <StatCard label="Pending" value={statusCounts.pending} accent="#f87171" icon="⏳" />
        <StatCard label="Paid" value={statusCounts.paid} accent="#4ade80" icon="✓" />
        <StatCard label="Cancelled" value={statusCounts.cancelled} accent="#9ca3af" icon="✕" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 14px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            background: filter === s ? '#968574' : '#ffffff',
            color: filter === s ? '#ffffff' : 'rgba(30,31,33,0.5)',
            border: filter === s ? '1px solid #968574' : '1px solid rgba(30,31,33,0.1)',
            transition: 'all 0.15s', borderRadius: 4
          }}>{s.replace('_', ' ')} {statusCounts[s] > 0 && `(${statusCounts[s]})`}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 16 }}>
        {/* Orders list */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', borderRadius: 6 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(30,31,33,0.08)', background: '#FAF9F6' }}>
                  {['Order ID', 'Customer', 'Country', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}
                    style={{ borderBottom: '1px solid rgba(30,31,33,0.04)', background: selected === o.id ? 'rgba(150,133,116,0.05)' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                    onClick={() => setSelected(selected === o.id ? null : o.id)}
                    onMouseEnter={e => { if (selected !== o.id) e.currentTarget.style.background = 'rgba(30,31,33,0.02)' }}
                    onMouseLeave={e => { if (selected !== o.id) e.currentTarget.style.background = 'none' }}
                  >
                    <td style={{ padding: '14px 16px', color: '#968574', fontFamily: 'monospace', fontSize: 11, fontWeight: 600 }}>{o.id}</td>
                    <td style={{ padding: '14px 16px', color: '#1E1F21', fontWeight: 500 }}>{o.customer}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(30,31,33,0.6)' }}>{o.country}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(30,31,33,0.6)' }}>{o.items}</td>
                    <td style={{ padding: '14px 16px', color: '#1E1F21', fontWeight: 500 }}>₦{o.total}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={o.status} /></td>
                    <td style={{ padding: '14px 16px', color: 'rgba(30,31,33,0.4)' }}>{o.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 14, color: 'rgba(30,31,33,0.3)' }}>{selected === o.id ? '›' : '›'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order detail panel */}
        {selectedOrder && (
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 24, borderRadius: 6, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 4px', fontWeight: 500 }}>Order</p>
                <p style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21', margin: 0 }}>{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(30,31,33,0.4)', fontSize: 18 }}>×</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 6px', fontWeight: 500 }}>Customer</p>
              <p style={{ fontSize: 13, color: '#1E1F21', margin: 0, fontWeight: 500 }}>{selectedOrder.customer}</p>
              <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.5)', margin: '2px 0 0' }}>{selectedOrder.email}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total', value: `₦${selectedOrder.total}` },
                { label: 'Items', value: selectedOrder.items },
                { label: 'Country', value: selectedOrder.country },
                { label: 'Date', value: selectedOrder.date },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(30,31,33,0.03)', padding: '10px 12px', borderRadius: 4 }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 4px', fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#1E1F21', margin: 0, fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 10px', fontWeight: 500 }}>Update Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s.charAt(0).toUpperCase() + s.slice(1))} style={{
                    padding: '8px 12px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                    background: selectedOrder.status === s ? '#968574' : '#ffffff',
                    color: selectedOrder.status === s ? '#ffffff' : 'rgba(30,31,33,0.5)',
                    border: selectedOrder.status === s ? '1px solid #968574' : '1px solid rgba(30,31,33,0.1)',
                    textAlign: 'left',
                    transition: 'all 0.15s', borderRadius: 4
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
