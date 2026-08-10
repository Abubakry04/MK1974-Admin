import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatCard, AdminBtn } from './DashboardOverview'
import BrandLoader from '../../components/BrandLoader'

export default function PaymentsSection() {
  const { orders = [], pendingPayments = [], reviewPayment, apiLoading, apiError } = useAdmin()
  const [processingPaymentId, setProcessingPaymentId] = useState(null)
  const [actionNotice, setActionNotice] = useState('')
  const [reviewError, setReviewError] = useState('')

  const handlePaymentReview = async (paymentId, decision) => {
    setProcessingPaymentId(paymentId)
    setReviewError('')
    setActionNotice('')
    const res = await reviewPayment(paymentId, decision)
    setProcessingPaymentId(null)
    if (res.success) {
      setActionNotice(`Transfer payment ${decision.toLowerCase()} successfully!`)
    } else {
      setReviewError(res.error || 'Failed to review payment.')
    }
  }

  const sortedPendingPayments = [...pendingPayments].sort((a, b) => {
    const idA = Number(a.paymentId ?? a.id ?? a.paymentReviewId ?? 0)
    const idB = Number(b.paymentId ?? b.id ?? b.paymentReviewId ?? 0)
    if (idB && idA && idB !== idA) return idB - idA

    const dateA = new Date(a.createdAt || a.createdDate || a.date || 0).getTime()
    const dateB = new Date(b.createdAt || b.createdDate || b.date || 0).getTime()
    return dateB - dateA
  })

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.rawDate || a.date || 0).getTime()
    const dateB = new Date(b.rawDate || b.date || 0).getTime()
    if (dateB !== dateA) return dateB - dateA
    return Number(b.id || 0) - Number(a.id || 0)
  })

  if (apiLoading) {
    return <BrandLoader />
  }

  return (
    <div className="animate-fade-up">
      <SectionHeader
        title="Payment Verification"
        sub={`${pendingPayments.length} pending transfer receipts awaiting admin approval`}
      />

      {actionNotice && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--success-dim)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius)',
          fontSize: 13,
          color: 'var(--success)',
          marginBottom: 20,
          fontWeight: 500,
        }}>
          ✓ {actionNotice}
        </div>
      )}

      {(reviewError || apiError) && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: 13, marginBottom: 20 }}>
          Notice: {reviewError || apiError}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Payments"       value={orders.length} />
        <StatCard label="Pending Approval"    value={pendingPayments.length} accent="var(--warning)" />
        {/* <StatCard label="Payment Channel"     value="100% Direct Bank Transfer" accent="var(--success)" /> */}
      </div>

      {/* Live Bank Transfer Approvals Queue */}
      {pendingPayments.length > 0 && (
        <div style={{ marginBottom: 24, background: 'var(--surface)', border: '1px solid rgba(180,83,9,0.3)', borderRadius: 'var(--radius-lg)', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Pending Bank Transfer Approvals ({pendingPayments.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedPendingPayments.map(p => {
              const pid = p.paymentId ?? p.id
              const receiptLink = p.receiptUrl || p.receipt || p.receiptPath || p.ReceiptUrl || p.attachmentUrl

              return (
                <div
                  key={pid}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Order #{p.orderNumber ?? p.orderId ?? p.order ?? p.OrderNumber ?? p.OrderId ?? '—'}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--warning-dim)', color: 'var(--warning)', fontWeight: 600 }}>
                        Awaiting Admin Approval
                      </span>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      Amount: <strong style={{ color: 'var(--text-primary)' }}>₦{(p.amount ?? p.Amount ?? 0).toLocaleString()}</strong> · Direct Bank Transfer
                    </p>
                    {receiptLink ? (
                      <a
                        href={receiptLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 12.5, color: 'var(--accent)', fontWeight: 600,
                          textDecoration: 'none', padding: '5px 10px',
                          background: 'var(--accent-dim)', borderRadius: 'var(--radius)',
                          border: '1px solid rgba(196,98,45,0.25)'
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        View Transfer Receipt
                      </a>
                    ) : (
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontStyle: 'italic' }}>No receipt file attached</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <AdminBtn
                      variant="secondary"
                      disabled={processingPaymentId === pid}
                      onClick={() => handlePaymentReview(pid, 'Approved')}
                    >
                      {processingPaymentId === pid ? 'Approving...' : 'Approve Payment'}
                    </AdminBtn>
                    <AdminBtn
                      variant="danger"
                      disabled={processingPaymentId === pid}
                      onClick={() => handlePaymentReview(pid, 'Rejected')}
                    >
                      Reject
                    </AdminBtn>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Clean Payment Transactions Table — NO status column, NO clickable arrow column */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Payment Transactions Ledger</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>All store payment records processed via Direct Bank Transfer</p>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{orders.length} Payment Records</span>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['S/N', 'Customer', 'Items', 'Total', 'Payment Method', 'Date'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    background: '#FAFAFA',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((o, index) => (
                <tr
                  key={o.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '13px 16px', color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{index + 1}</td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{o.customer}</td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-secondary)' }}>{o.items} items</td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>₦{Number(o.total || 0).toLocaleString()}</td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>Direct Bank Transfer</td>
                  <td style={{ padding: '13px 16px', color: 'var(--text-secondary)' }}>{o.date}</td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
