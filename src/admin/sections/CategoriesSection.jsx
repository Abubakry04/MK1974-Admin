import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

export default function CategoriesSection() {
  const { categories, products, createCategory, deleteCategory, apiLoading, apiError } = useAdmin()
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) { setError('Category name is required.'); return }
    setSaving(true); setError('')
    try {
      await createCategory({ name: newName.trim() })
      setNewName('')
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? Products assigned to this category will not be lost.`)) return
    try {
      await deleteCategory(cat.id)
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`)
    }
  }

  const productCount = (catId) =>
    products.filter(p => (p.categories || []).some(c => String(c.id) === String(catId))).length

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Categories Management"
        sub={apiLoading ? 'Syncing live API...' : `${categories.length} store categories configured`}
        action={
          <AdminBtn id="add-category-btn" variant="secondary" onClick={() => setShowForm(s => !s)}>
            {showForm ? 'Close Form' : '+ New Category'}
          </AdminBtn>
        }
      />

      {apiError && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 18px', borderRadius: 6, marginBottom: 24, fontSize: 12, color: '#dc2626' }}>
          ⚠️ API Notice: {apiError}
        </div>
      )}

      {/* Inline Create Form */}
      {showForm && (
        <div style={{
          background: '#ffffff', border: '1px solid rgba(30,31,33,0.1)', padding: 28, borderRadius: 8,
          marginBottom: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }} className="animate-fade-in">
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: '0 0 16px', fontWeight: 700 }}>Add Category</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Category Name</label>
              <input
                id="new-category-name"
                placeholder="e.g. Streetwear / Hoodies"
                value={newName}
                onChange={e => { setNewName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                style={{
                  width: '100%', background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)',
                  color: '#1E1F21', padding: '10px 14px', fontSize: 13, fontFamily: "'Inter', sans-serif",
                  outline: 'none', borderRadius: 4, boxSizing: 'border-box'
                }}
              />
            </div>
            <AdminBtn variant="secondary" onClick={handleCreate} disabled={saving} id="save-category-btn">
              {saving ? 'Saving…' : 'Save Category'}
            </AdminBtn>
            <AdminBtn variant="ghost" onClick={() => { setShowForm(false); setError(''); setNewName(''); }}>Cancel</AdminBtn>
          </div>
          {error && <p style={{ fontSize: 12, color: '#dc2626', margin: '10px 0 0', fontWeight: 500 }}>{error}</p>}
        </div>
      )}

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
            padding: '24px 28px', borderRadius: 8, transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }} className="hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#1E1F21', margin: '0 0 2px' }}>{cat.name}</p>
                <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700 }}>ID: #{cat.id}</p>
              </div>
              <button
                id={`delete-cat-${cat.id}`}
                onClick={() => handleDelete(cat)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(30,31,33,0.3)', fontSize: 18, padding: 4, lineHeight: 1, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(30,31,33,0.3)'}
                title="Delete Category"
              >×</button>
            </div>
            <div>
              <p style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#968574', margin: 0 }}>{productCount(cat.id)}</p>
              <p style={{ fontSize: 9, color: 'rgba(30,31,33,0.5)', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Products</p>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !apiLoading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(30,31,33,0.5)', fontSize: 13, background: '#ffffff', borderRadius: 8, border: '1px solid rgba(30,31,33,0.08)' }}>
          No categories found. Click "+ New Category" above to create one.
        </div>
      )}
    </div>
  )
}
