import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn } from './DashboardOverview'

const ROLE_COLORS = {
  'Super Admin': '#968574',
  'Product Manager': '#3b82f6',
  'Operations': '#8b5cf6',
  'Customer Support': '#f59e0b',
}

export default function StaffSection() {
  const { staff } = useAdmin()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Product Manager' })

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Staff & Administrative Team"
        sub={`${staff.length} active team members with role access`}
        action={<AdminBtn id="invite-staff-btn" variant="secondary" onClick={() => setShowInviteModal(true)}>+ Invite Team Member</AdminBtn>}
      />

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
        {staff.map(s => (
          <div key={s.id} style={{
            background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
            padding: '24px 28px', borderRadius: 8, transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }} className="hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(150,133,116,0.12)', border: '1px solid rgba(150,133,116,0.25)',
                fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                color: '#968574',
              }}>
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1E1F21', margin: '0 0 3px' }}>{s.name}</p>
                <p style={{ fontSize: 10, color: ROLE_COLORS[s.role] || '#968574', margin: 0, fontWeight: 700, letterSpacing: '0.05em' }}>{s.role}</p>
              </div>
            </div>
            <div style={{ marginBottom: 18, background: '#FAF9F6', padding: '10px 14px', borderRadius: 4 }}>
              <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.7)', margin: '0 0 4px', fontWeight: 500 }}>{s.email}</p>
              <p style={{ fontSize: 10, color: 'rgba(30,31,33,0.4)', margin: 0 }}>Last active: {s.lastLogin}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={s.status} />
              <AdminBtn variant="ghost" id={`edit-staff-${s.id}`}>Manage Role</AdminBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Roles & Permissions Matrix */}
      <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 28, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 20px', fontWeight: 700 }}>Roles & Access Control Matrix</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { role: 'Super Admin', perms: ['All permissions', 'Manage staff & billing', 'Full catalog & orders', 'Delete records'] },
            { role: 'Product Manager', perms: ['Manage products & variants', 'Manage categories & sizes', 'Inventory tracking', 'Analytics access'] },
            { role: 'Operations', perms: ['Fulfill & ship orders', 'Manage inventory levels', 'View customer details', 'Print dispatch labels'] },
            { role: 'Customer Support', perms: ['View order history', 'View customer profiles', 'Manage customer reviews', 'No financial data access'] },
          ].map(r => (
            <div key={r.role} style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.08)', padding: '18px 20px', borderRadius: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: ROLE_COLORS[r.role] || '#968574', margin: '0 0 12px' }}>{r.role}</p>
              {r.perms.map(p => (
                <p key={p} style={{ fontSize: 11, color: 'rgba(30,31,33,0.6)', margin: '0 0 6px', fontWeight: 400 }}>✓ {p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(30,31,33,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20
        }}>
          <div style={{ background: '#FAF9F6', width: '100%', maxWidth: 440, borderRadius: 8, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} className="animate-fade-in">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: 'italic', margin: '0 0 20px', color: '#1E1F21' }}>Invite Team Member</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                <input style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(30,31,33,0.12)', padding: '10px 14px', borderRadius: 4, outline: 'none' }} placeholder="John Doe" value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Email Address</label>
                <input style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(30,31,33,0.12)', padding: '10px 14px', borderRadius: 4, outline: 'none' }} placeholder="john@mk1974.com" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Role Assignment</label>
                <select style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(30,31,33,0.12)', padding: '10px 14px', borderRadius: 4, outline: 'none' }} value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}>
                  {Object.keys(ROLE_COLORS).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <AdminBtn variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</AdminBtn>
              <AdminBtn variant="secondary" onClick={() => { alert(`Invitation sent to ${inviteForm.email}`); setShowInviteModal(false); }}>Send Invite</AdminBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
