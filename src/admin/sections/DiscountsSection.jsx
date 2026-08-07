import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn, StatCard } from './DashboardOverview'

export default function DiscountsSection() {
  const { discounts = [], toggleDiscount } = useAdmin()
  const [showForm, setShowForm] = useState(false)

  const active = discounts.filter(d => d.status === 'active').length
  const totalUsed = discounts.reduce((s, d) => s + (d.used || 0), 0)

  return (
    <div>
      <SectionHeader
        title="Discounts & Vouchers"
        sub={`${discounts.length} promotional discount codes`}
        action={<AdminBtn id="add-discount-btn" variant="secondary" onClick={() => setShowForm(s => !s)}>+ New Code</AdminBtn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Active Codes" value={active} accent="var(--success)" />
        <StatCard label="Total Uses"   value={totalUsed.toLocaleString()} />
        <StatCard label="Total Codes"  value={discounts.length} />
      </div>

      {/* New code form */}
      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 28, marginBottom: 24, borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 20px', fontWeight: 600 }}>Create Discount Code</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Code', placeholder: 'e.g. SUMMER25', id: 'dc-code' },
              { label: 'Discount %', placeholder: '20', id: 'dc-pct' },
              { label: 'Usage Limit', placeholder: '500 (leave blank = unlimited)', id: 'dc-limit' },
              { label: 'Expiry Date', placeholder: 'YYYY-MM-DD', id: 'dc-expiry' },
            ].map(f => (
              <div key={f.id}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                <input id={f.id} placeholder={f.placeholder} style={{
                  width: '100%', background: 'var(--bg)', border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)', padding: '10px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  outline: 'none', boxSizing: 'border-box', borderRadius: 'var(--radius)',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <AdminBtn variant="secondary" id="create-discount-btn">Create Code</AdminBtn>
            <AdminBtn variant="ghost" onClick={() => setShowForm(false)}>Cancel</AdminBtn>
          </div>
        </div>
      )}

      {discounts.length === 0 && (
        <div style={{
          padding: '48px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 13,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          Notice: No promotional discount codes created yet. Click "+ New Code" above to generate a promo code.
        </div>
      )}

      {/* Code list */}
      {discounts.length > 0 && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#FAFAFA' }}>
                {['Code', 'Value', 'Usage', 'Expiry', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{d.code}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--accent)', fontWeight: 600 }}>{d.type === 'percentage' ? `${d.value}%` : `₦${d.value}`}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{d.used} {d.limit ? `/ ${d.limit}` : 'uses'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{d.expires || 'No expiry'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      background: d.status === 'active' ? 'var(--success-dim)' : 'var(--danger-dim)',
                      color: d.status === 'active' ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <AdminBtn variant="ghost" onClick={() => toggleDiscount(d.id)}>
                      {d.status === 'active' ? 'Deactivate' : 'Activate'}
                    </AdminBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
