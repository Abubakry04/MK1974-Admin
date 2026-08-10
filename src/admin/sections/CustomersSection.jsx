import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn, StatCard } from './DashboardOverview'

export default function CustomersSection() {
  const { customers = [] } = useAdmin()
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const onlyCustomers = customers.filter(c => {
    if (!c.role) return true
    const r = String(c.role).toLowerCase()
    return r !== 'admin' && r !== 'super admin' && r !== '1'
  })

  const filtered = onlyCustomers.filter(c => {
    const nameStr  = c.name  ? String(c.name).toLowerCase()  : ''
    const emailStr = c.email ? String(c.email).toLowerCase() : ''
    const phoneStr = c.phoneNumber ? String(c.phoneNumber).toLowerCase() : ''
    const searchStr = search ? String(search).toLowerCase()  : ''
    return nameStr.includes(searchStr) || emailStr.includes(searchStr) || phoneStr.includes(searchStr)
  })

  return (
    <div className="animate-fade-up">
      <SectionHeader
        title="Customers"
        sub={`${onlyCustomers.length} registered customer accounts`}
      />

      {/* KPI Cards — ONLY account metrics, NO money */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* <StatCard label="Total Registered Customers" value={onlyCustomers.length} /> */}
        <StatCard label="Active Accounts" value={onlyCustomers.length} accent="var(--accent)" />
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
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
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              padding: '9px 14px 9px 36px',
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              borderRadius: 'var(--radius)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
          />
        </div>
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
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(196,98,45,0.25)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  borderRadius: '50%',
                }}>
                  {c.name && c.name.length > 0 ? c.name[0].toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.email}
                  </p>
                </div>
              </div>

              {/* Account info grid — Phone number & Account role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Phone Number', value: c.phoneNumber || 'N/A' },
                  { label: 'Account Role', value: c.role || 'Customer' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'var(--bg)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                  }}>
                    <p style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 2px' }}>{label}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-primary)', margin: 0, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
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
            maxWidth: 500,
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
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 2px' }}>Customer Profile</p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 600,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}>
                  {selectedCustomer.name}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 54,
                  height: 54,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(196,98,45,0.25)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  borderRadius: '50%',
                }}>
                  {selectedCustomer.name && selectedCustomer.name.length > 0 ? selectedCustomer.name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                    {selectedCustomer.name}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{selectedCustomer.email}</p>
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
