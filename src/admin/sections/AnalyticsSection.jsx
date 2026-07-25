import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatCard, BarChart } from './DashboardOverview'

export default function AnalyticsSection() {
  const { analytics } = useAdmin()

  const totalRevenue = analytics.revenue.reduce((s, v) => s + v, 0)
  const totalOrders = analytics.orders.reduce((s, v) => s + v, 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const conversionRate = '3.4%'

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Analytics & Store Intelligence"
        sub="Performance metrics and sales breakdown across the last 12 months"
      />

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="Annual Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}k`} accent="#968574" growth="18.2%" icon="₦" />
        <StatCard label="Annual Orders" value={totalOrders} growth="12.5%" icon="◎" />
        <StatCard label="Avg. Order Value" value={`₦${avgOrderValue.toLocaleString()}`} icon="◈" />
        <StatCard label="Conversion Rate" value={conversionRate} accent="#16a34a" growth="0.4%" icon="%" />
      </div>

      {/* Revenue & Orders charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 4px', fontWeight: 700 }}>Revenue Trend</p>
          <p style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21', margin: '0 0 20px' }}>₦{totalRevenue.toLocaleString()}</p>
          <BarChart data={analytics.revenue} labels={analytics.months} color="#968574" prefix="₦" height={160} />
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 4px', fontWeight: 700 }}>Monthly Volume</p>
          <p style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21', margin: '0 0 20px' }}>{totalOrders} Orders</p>
          <BarChart data={analytics.orders} labels={analytics.months} color="#3b82f6" height={160} />
        </div>
      </div>

      {/* Product Rankings & Traffic Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top Products */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 20px', fontWeight: 700 }}>Best Selling Items</p>
          {analytics.topProducts.map((p, i) => (
            <div key={p.name} style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#968574', width: 24, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>₦{p.revenue.toLocaleString()}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(30,31,33,0.06)', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: '#968574', width: `${(p.sold / analytics.topProducts[0].sold) * 100}%`, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 10, color: 'rgba(30,31,33,0.5)', marginTop: 2, display: 'block' }}>{p.sold} units sold</span>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Channels */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 20px', fontWeight: 700 }}>Traffic & Acquisition</p>
          {analytics.traffic.map((t, i) => (
            <div key={t.source} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 500 }}>{t.source}</span>
                <span style={{ fontSize: 12, color: '#968574', fontWeight: 700 }}>{t.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(30,31,33,0.06)', borderRadius: 3 }}>
                <div style={{
                  height: '100%',
                  background: ['#968574', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'][i],
                  width: `${t.pct}%`,
                  borderRadius: 3
                }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(30,31,33,0.08)' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#968574', margin: '0 0 12px', fontWeight: 700 }}>Orders Demographics</p>
            {[
              { country: '🇳🇬 Nigeria', pct: 68 },
              { country: '🇬🇧 United Kingdom', pct: 16 },
              { country: '🇺🇸 United States', pct: 9 },
              { country: '🇨🇦 Canada', pct: 4 },
              { country: '🌍 Other Global', pct: 3 },
            ].map(c => (
              <div key={c.country} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(30,31,33,0.7)', fontWeight: 500 }}>{c.country}</span>
                <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 700 }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
