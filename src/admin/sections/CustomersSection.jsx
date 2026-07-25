import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard } from './DashboardOverview'

export default function CustomersSection() {
  const { customers } = useAdmin()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const onlyCustomers = customers.filter(c => {
    if (!c.role) return true
    const r = String(c.role).toLowerCase()
    return r !== 'admin' && r !== 'super admin' && r !== '1'
  })

  const filtered = onlyCustomers.filter(c => {
    const nameStr = c.name ? String(c.name).toLowerCase() : ''
    const emailStr = c.email ? String(c.email).toLowerCase() : ''
    const searchStr = search ? String(search).toLowerCase() : ''
    const matchSearch = nameStr.includes(searchStr) || emailStr.includes(searchStr)
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const vipCount = onlyCustomers.filter(c => c.status === 'vip').length
  const totalSpent = onlyCustomers.reduce((s, c) => s + (c.totalSpent || 0), 0)
  const totalOrders = onlyCustomers.reduce((s, c) => s + (c.orders || 0), 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0

  return (
    <div>
      <SectionHeader title="Customers" sub={`${onlyCustomers.length} registered customers`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Customers" value={onlyCustomers.length} icon="◈" />
        {/* <StatCard label="VIP Customers" value={vipCount} accent="#c8f542" icon="★" /> */}
        <StatCard label="Lifetime Revenue" value={`₦${totalSpent.toLocaleString()}`} accent="#4ade80" icon="₦" />
        <StatCard label="Avg. Order Value" value={`₦${avgOrderValue}`} icon="◎" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          id="customer-search"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#ffffff', border: '1px solid rgba(30,31,33,0.1)',
            color: '#1E1F21', padding: '9px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif",
            outline: 'none', width: 240, borderRadius: 4
          }}
        />
        {['all', 'active', 'inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 14px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            background: filter === f ? '#968574' : '#ffffff',
            color: filter === f ? '#ffffff' : 'rgba(30,31,33,0.5)',
            border: filter === f ? '1px solid #968574' : '1px solid rgba(30,31,33,0.1)',
            transition: 'all 0.15s', borderRadius: 4
          }}>{f}</button>
        ))}
      </div>

      {/* Customer Cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(30,31,33,0.4)', fontSize: 13, background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', borderRadius: 6 }}>
          No customers found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(c => (
            <div key={c.id} style={{
              background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
              padding: '22px 24px', transition: 'border-color 0.2s', borderRadius: 6
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#968574'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(30,31,33,0.08)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: c.status === 'vip' ? 'rgba(150,133,116,0.1)' : 'rgba(30,31,33,0.04)',
                  border: `1px solid ${c.status === 'vip' ? 'rgba(150,133,116,0.3)' : 'rgba(30,31,33,0.08)'}`,
                  fontSize: 14, fontWeight: 700, color: c.status === 'vip' ? '#968574' : 'rgba(30,31,33,0.5)',
                  borderRadius: 20
                }}>
                  {c.name && c.name.length > 0 ? c.name[0].toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1E1F21', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.5)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Orders', value: c.orders },
                  { label: 'Spent', value: `₦${c.totalSpent}` },
                  { label: 'Joined', value: String(c.joined).slice(0, 7) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 3px', fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: 12, color: '#1E1F21', margin: 0, fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
              </div>
              <AdminBtn variant="ghost" onClick={() => setSelectedCustomer(c)} id={`view-customer-${c.id}`}>View Profile</AdminBtn>
            </div>
          ))}
        </div>
      )}

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(30,31,33,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20
        }}>
          <div style={{
            background: '#FAF9F6', width: '100%', maxWidth: 500,
            borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(30,31,33,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontStyle: 'italic', margin: 0, color: '#1E1F21' }}>Customer Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'rgba(30,31,33,0.4)' }}>×</button>
            </div>
            <div style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{
                  width: 64, height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selectedCustomer.status === 'vip' ? 'rgba(150,133,116,0.15)' : 'rgba(30,31,33,0.06)',
                  border: `1px solid ${selectedCustomer.status === 'vip' ? 'rgba(150,133,116,0.4)' : 'rgba(30,31,33,0.1)'}`,
                  fontSize: 24, fontWeight: 700, color: selectedCustomer.status === 'vip' ? '#968574' : 'rgba(30,31,33,0.5)',
                  borderRadius: '50%'
                }}>
                  {selectedCustomer.name && selectedCustomer.name.length > 0 ? selectedCustomer.name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1E1F21', margin: '0 0 6px' }}>{selectedCustomer.name}</h2>
                  <p style={{ fontSize: 13, color: 'rgba(30,31,33,0.6)', margin: '0 0 8px' }}>{selectedCustomer.email}</p>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div style={{ background: '#ffffff', padding: 16, border: '1px solid rgba(30,31,33,0.08)', borderRadius: 6 }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 6px', fontWeight: 500 }}>First Name</p>
                  <p style={{ fontSize: 14, color: '#1E1F21', margin: 0, fontWeight: 500 }}>{selectedCustomer.firstName || 'N/A'}</p>
                </div>
                <div style={{ background: '#ffffff', padding: 16, border: '1px solid rgba(30,31,33,0.08)', borderRadius: 6 }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 6px', fontWeight: 500 }}>Last Name</p>
                  <p style={{ fontSize: 14, color: '#1E1F21', margin: 0, fontWeight: 500 }}>{selectedCustomer.lastName || 'N/A'}</p>
                </div>
                <div style={{ background: '#ffffff', padding: 16, border: '1px solid rgba(30,31,33,0.08)', borderRadius: 6 }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 6px', fontWeight: 500 }}>Phone Number</p>
                  <p style={{ fontSize: 14, color: '#1E1F21', margin: 0, fontWeight: 500 }}>{selectedCustomer.phoneNumber || 'N/A'}</p>
                </div>
                <div style={{ background: '#ffffff', padding: 16, border: '1px solid rgba(30,31,33,0.08)', borderRadius: 6 }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.4)', margin: '0 0 6px', fontWeight: 500 }}>Email Address</p>
                  <p style={{ fontSize: 14, color: '#1E1F21', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedCustomer.email || 'N/A'}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <AdminBtn variant="ghost" onClick={() => setSelectedCustomer(null)}>Close</AdminBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
