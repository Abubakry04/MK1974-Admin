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
        sub="Performance metrics and live sales breakdown"
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
    </div>
  )
}
