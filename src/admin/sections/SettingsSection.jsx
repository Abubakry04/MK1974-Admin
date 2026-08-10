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
  const [selectedId, setSelectedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selectedCategory = categories.find(c => String(c.id) === String(selectedId)) || categories[0]

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try {
      const created = await createCategory({ name: name.trim() })
      setName('')
      if (created?.id) setSelectedId(created.id)
    }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      if (String(selectedId) === String(id)) {
        const remaining = categories.filter(c => String(c.id) !== String(id))
        setSelectedId(remaining[0]?.id || '')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Store Categories</p>
      
      {/* Create Input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <input
          placeholder="e.g. Streetwear"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 220, borderRadius: 'var(--radius)' }}
        />
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-category-btn">
          {saving ? 'Saving...' : '+ Add Category'}
        </AdminBtn>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '0 0 12px' }}>{error}</p>}

      {/* Dropdown Select format */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={selectedId || (categories[0]?.id || '')}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            padding: '9px 14px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            minWidth: 260,
            flex: 1,
            maxWidth: 360,
          }}
        >
          {categories.length === 0 ? (
            <option value="">No categories configured</option>
          ) : (
            categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))
          )}
        </select>

        {selectedCategory && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '7px 14px',
            borderRadius: 'var(--radius)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{selectedCategory.name}</span>
            <button
              onClick={() => handleDelete(selectedCategory.id)}
              title="Delete category"
              style={{
                color: 'var(--danger)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              Delete ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Colors Manager ───────────────────────────────────────────────────────────
function ColorsManager() {
  const { colors, createColor, deleteColor } = useAdmin()
  const [form, setForm] = useState({ name: '', hexCode: '#000000' })
  const [selectedId, setSelectedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selectedColor = colors.find(c => String(c.id) === String(selectedId)) || colors[0]

  const handleCreate = async () => {
    if (!form.name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try {
      const created = await createColor({ name: form.name, hexCode: form.hexCode })
      setForm({ name: '', hexCode: '#000000' })
      if (created?.id) setSelectedId(created.id)
    }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteColor(id)
      if (String(selectedId) === String(id)) {
        const remaining = colors.filter(c => String(c.id) !== String(id))
        setSelectedId(remaining[0]?.id || '')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Apparel Colors</p>
      
      {/* Create Input */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Color Name</label>
          <input
            placeholder="e.g. Volt Green"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 200, borderRadius: 'var(--radius)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>Hex Code</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={form.hexCode} onChange={e => setForm(f => ({ ...f, hexCode: e.target.value }))}
              style={{ width: 38, height: 38, border: '1px solid rgba(30,31,33,0.15)', background: 'none', cursor: 'pointer', padding: 2, borderRadius: 4 }} />
            <input value={form.hexCode} onChange={e => setForm(f => ({ ...f, hexCode: e.target.value }))}
              style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 12px', fontSize: 12, fontFamily: 'monospace', outline: 'none', width: 90, borderRadius: 'var(--radius)' }} />
          </div>
        </div>
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-color-btn">{saving ? 'Saving...' : '+ Add Color'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '0 0 12px' }}>{error}</p>}

      {/* Dropdown Select format */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={selectedId || (colors[0]?.id || '')}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            padding: '9px 14px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            minWidth: 260,
            flex: 1,
            maxWidth: 360,
          }}
        >
          {colors.length === 0 ? (
            <option value="">No colors configured</option>
          ) : (
            colors.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.hexCode})
              </option>
            ))
          )}
        </select>

        {selectedColor && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '7px 14px',
            borderRadius: 'var(--radius)',
          }}>
            <div style={{ width: 16, height: 16, background: selectedColor.hexCode, border: '1px solid rgba(0,0,0,0.2)', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{selectedColor.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedColor.hexCode}</span>
            <button
              onClick={() => handleDelete(selectedColor.id)}
              title="Delete color"
              style={{
                color: 'var(--danger)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                marginLeft: 4,
              }}
            >
              Delete ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sizes Manager ────────────────────────────────────────────────────────────
function SizesManager() {
  const { sizes, createSize, deleteSize } = useAdmin()
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selectedSize = sizes.find(s => String(s.id) === String(selectedId)) || sizes[0]

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try {
      const created = await createSize({ name: name.trim() })
      setName('')
      if (created?.id) setSelectedId(created.id)
    }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSize(id)
      if (String(selectedId) === String(id)) {
        const remaining = sizes.filter(s => String(s.id) !== String(id))
        setSelectedId(remaining[0]?.id || '')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Apparel Sizes</p>
      
      {/* Create Input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <input
          placeholder="e.g. XXL"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '9px 13px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: 160, borderRadius: 'var(--radius)' }}
        />
        <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="create-size-btn">
          {saving ? 'Saving...' : '+ Add Size'}
        </AdminBtn>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '0 0 12px' }}>{error}</p>}

      {/* Dropdown Select format */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={selectedId || (sizes[0]?.id || '')}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)',
            padding: '9px 14px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            minWidth: 220,
            flex: 1,
            maxWidth: 320,
          }}
        >
          {sizes.length === 0 ? (
            <option value="">No sizes configured</option>
          ) : (
            sizes.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))
          )}
        </select>

        {selectedSize && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '7px 14px',
            borderRadius: 'var(--radius)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSize.name}</span>
            <button
              onClick={() => handleDelete(selectedSize.id)}
              title="Delete size"
              style={{
                color: 'var(--danger)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              Delete ✕
            </button>
          </div>
        )}
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
      <SectionHeader title="Control Panel Settings" sub="Configure storefront preferences, catalogue properties" />

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
    </div>
  )
}
