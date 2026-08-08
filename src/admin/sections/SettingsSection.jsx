import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

function Toggle({ id, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button id={id} onClick={() => setOn(o => !o)} style={{
      width: 42, height: 24, borderRadius: 12, background: on ? 'var(--accent)' : 'var(--border-strong)',
      border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18,
        borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, maxWidth: '60%' }}>
        <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, fontWeight: 400 }}>{desc}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Categories Manager ───────────────────────────────────────────────────────
function CategoriesManager() {
  const { categories, createCategory, deleteCategory } = useAdmin()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try { await createCategory({ name: name.trim() }); setName('') }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 16px' }}>Store Categories</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end' }}>
        <input placeholder="e.g. Streetwear" value={name} onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 220, borderRadius: 'var(--radius)' }} />
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-category-btn">{saving ? '...' : '+ Add Category'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {categories.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 'var(--radius)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</span>
            <button onClick={() => deleteCategory(c.id)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.15s', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        {categories.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No categories configured.</p>}
      </div>
    </div>
  )
}

// ─── Colors Manager ───────────────────────────────────────────────────────────
function ColorsManager() {
  const { colors, createColor, deleteColor } = useAdmin()
  const [form, setForm] = useState({ name: '', hexCode: '#000000' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!form.name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try { await createColor({ name: form.name, hexCode: form.hexCode }); setForm({ name: '', hexCode: '#000000' }) }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 16px' }}>Apparel Colors</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Color Name</label>
          <input placeholder="e.g. Volt Green" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 200, borderRadius: 'var(--radius)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Hex Code</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={form.hexCode} onChange={e => setForm(f => ({ ...f, hexCode: e.target.value }))}
              style={{ width: 40, height: 40, border: '1px solid rgba(30,31,33,0.15)', background: 'none', cursor: 'pointer', padding: 2, borderRadius: 4 }} />
            <input value={form.hexCode} onChange={e => setForm(f => ({ ...f, hexCode: e.target.value }))}
              style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 12px', fontSize: 12, fontFamily: 'monospace', outline: 'none', width: 100, borderRadius: 4 }} />
          </div>
        </div>
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-color-btn">{saving ? '...' : '+ Add Color'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {colors.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 'var(--radius)' }}>
            <div style={{ width: 14, height: 14, background: c.hexCode, border: '1px solid rgba(0,0,0,0.15)', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.hexCode}</span>
            <button onClick={() => deleteColor(c.id)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 2, transition: 'color 0.15s', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        {colors.length === 0 && <p style={{ fontSize: 12, color: 'rgba(30,31,33,0.5)' }}>No colors configured.</p>}
      </div>
    </div>
  )
}

// ─── Sizes Manager ────────────────────────────────────────────────────────────
function SizesManager() {
  const { sizes, createSize, deleteSize } = useAdmin()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try { await createSize({ name: name.trim() }); setName('') }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 16px' }}>Apparel Sizes</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end' }}>
        <input placeholder="e.g. XXL" value={name} onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 160, borderRadius: 'var(--radius)' }} />
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-size-btn">{saving ? '...' : '+ Add Size'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {sizes.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 'var(--radius)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{s.name}</span>
            <button onClick={() => deleteSize(s.id)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 2, transition: 'color 0.15s', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        {sizes.length === 0 && <p style={{ fontSize: 12, color: 'rgba(30,31,33,0.5)' }}>No sizes configured.</p>}
      </div>
    </div>
  )
}

// ─── Settings Main Component ──────────────────────────────────────────────────
export default function SettingsSection() {
  const { adminUser, adminLogout } = useAdmin()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = ['general', 'catalogue']

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Control Panel Settings" sub="Configure storefront preferences, catalogue properties, and API integration" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 28, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '11px 20px', fontSize: 13,
            fontWeight: activeTab === t ? 500 : 400, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            background: 'none', border: 'none', borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === t ? 'var(--accent)' : 'var(--text-secondary)',
            transition: 'all 0.15s', marginBottom: -1, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div style={{ maxWidth: 740 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 28px 24px', borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '20px 0 0' }}>Admin Profile</p>
          <SettingRow label="Display Name" desc="Your administrator account name">
            <input defaultValue={adminUser?.name} style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 240, borderRadius: 'var(--radius)' }} />
          </SettingRow>
          <SettingRow label="Email Address" desc="Primary admin login email">
            <input defaultValue={adminUser?.email} style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 240, borderRadius: 'var(--radius)' }} />
          </SettingRow>
          <SettingRow label="Role Assignment" desc="Current administrative privileges">
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{adminUser?.role}</span>
          </SettingRow>
        </div>
        {/* <AdminBtn variant="secondary" id="save-general-settings">Save Profile</AdminBtn> */}
        </div>
      )}

      {activeTab === 'store' && (
        <div style={{ maxWidth: 740 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 28px 24px', borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '20px 0 0' }}>Store Defaults</p>
          <SettingRow label="Store Name" desc="Public brand identifier"><input defaultValue="MK 1974" style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 220, borderRadius: 'var(--radius)' }} /></SettingRow>
          <SettingRow label="Primary Currency" desc="Storefront checkout currency"><input defaultValue="NGN (₦)" style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 220, borderRadius: 'var(--radius)' }} /></SettingRow>
          <SettingRow label="Free Shipping Threshold" desc="Minimum cart amount for free delivery"><input defaultValue="₦75,000" style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 220, borderRadius: 'var(--radius)' }} /></SettingRow>
          <SettingRow label="Maintenance Mode" desc="Temporarily display maintenance page"><Toggle id="maintenance-toggle" defaultChecked={false} /></SettingRow>
          <SettingRow label="Allow Guest Checkout" desc="Permit checkout without customer login"><Toggle id="guest-checkout-toggle" defaultChecked={true} /></SettingRow>
        </div>
        <AdminBtn variant="secondary" id="save-store-settings">Save Store Preferences</AdminBtn>
        </div>
      )}

      {activeTab === 'catalogue' && (
        <div style={{ maxWidth: 800 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 28, borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
            <CategoriesManager />
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 28, borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
            <ColorsManager />
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
            <SizesManager />
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 28px 24px', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '20px 0 0' }}>Notification Triggers</p>
            {[
              { label: 'New order placed', desc: 'Instant email alert when a new customer order is placed', id: 'notif-new-order', default: true },
              { label: 'Payment confirmed', desc: 'Alert upon successful order payment authorization', id: 'notif-payment', default: true },
              { label: 'Low stock warning', desc: 'Alert when any product inventory drops below 10 units', id: 'notif-low-stock', default: true },
              { label: 'New customer registration', desc: 'Alert when a new customer signs up for an account', id: 'notif-signup', default: false },
            ].map(n => (
              <SettingRow key={n.id} label={n.label} desc={n.desc}>
                <Toggle id={n.id} defaultChecked={n.default} />
              </SettingRow>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 28px 24px', borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '20px 0 0' }}>Security & Authentication</p>
            <SettingRow label="Two-Factor Authentication (2FA)" desc="Enforce 2FA verification code on sign-in"><Toggle id="2fa-toggle" defaultChecked={false} /></SettingRow>
            <SettingRow label="Session Auto-Timeout" desc="Automatically require login after inactivity">
              <select style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', borderRadius: 'var(--radius)' }}>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>8 hours</option>
                <option>Never</option>
              </select>
            </SettingRow>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <AdminBtn variant="secondary" id="change-password-btn">Change Password</AdminBtn>
            <AdminBtn variant="danger" onClick={adminLogout} id="security-logout-btn">Sign Out</AdminBtn>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 20px' }}>Live Backend API Configuration</p>
            {[
              { label: 'API Target URL', value: 'https://mk-brand-api.onrender.com' },
              { label: 'Swagger Documentation', value: 'https://mk-brand-api.onrender.com/swagger/index.html' },
              { label: 'OpenAPI v1 Schema', value: 'https://mk-brand-api.onrender.com/swagger/v1/swagger.json' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input readOnly defaultValue={value} style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 12, fontFamily: 'monospace', outline: 'none', borderRadius: 'var(--radius)' }} />
                  <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>↗ Open</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
