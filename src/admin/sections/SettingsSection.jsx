import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

function Toggle({ id, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button id={id} onClick={() => setOn(o => !o)} style={{
      width: 44, height: 24, borderRadius: 12, background: on ? '#968574' : 'rgba(30,31,33,0.15)',
      border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18,
        borderRadius: '50%', background: '#FAF9F6',
        transition: 'left 0.2s', display: 'block', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} />
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(30,31,33,0.06)' }}>
      <div style={{ flex: 1, maxWidth: '60%' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1E1F21', margin: '0 0 3px' }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.5)', margin: 0, fontWeight: 400 }}>{desc}</p>}
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
      <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 16px', fontWeight: 700 }}>Store Categories</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end' }}>
        <input placeholder="e.g. Streetwear" value={name} onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 220, borderRadius: 4 }} />
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-category-btn">{saving ? '...' : '+ Add Category'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {categories.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.1)', padding: '6px 14px', borderRadius: 4 }}>
            <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 600 }}>{c.name}</span>
            <button onClick={() => deleteCategory(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(30,31,33,0.4)', fontSize: 16, lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(30,31,33,0.4)'}
            >×</button>
          </div>
        ))}
        {categories.length === 0 && <p style={{ fontSize: 12, color: 'rgba(30,31,33,0.5)' }}>No categories configured.</p>}
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
      <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 16px', fontWeight: 700 }}>Apparel Colors</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 5, fontWeight: 600 }}>Color Name</label>
          <input placeholder="e.g. Volt Green" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 200, borderRadius: 4 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 5, fontWeight: 600 }}>Hex Code</label>
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
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.1)', padding: '6px 14px', borderRadius: 4 }}>
            <div style={{ width: 16, height: 16, background: c.hexCode, border: '1px solid rgba(30,31,33,0.2)', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 600 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: 'rgba(30,31,33,0.5)', fontFamily: 'monospace' }}>{c.hexCode}</span>
            <button onClick={() => deleteColor(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(30,31,33,0.4)', fontSize: 16, lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(30,31,33,0.4)'}
            >×</button>
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
      <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 16px', fontWeight: 700 }}>Apparel Sizes</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end' }}>
        <input placeholder="e.g. XXL" value={name} onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 160, borderRadius: 4 }} />
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-size-btn">{saving ? '...' : '+ Add Size'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 11, color: '#dc2626', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {sizes.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.1)', padding: '6px 14px', borderRadius: 4 }}>
            <span style={{ fontSize: 12, color: '#1E1F21', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{s.name}</span>
            <button onClick={() => deleteSize(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(30,31,33,0.4)', fontSize: 16, lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(30,31,33,0.4)'}
            >×</button>
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

  const tabs = ['general', 'store', 'catalogue', 'notifications', 'security', 'api']

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Control Panel Settings" sub="Configure storefront preferences, catalogue properties, and API integration" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(30,31,33,0.08)', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '12px 24px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            background: 'none', border: 'none', borderBottom: activeTab === t ? '2px solid #968574' : '2px solid transparent',
            color: activeTab === t ? '#968574' : 'rgba(30,31,33,0.5)',
            transition: 'all 0.2s', marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: '8px 32px 28px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '24px 0 0', fontWeight: 700 }}>Admin Profile</p>
            <SettingRow label="Display Name" desc="Your administrator account name">
              <input defaultValue={adminUser?.name} style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 240, borderRadius: 4 }} />
            </SettingRow>
            <SettingRow label="Email Address" desc="Primary admin login email">
              <input defaultValue={adminUser?.email} style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 240, borderRadius: 4 }} />
            </SettingRow>
            <SettingRow label="Role Assignment" desc="Current administrative privileges">
              <span style={{ fontSize: 12, color: '#968574', fontWeight: 700 }}>{adminUser?.role}</span>
            </SettingRow>
          </div>
          <AdminBtn variant="secondary" id="save-general-settings">Save Profile Settings</AdminBtn>
        </div>
      )}

      {activeTab === 'store' && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: '8px 32px 28px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '24px 0 0', fontWeight: 700 }}>Store Defaults</p>
            <SettingRow label="Store Name" desc="Public brand identifier"><input defaultValue="MK 1974" style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 220, borderRadius: 4 }} /></SettingRow>
            <SettingRow label="Primary Currency" desc="Storefront checkout currency"><input defaultValue="NGN (₦)" style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 220, borderRadius: 4 }} /></SettingRow>
            <SettingRow label="Free Shipping Threshold" desc="Minimum cart amount for free delivery"><input defaultValue="₦75,000" style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 220, borderRadius: 4 }} /></SettingRow>
            <SettingRow label="Maintenance Mode" desc="Temporarily display maintenance page"><Toggle id="maintenance-toggle" defaultChecked={false} /></SettingRow>
            <SettingRow label="Allow Guest Checkout" desc="Permit checkout without customer login"><Toggle id="guest-checkout-toggle" defaultChecked={true} /></SettingRow>
          </div>
          <AdminBtn variant="secondary" id="save-store-settings">Save Store Preferences</AdminBtn>
        </div>
      )}

      {activeTab === 'catalogue' && (
        <div style={{ maxWidth: 800 }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 32, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 20 }}>
            <CategoriesManager />
          </div>
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 32, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 20 }}>
            <ColorsManager />
          </div>
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 32, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <SizesManager />
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ maxWidth: 740 }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: '8px 32px 28px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '24px 0 0', fontWeight: 700 }}>Notification Triggers</p>
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
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: '8px 32px 28px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '24px 0 0', fontWeight: 700 }}>Security & Authentication</p>
            <SettingRow label="Two-Factor Authentication (2FA)" desc="Enforce 2FA verification code on sign-in"><Toggle id="2fa-toggle" defaultChecked={false} /></SettingRow>
            <SettingRow label="Session Auto-Timeout" desc="Automatically require login after inactivity">
              <select style={{ background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', borderRadius: 4 }}>
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
          <div style={{ background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)', padding: 32, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 20px', fontWeight: 700 }}>Live Backend API Configuration</p>
            {[
              { label: 'API Target URL', value: 'https://mk-brand-api.onrender.com' },
              { label: 'Swagger Documentation', value: 'https://mk-brand-api.onrender.com/swagger/index.html' },
              { label: 'OpenAPI v1 Schema', value: 'https://mk-brand-api.onrender.com/swagger/v1/swagger.json' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>{label}</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input readOnly defaultValue={value} style={{ flex: 1, background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)', color: '#1E1F21', padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', outline: 'none', borderRadius: 4 }} />
                  <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: '#968574', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' }}>↗ Open</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
