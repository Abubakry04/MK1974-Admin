import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard } from './DashboardOverview'

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i <= rating ? '#F59E0B' : 'none'}
          stroke={i <= rating ? '#F59E0B' : 'var(--border-strong)'}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  const { reviews = [], approveReview, deleteReview } = useAdmin()

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
  const pending = reviews.filter(r => r.status === 'pending')
  const approved = reviews.filter(r => r.status === 'approved')

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Customer Reviews"
        sub={`${reviews.length} total customer feedback entries · ${pending.length} pending moderation`}
      />

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Reviews"       value={reviews.length} />
        <StatCard label="Awaiting Moderation" value={pending.length} accent={pending.length > 0 ? "var(--warning)" : "var(--text-primary)"} />
        <StatCard label="Approved Reviews"   value={approved.length} accent="var(--success)" />
        <StatCard label="Average Rating"     value={avgRating} accent="var(--accent)" />
      </div>

      {reviews.length === 0 ? (
        <div style={{
          padding: '48px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 13,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          No reviews available yet.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#FAFAFA' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Rating</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Comment</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{r.author}</td>
                  <td style={{ padding: '12px 16px' }}><StarRating rating={r.rating} /></td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{r.comment}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {r.status === 'pending' && (
                      <AdminBtn variant="ghost" onClick={() => approveReview?.(r.id)}>Approve</AdminBtn>
                    )}
                    <AdminBtn variant="danger" onClick={() => deleteReview?.(r.id)} style={{ marginLeft: 8 }}>Delete</AdminBtn>
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
