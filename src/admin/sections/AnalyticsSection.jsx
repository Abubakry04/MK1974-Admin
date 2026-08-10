import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatCard, BarChart } from './DashboardOverview'

export default function AnalyticsSection() {
  const { analytics, dashboardSummary, orders = [], products = [] } = useAdmin()

  const revenueData = analytics?.revenue || Array(12).fill(0)
  const ordersData = analytics?.orders || Array(12).fill(0)
  const monthsData = analytics?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const topProductsData = analytics?.topProducts || []
  const trafficData = analytics?.traffic || [
    { source: 'Direct Storefront', pct: 65 },
    { source: 'Organic Search', pct: 20 },
    { source: 'Social Media', pct: 15 },
  ]

  const totalRevenue = dashboardSummary?.totalRevenue ?? orders.reduce((s, o) => s + (Number(o.total) || 0), 0)
  const totalOrders = dashboardSummary?.totalOrders ?? orders.length
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const conversionRate = totalOrders > 0 ? '4.2%' : '0.0%'

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Reports & Analytics"
        sub="Performance metrics and live sales breakdown synced with API"
      />

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Sales Revenue" value={`₦${totalRevenue.toLocaleString()}`} accent="var(--accent)" />
        <StatCard label="Recorded Orders"     value={totalOrders} />
        <StatCard label="Avg. Order Value"    value={`₦${avgOrderValue.toLocaleString()}`} />
        <StatCard label="Active Catalogue"    value={products.length} sub="Catalogue items" />
      </div>

      {/* Revenue & Orders charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 4px', fontWeight: 600 }}>Revenue Trend</p>
          <p style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 18px' }}>₦{totalRevenue.toLocaleString()}</p>
          <BarChart data={revenueData} labels={monthsData} prefix="₦" height={160} />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 4px', fontWeight: 600 }}>Monthly Volume</p>
          <p style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 18px' }}>{totalOrders} Orders</p>
          <BarChart data={ordersData} labels={monthsData} height={160} />
        </div>
      </div>

      {/* Product Rankings & Traffic Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Top Products */}
        {/* <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px', fontWeight: 600 }}>Best Selling Items</p>
          {topProductsData.length > 0 ? (
            topProductsData.map((p, i) => (
              <div key={p.name || i} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', width: 24, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>₦{Number(p.revenue || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${((p.sold || 1) / (topProductsData[0]?.sold || 1)) * 100}%`, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>{p.sold || 0} units sold</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              Notice: No top selling product analytics recorded yet. Live API synced.
            </div>
          )}
        </div> */}

        {/* Traffic Channels */}
        {/* <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px', fontWeight: 600 }}>Traffic & Acquisition</p>
          {trafficData.map((t, i) => (
            <div key={t.source} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{t.source}</span>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{t.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3 }}>
                <div style={{
                  height: '100%',
                  background: ['var(--accent)', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'][i % 5],
                  width: `${t.pct}%`,
                  borderRadius: 3
                }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 12px', fontWeight: 600 }}>Orders Demographics</p>
            {[
              { country: '🇳🇬 Nigeria', pct: 82 },
              { country: '🇬🇧 United Kingdom', pct: 10 },
              { country: '🇺🇸 United States', pct: 5 },
              { country: '🌍 Other Global', pct: 3 },
            ].map(c => (
              <div key={c.country} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{c.country}</span>
                <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 600 }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  )
}
