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
    const nameStr  = c.name  ? String(c.name).toLowerCase()  : ''
    const emailStr = c.email ? String(c.email).toLowerCase() : ''
    const searchStr = search ? String(search).toLowerCase()  : ''
    const matchSearch = nameStr.includes(searchStr) || emailStr.includes(searchStr)
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const totalSpent   = onlyCustomers.reduce((s, c) => s + (c.totalSpent || 0), 0)
  const totalOrders  = onlyCustomers.reduce((s, c) => s + (c.orders || 0), 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0

  const filterBtnStyle = (active) => ({
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: active ? 500 : 400,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: 'var(--radius)',
    background: active ? 'var(--accent)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--text-secondary)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border-strong)'}`,
    transition: 'all 0.15s',
    textTransform: 'capitalize',
  })

  return (
    <div className="animate-fade-up">
      <SectionHeader
        title="Customers"
        sub={`${onlyCustomers.length} registered accounts`}
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Customers"  value={onlyCustomers.length} />
        <StatCard label="Lifetime Revenue" value={`₦${totalSpent.toLocaleString()}`} accent="var(--success)" />
        <StatCard label="Avg. Order Value" value={`₦${avgOrderValue.toLocaleString()}`} />
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="customer-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              padding: '8px 14px 8px 36px',
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              width: 280,
              borderRadius: 'var(--radius)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
          />
        </div>
        {['all', 'active', 'inactive', 'vip'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={filterBtnStyle(filter === f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Customer Cards */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 13,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          No customers found matching your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(c => (
            <div
              key={c.id}
              className="card-lift"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '20px 22px',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {/* Customer header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: c.status === 'vip' ? 'var(--accent-dim)' : '#F0F0F0',
                  border: `1px solid ${c.status === 'vip' ? 'rgba(196,98,45,0.3)' : 'var(--border)'}`,
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.status === 'vip' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderRadius: '50%',
                }}>
                  {c.name && c.name.length > 0 ? c.name[0].toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.email}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Orders', value: c.orders },
                  { label: 'Spent',  value: `₦${Number(c.totalSpent || 0).toLocaleString()}` },
                  { label: 'Joined', value: String(c.joined).slice(0, 7) },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'var(--bg)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                  }}>
                    <p style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 2px' }}>{label}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{value}</p>
                  </div>
                ))}
              </div>

              <AdminBtn variant="ghost" onClick={() => setSelectedCustomer(c)} id={`view-customer-${c.id}`}>
                View profile
              </AdminBtn>
            </div>
          ))}
        </div>
      )}

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20,
        }}>
          <div style={{
            background: 'var(--surface)',
            width: '100%',
            maxWidth: 520,
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
          }} className="animate-fade-in">
            {/* Modal header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 2px' }}>Profile</p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 600,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}>
                  Customer Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 6,
                  borderRadius: 'var(--radius)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F0F0F0'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                <div style={{
                  width: 58,
                  height: 58,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedCustomer.status === 'vip' ? 'var(--accent-dim)' : '#F0F0F0',
                  border: `1px solid ${selectedCustomer.status === 'vip' ? 'rgba(196,98,45,0.3)' : 'var(--border)'}`,
                  fontSize: 22,
                  fontWeight: 600,
                  color: selectedCustomer.status === 'vip' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderRadius: '50%',
                }}>
                  {selectedCustomer.name && selectedCustomer.name.length > 0 ? selectedCustomer.name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                    {selectedCustomer.name}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px' }}>{selectedCustomer.email}</p>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
              </div>

              {/* Detail grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'First Name',   value: selectedCustomer.firstName   || 'N/A' },
                  { label: 'Last Name',    value: selectedCustomer.lastName    || 'N/A' },
                  { label: 'Phone Number', value: selectedCustomer.phoneNumber || 'N/A' },
                  { label: 'Account Role', value: selectedCustomer.role        || 'Customer' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'var(--bg)',
                    padding: '12px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 3px' }}>{label}</p>
                    <p style={{ fontSize: 13.5, color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AdminBtn variant="ghost" onClick={() => setSelectedCustomer(null)}>Close</AdminBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
