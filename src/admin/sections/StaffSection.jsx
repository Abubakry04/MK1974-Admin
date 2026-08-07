import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

const ROLE_COLORS = {
  'Super Admin': '#968574',
  'Product Manager': '#3b82f6',
  'Operations': '#8b5cf6',
  'Customer Support': '#f59e0b',
}

export default function StaffSection() {
  const { staff = [], adminUser } = useAdmin()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Product Manager' })

  // Current logged in admin user
  const currentAdmin = adminUser ? [{
    id: 'ADMIN-001',
    name: adminUser.name || adminUser.email?.split('@')[0] || 'System Admin',
    email: adminUser.email || 'admin@mk1974.com',
    role: adminUser.role || 'Super Admin',
    lastLogin: 'Active session',
  }] : []

  const displayStaff = [...currentAdmin, ...staff]

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Staff & Administrative Team"
        sub={`${displayStaff.length} active team member(s) with role access`}
        action={<AdminBtn id="invite-staff-btn" variant="secondary" onClick={() => setShowInviteModal(true)}>+ Invite Team Member</AdminBtn>}
      />

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
        {displayStaff.map(s => (
          <div key={s.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            padding: '24px 28px', borderRadius: 'var(--radius-lg)', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: 'var(--shadow-sm)'
          }} className="hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent-dim)', border: '1px solid rgba(196,98,45,0.25)',
                fontSize: 16, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                color: 'var(--accent)',
              }}>
                {(s.name || 'Admin').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{s.name}</p>
                <p style={{ fontSize: 10, color: ROLE_COLORS[s.role] || 'var(--accent)', margin: 0, fontWeight: 700, letterSpacing: '0.05em' }}>{s.role}</p>
              </div>
            </div>
            <div style={{ marginBottom: 18, background: 'var(--bg)', padding: '10px 14px', borderRadius: 'var(--radius)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '0 0 4px', fontWeight: 500 }}>{s.email}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>Last active: {s.lastLogin}</p>
            </div>
          </div>
        ))}
      </div>

      {displayStaff.length === 0 && (
        <div style={{
          padding: '48px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 13,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          Notice: No staff team members registered yet. Click "+ Invite Team Member" to add a new admin/staff account.
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', width: '100%', maxWidth: 440, padding: 28, borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 4px', fontWeight: 600 }}>Staff Invitation</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', color: 'var(--text-primary)' }}>Invite Team Member</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
                <input
                  value={inviteForm.name}
                  onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Aisha Bello"
                  style={{
                    width: '100%', background: 'var(--bg)', border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)', padding: '10px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    outline: 'none', borderRadius: 'var(--radius)', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="aisha@mk1974.com"
                  style={{
                    width: '100%', background: 'var(--bg)', border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)', padding: '10px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    outline: 'none', borderRadius: 'var(--radius)', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Assign Role</label>
                <select
                  value={inviteForm.role}
                  onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}
                  style={{
                    width: '100%', background: 'var(--bg)', border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)', padding: '10px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    outline: 'none', borderRadius: 'var(--radius)', boxSizing: 'border-box'
                  }}
                >
                  <option value="Product Manager">Product Manager</option>
                  <option value="Operations">Operations & Inventory</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <AdminBtn variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</AdminBtn>
              <AdminBtn variant="secondary" onClick={() => setShowInviteModal(false)}>Send Invitation</AdminBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
