import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn, StatCard } from './DashboardOverview'

export default function InventorySection() {
  const { products, apiLoading, fetchAllApiData } = useAdmin()

  const inStock = products.filter(p => (p.stockQuantity || 0) > 0).length
  const outOfStock = products.filter(p => (p.stockQuantity || 0) === 0).length
  const lowStock = products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Inventory Control"
        sub={apiLoading ? 'Syncing stock from live API...' : `Tracking stock levels across ${products.length} product items`}
        action={<AdminBtn variant="ghost" onClick={() => fetchAllApiData(false)} id="refresh-inventory-btn">↻ Refresh Stock</AdminBtn>}
      />

      {/* KPI Cards — NO Variants card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="In Stock Items" value={inStock} accent="var(--success)" />
        <StatCard label="Out of Stock" value={outOfStock} accent="var(--danger)" />
        <StatCard label="Low Stock Warning" value={lowStock} sub="Less than 10 units" accent="var(--warning)" />
      </div>

      {/* Inventory Table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        padding: 24, borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0, fontWeight: 600 }}>Stock Health</p>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>Product Inventory Levels</h3>
          </div>
        </div>

        {apiLoading && products.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>Syncing live inventory data...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#FAF9F6' }}>
                  {['Product Name', 'Categories', 'Stock Qty', 'Stock Meter'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const qty = p.stockQuantity ?? 0
                  const level = qty === 0 ? 'out' : qty < 10 ? 'low' : 'ok'
                  const maxQty = Math.max(...products.map(x => x.stockQuantity ?? 0), 1)
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 18px', color: 'var(--text-primary)', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 12 }}>
                        {(p.categories || []).map(c => typeof c === 'string' ? c : c.name).join(', ') || 'General'}
                      </td>
                      <td style={{
                        padding: '14px 18px', fontWeight: 600,
                        color: level === 'out' ? 'var(--danger)' : level === 'low' ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {qty} units
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ height: 6, width: 120, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.min((qty / maxQty) * 100, 100)}%`,
                            background: level === 'out' ? 'var(--danger)' : level === 'low' ? 'var(--warning)' : 'var(--accent)',
                            borderRadius: 3
                          }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '40px 18px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>No product inventory records available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
