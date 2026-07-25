import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({ onClose, categories, colors = [], sizes = [], onSave }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', stockQuantity: '',
    categoryIds: [], selectedColors: [], selectedSizes: [], imageUrl: '', images: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleCat = (id) => {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter(c => c !== id)
        : [...f.categoryIds, id],
    }))
  }

  const toggleColor = (id) => {
    setForm(f => ({
      ...f,
      selectedColors: f.selectedColors.includes(id)
        ? f.selectedColors.filter(c => c !== id)
        : [...f.selectedColors, id],
    }))
  }

  const toggleSize = (id) => {
    setForm(f => ({
      ...f,
      selectedSizes: f.selectedSizes.includes(id)
        ? f.selectedSizes.filter(s => s !== id)
        : [...f.selectedSizes, id],
    }))
  }

  const handleAddImageUrl = () => {
    if (!form.imageUrl) return
    setForm(f => ({ ...f, images: [...f.images, f.imageUrl], imageUrl: '' }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 400
          const MAX_HEIGHT = 500
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
          setForm(f => ({ ...f, images: [...f.images, dataUrl] }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { setError('Name and price are required.'); return }
    setSaving(true)
    setError('')
    try {
      const variants = []
      form.selectedColors.forEach(colorId => {
        form.selectedSizes.forEach(sizeId => {
          const cId = Number(colorId)
          const sId = Number(sizeId)
          if (Number.isInteger(cId) && cId > 0 && Number.isInteger(sId) && sId > 0) {
            variants.push({
              colorId: cId,
              sizeId: sId,
              price: parseFloat(form.price) || 0,
              discountPrice: 0,
              stockQuantity: Math.ceil((parseInt(form.stockQuantity) || 0) / (form.selectedColors.length * form.selectedSizes.length || 1)) || 0,
            })
          }
        })
      })

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        discountPrice: 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryIds: form.categoryIds.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0),
        variants,
      }

      const created = await onSave(payload)
      if (created && created.productId && form.images.length > 0) {
        try {
          localStorage.setItem(`mk_prod_images_${created.productId}`, JSON.stringify(form.images))
        } catch (e) { console.error(e) }
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)',
    color: '#1E1F21', padding: '10px 14px', fontSize: 13, fontFamily: "'Inter', sans-serif",
    outline: 'none', borderRadius: 4, boxSizing: 'border-box'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,31,33,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20
    }}>
      <div style={{
        background: '#FAF9F6', width: '100%', maxWidth: 640, maxHeight: '90vh',
        overflowY: 'auto', borderRadius: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(30,31,33,0.08)'
      }} className="animate-fade-in">
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(30,31,33,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700 }}>Catalogue</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: 'italic', margin: '2px 0 0', color: '#1E1F21' }}>Add New Product</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'rgba(30,31,33,0.4)' }}>×</button>
        </div>

        <div style={{ padding: 32 }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#dc2626', borderRadius: 4 }}>{error}</div>}

          {/* Name & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Product Name *</label>
              <input style={inputStyle} placeholder="e.g. Apex Full Tracksuit" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Price (₦) *</label>
              <input type="number" style={inputStyle} placeholder="129" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
          </div>

          {/* Description & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Product details and features..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Total Stock Quantity</label>
              <input type="number" style={inputStyle} placeholder="50" value={form.stockQuantity} onChange={e => set('stockQuantity', e.target.value)} />
            </div>
          </div>

          {/* Image Upload / URL */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 8, fontWeight: 600 }}>Product Images</label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Image URL (http://...)" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
              <AdminBtn variant="ghost" onClick={handleAddImageUrl}>+ Add URL</AdminBtn>
              <label style={{
                background: '#1E1F21', color: '#FAF9F6', padding: '9px 16px', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, display: 'inline-flex', alignItems: 'center'
              }}>
                Upload
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Image Previews */}
            {form.images.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ width: 60, height: 60, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(30,31,33,0.1)', position: 'relative' }}>
                    <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))} style={{
                      position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                      width: 16, height: 16, borderRadius: '50%', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 8, fontWeight: 600 }}>Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => {
                const active = form.categoryIds.includes(c.id)
                return (
                  <button key={c.id} onClick={() => toggleCat(c.id)} type="button" style={{
                    padding: '6px 12px', fontSize: 10, borderRadius: 4, fontWeight: 500,
                    background: active ? '#968574' : '#ffffff', color: active ? '#ffffff' : 'rgba(30,31,33,0.6)',
                    border: `1px solid ${active ? '#968574' : 'rgba(30,31,33,0.12)'}`
                  }}>{c.name}</button>
                )
              })}
              {categories.length === 0 && <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.4)' }}>No categories found.</p>}
            </div>
          </div>

          {/* Colors selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 8, fontWeight: 600 }}>Available Colors</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {colors.map(c => {
                const active = form.selectedColors.includes(c.id)
                return (
                  <button key={c.id} onClick={() => toggleColor(c.id)} type="button" style={{
                    padding: '6px 12px', fontSize: 10, borderRadius: 4, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
                    background: active ? '#968574' : '#ffffff', color: active ? '#ffffff' : 'rgba(30,31,33,0.6)',
                    border: `1px solid ${active ? '#968574' : 'rgba(30,31,33,0.12)'}`
                  }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.hexCode || '#000', border: '1px solid rgba(0,0,0,0.2)' }} />
                    {c.name}
                  </button>
                )
              })}
              {colors.length === 0 && <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.4)' }}>No colors configured yet. You can add colors under Settings → Catalogue.</p>}
            </div>
          </div>

          {/* Sizes selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 8, fontWeight: 600 }}>Available Sizes</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sizes.map(s => {
                const active = form.selectedSizes.includes(s.id)
                return (
                  <button key={s.id} onClick={() => toggleSize(s.id)} type="button" style={{
                    padding: '6px 14px', fontSize: 10, borderRadius: 4, fontWeight: 600,
                    background: active ? '#968574' : '#ffffff', color: active ? '#ffffff' : 'rgba(30,31,33,0.6)',
                    border: `1px solid ${active ? '#968574' : 'rgba(30,31,33,0.12)'}`
                  }}>{s.name}</button>
                )
              })}
              {sizes.length === 0 && <p style={{ fontSize: 11, color: 'rgba(30,31,33,0.4)' }}>No sizes configured yet. You can add sizes under Settings → Catalogue.</p>}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
            <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
            <AdminBtn variant="secondary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Product'}</AdminBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Product Modal ────────────────────────────────────────────────────────
function EditProductModal({ product, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    name: product.name || '', description: product.description || '',
    price: product.price || '', stockQuantity: product.stockQuantity || ''
  })
  const [saving, setSaving] = useState(false)

  const handleUpdate = async () => {
    setSaving(true)
    try {
      await onSave(product.id, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
      })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)',
    color: '#1E1F21', padding: '10px 14px', fontSize: 13, fontFamily: "'Inter', sans-serif",
    outline: 'none', borderRadius: 4, boxSizing: 'border-box'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,31,33,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20
    }}>
      <div style={{ background: '#FAF9F6', width: '100%', maxWidth: 500, borderRadius: 8, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} className="animate-fade-in">
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: 'italic', margin: '0 0 20px', color: '#1E1F21' }}>Edit Product #{product.id}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Product Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Price (₦)</label>
            <input type="number" style={inputStyle} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', marginBottom: 6, fontWeight: 600 }}>Stock Quantity</label>
            <input type="number" style={inputStyle} value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <AdminBtn variant="danger" onClick={async () => { await onDelete(product.id); onClose(); }}>Delete Product</AdminBtn>
          <div style={{ display: 'flex', gap: 10 }}>
            <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
            <AdminBtn variant="secondary" onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : 'Update'}</AdminBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Products Section Main Component ──────────────────────────────────────────
export default function ProductsSection() {
  const { products, categories, colors, sizes, createProduct, updateProduct, deleteProduct, apiLoading, apiError } = useAdmin()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || String(p.id).includes(search)
    const matchCat = selectedCat === 'all' || (p.categories || []).some(c => String(c.id) === String(selectedCat))
    return matchSearch && matchCat
  })

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Products Catalogue"
        sub={`${products.length} active inventory items`}
        action={
          <AdminBtn id="add-product-btn" variant="secondary" onClick={() => setShowAddModal(true)}>
            + Add Product
          </AdminBtn>
        }
      />

      {/* Filter Bar & View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            id="product-search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: '#ffffff', border: '1px solid rgba(30,31,33,0.12)',
              color: '#1E1F21', padding: '9px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif",
              outline: 'none', width: 260, borderRadius: 4
            }}
          />
          <button
            onClick={() => setSelectedCat('all')}
            style={{
              padding: '8px 14px', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
              fontWeight: 600, cursor: 'pointer', borderRadius: 4,
              background: selectedCat === 'all' ? '#968574' : '#ffffff',
              color: selectedCat === 'all' ? '#ffffff' : 'rgba(30,31,33,0.6)',
              border: `1px solid ${selectedCat === 'all' ? '#968574' : 'rgba(30,31,33,0.12)'}`
            }}
          >All</button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              style={{
                padding: '8px 14px', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 600, cursor: 'pointer', borderRadius: 4,
                background: String(selectedCat) === String(c.id) ? '#968574' : '#ffffff',
                color: String(selectedCat) === String(c.id) ? '#ffffff' : 'rgba(30,31,33,0.6)',
                border: `1px solid ${String(selectedCat) === String(c.id) ? '#968574' : 'rgba(30,31,33,0.12)'}`
              }}
            >{c.name}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, background: '#ffffff', padding: 4, border: '1px solid rgba(30,31,33,0.1)', borderRadius: 4 }}>
          <button onClick={() => setViewMode('grid')} style={{ padding: '4px 10px', fontSize: 11, background: viewMode === 'grid' ? 'rgba(150,133,116,0.15)' : 'none', color: viewMode === 'grid' ? '#968574' : 'rgba(30,31,33,0.5)', borderRadius: 4, fontWeight: 600 }}>▦ Grid</button>
          <button onClick={() => setViewMode('table')} style={{ padding: '4px 10px', fontSize: 11, background: viewMode === 'table' ? 'rgba(150,133,116,0.15)' : 'none', color: viewMode === 'table' ? '#968574' : 'rgba(30,31,33,0.5)', borderRadius: 4, fontWeight: 600 }}>☰ Table</button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(p => {
            let firstImg = null
            try {
              const stored = localStorage.getItem(`mk_prod_images_${p.id}`)
              if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed) && parsed.length > 0) firstImg = parsed[0]
              }
            } catch {}

            return (
              <div key={p.id} style={{
                background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
                borderRadius: 8, overflow: 'hidden', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }} className="hover-lift">
                <div style={{ height: 160, background: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid rgba(30,31,33,0.06)' }}>
                  {firstImg ? (
                    <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 36, color: '#968574', opacity: 0.3 }}>▦</span>
                  )}
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: p.stockQuantity > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: p.stockQuantity > 0 ? '#16a34a' : '#dc2626',
                    padding: '4px 8px', borderRadius: 4,
                  }}>{p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div style={{ padding: 20 }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#968574', margin: '0 0 4px', fontWeight: 600 }}>
                    ID: #{p.id}
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1E1F21', margin: '0 0 6px' }}>{p.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <span style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21' }}>₦{Number(p.price || 0).toLocaleString()}</span>
                    <AdminBtn variant="ghost" onClick={() => setEditProduct(p)} id={`edit-product-${p.id}`}>Edit</AdminBtn>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          categories={categories}
          colors={colors}
          sizes={sizes}
          onSave={createProduct}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={updateProduct}
          onDelete={deleteProduct}
        />
      )}
    </div>
  )
}
