import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn, StatCard } from './DashboardOverview'

export default function InventorySection() {
  const { products, apiLoading, fetchAllApiData } = useAdmin()

  const inStock = products.filter(p => (p.stockQuantity || 0) > 0).length
  const outOfStock = products.filter(p => (p.stockQuantity || 0) === 0).length
  const lowStock = products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length
  const totalVariantSkus = products.reduce((s, p) => s + (p.variants?.length || 0), 0)

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Inventory Control"
        sub={apiLoading ? 'Syncing stock from live API...' : `Tracking stock levels across ${products.length} product items`}
        action={<AdminBtn variant="ghost" onClick={fetchAllApiData} id="refresh-inventory-btn">↻ Refresh Stock</AdminBtn>}
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="In Stock Items" value={inStock} accent="#16a34a" icon="✓" />
        <StatCard label="Out of Stock" value={outOfStock} accent="#dc2626" icon="✕" />
        <StatCard label="Low Stock Warning" value={lowStock} sub="Less than 10 units" accent="#d97706" icon="⚠" />
        <StatCard label="Total SKU Variants" value={totalVariantSkus} sub="Configured variants" icon="◈" />
      </div>

      {/* Inventory Table */}
      <div style={{
        background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
        padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700 }}>Stock Health</p>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E1F21', margin: '4px 0 0' }}>Product Inventory Levels</h3>
          </div>
        </div>

        {apiLoading && products.length === 0 ? (
          <p style={{ color: 'rgba(30,31,33,0.5)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>Syncing live inventory data...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(30,31,33,0.08)', background: '#FAF9F6' }}>
                  {['Product Name', 'Product ID', 'Categories', 'Variants', 'Stock Qty', 'Stock Meter'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const qty = p.stockQuantity ?? 0
                  const level = qty === 0 ? 'out' : qty < 10 ? 'low' : 'ok'
                  const maxQty = Math.max(...products.map(x => x.stockQuantity ?? 0), 1)
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(30,31,33,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(150,133,116,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <td style={{ padding: '14px 18px', color: '#1E1F21', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '14px 18px', color: '#968574', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>#{p.id}</td>
                      <td style={{ padding: '14px 18px', color: 'rgba(30,31,33,0.6)', fontSize: 11 }}>
                        {(p.categories || []).map(c => c.name).join(', ') || 'General'}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'rgba(30,31,33,0.7)', fontWeight: 500 }}>
                        {p.variants?.length ?? 0} variants
                      </td>
                      <td style={{
                        padding: '14px 18px', fontWeight: 700,
                        color: level === 'out' ? '#dc2626' : level === 'low' ? '#d97706' : '#16a34a'
                      }}>
                        {qty} units
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ height: 6, width: 100, background: 'rgba(30,31,33,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.min((qty / maxQty) * 100, 100)}%`,
                            background: level === 'out' ? '#dc2626' : level === 'low' ? '#d97706' : '#968574',
                            borderRadius: 3
                          }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '40px 18px', textAlign: 'center', color: 'rgba(30,31,33,0.5)', fontSize: 13 }}>No product inventory records available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
