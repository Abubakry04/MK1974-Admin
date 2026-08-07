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

      {reviews.length === 0 && (
        <div style={{
          padding: '48px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 13,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          Notice: No customer product reviews submitted yet. Live API synced.
        </div>
      )}

      {/* Pending Reviews Moderation Queue */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Pending Moderation Queue ({pending.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map(r => (
              <div
                key={r.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid rgba(180, 83, 9, 0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{r.customer}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>on</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{r.product}</span>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.6, fontWeight: 400 }}>"{r.text}"</p>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0 }}>Submitted on {r.date}</p>
                </div>
                
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <AdminBtn variant="secondary" onClick={() => approveReview(r.id)} id={`approve-review-${r.id}`}>
                    Approve
                  </AdminBtn>
                  <AdminBtn variant="danger" onClick={() => deleteReview(r.id)} id={`delete-review-${r.id}`}>
                    Reject
                  </AdminBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published / All Reviews List */}
      {reviews.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Published Product Feedback
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.filter(r => r.status !== 'pending').map(r => (
              <div
                key={r.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 20,
                  transition: 'box-shadow 0.15s',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <StarRating rating={r.rating} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{r.customer}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>reviewed <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.product}</strong></span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.6, fontWeight: 400 }}>"{r.text}"</p>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0 }}>{r.date}</p>
                </div>

                <AdminBtn variant="danger" onClick={() => deleteReview(r.id)} id={`del-review-${r.id}`}>
                  Remove
                </AdminBtn>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
