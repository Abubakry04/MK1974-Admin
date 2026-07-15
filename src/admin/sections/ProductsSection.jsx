import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn } from './DashboardOverview'

// ─── Add Product Form ─────────────────────────────────────────────────────────
function AddProductModal({ onClose, categories, colors = [], sizes = [], onSave }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', stockQuantity: '',
    categoryIds: [], selectedColors: [], selectedSizes: [], images: [],
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
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

      const savedProduct = await onSave({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryId: form.categoryIds.map(Number).filter(n => Number.isInteger(n) && n > 0),
        variants,
      })

      if (savedProduct && form.images.length > 0) {
        localStorage.setItem(`mk_prod_images_${savedProduct.productId ?? savedProduct.id}`, JSON.stringify(form.images))
      }

      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#111', border: '1px solid rgba(242,235,220,0.1)',
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
        padding: 32,
      }}>
        <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8f542', margin: 0, fontWeight: 500 }}>New Product</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.4)', fontSize: 20 }}>×</button>
        </div>

        {[
          { label: 'Product Name *', key: 'name', placeholder: 'e.g. Apex Full Tracksuit', type: 'text' },
          { label: 'Price (₦) *', key: 'price', placeholder: '129.00', type: 'number' },
          { label: 'Stock Quantity', key: 'stockQuantity', placeholder: '50', type: 'number' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              style={{ width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 6, fontWeight: 500 }}>Description</label>
          <textarea
            placeholder="Product description..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            style={{ width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 8, fontWeight: 500 }}>Product Images</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
            {form.images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: 64, height: 64, border: '1px solid rgba(242,235,220,0.1)' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => set('images', form.images.filter((_, i) => i !== idx))} style={{
                  position: 'absolute', top: -4, right: -4, background: '#f87171', color: '#fff',
                  border: 'none', borderRadius: '50%', width: 16, height: 16, fontSize: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                }}>×</button>
              </div>
            ))}
            <label style={{
              width: 64, height: 64, border: '1px dashed rgba(242,235,220,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 10, color: 'rgba(242,235,220,0.4)'
            }}>
              <span style={{ fontSize: 16, marginBottom: 2 }}>+</span>
              <span>Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {categories.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 8, fontWeight: 500 }}>Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => toggleCat(c.id)} style={{
                  padding: '5px 12px', fontSize: 10, letterSpacing: '0.1em',
                  fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                  background: form.categoryIds.includes(c.id) ? '#c8f542' : 'rgba(242,235,220,0.05)',
                  color: form.categoryIds.includes(c.id) ? '#080808' : 'rgba(242,235,220,0.5)',
                  border: form.categoryIds.includes(c.id) ? 'none' : '1px solid rgba(242,235,220,0.1)',
                  transition: 'all 0.15s',
                }}>{c.name}</button>
              ))}
            </div>
          </div>
        )}

        {colors && colors.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 8, fontWeight: 500 }}>Colors</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {colors.map(c => (
                <button key={c.id} onClick={() => toggleColor(c.id)} style={{
                  padding: '5px 12px', fontSize: 10, letterSpacing: '0.1em',
                  fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                  background: form.selectedColors.includes(c.id) ? '#c8f542' : 'rgba(242,235,220,0.05)',
                  color: form.selectedColors.includes(c.id) ? '#080808' : 'rgba(242,235,220,0.5)',
                  border: form.selectedColors.includes(c.id) ? 'none' : '1px solid rgba(242,235,220,0.1)',
                  transition: 'all 0.15s',
                }}>{c.name}</button>
              ))}
            </div>
          </div>
        )}

        {sizes && sizes.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 8, fontWeight: 500 }}>Sizes</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sizes.map(s => (
                <button key={s.id} onClick={() => toggleSize(s.id)} style={{
                  padding: '5px 12px', fontSize: 10, letterSpacing: '0.1em',
                  fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                  background: form.selectedSizes.includes(s.id) ? '#c8f542' : 'rgba(242,235,220,0.05)',
                  color: form.selectedSizes.includes(s.id) ? '#080808' : 'rgba(242,235,220,0.5)',
                  border: form.selectedSizes.includes(s.id) ? 'none' : '1px solid rgba(242,235,220,0.1)',
                  transition: 'all 0.15s',
                }}>{s.name}</button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '10px 14px', fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <AdminBtn variant="primary" onClick={handleSave} disabled={saving} id="save-product-btn">
            {saving ? 'Saving...' : 'Save Product'}
          </AdminBtn>
          <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Product Modal ───────────────────────────────────────────────────────
function EditProductModal({ product, categories, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    stockQuantity: product.stockQuantity || '',
    categoryIds: (product.categories || []).map(c => c.id),
    images: (() => {
      try {
        const stored = localStorage.getItem(`mk_prod_images_${product.id}`)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    })()
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
          setForm(f => ({ ...f, images: [...f.images, dataUrl] }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { setError('Name and price are required.'); return }
    setSaving(true); setError('')
    try {
      await onSave(product.id, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryId: form.categoryIds.map(Number).filter(n => Number.isInteger(n) && n > 0),
      })
      if (form.images) {
        localStorage.setItem(`mk_prod_images_${product.id}`, JSON.stringify(form.images))
      }
      onClose()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await onDelete(product.id)
      localStorage.removeItem(`mk_prod_images_${product.id}`)
      onClose()
    }
    catch (err) { setError(err.message) }
    finally { setDeleting(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#111', border: '1px solid rgba(242,235,220,0.1)', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8f542', margin: 0, fontWeight: 500 }}>Edit Product · ID {product.id}</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.4)', fontSize: 20 }}>×</button>
        </div>
        {[
          { label: 'Product Name *', key: 'name', type: 'text' },
          { label: 'Price (₦) *', key: 'price', type: 'number' },
          { label: 'Stock Quantity', key: 'stockQuantity', type: 'number' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
              style={{ width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 6, fontWeight: 500 }}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
            style={{ width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 8, fontWeight: 500 }}>Product Images</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
            {form.images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: 64, height: 64, border: '1px solid rgba(242,235,220,0.1)' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => set('images', form.images.filter((_, i) => i !== idx))} style={{
                  position: 'absolute', top: -4, right: -4, background: '#f87171', color: '#fff',
                  border: 'none', borderRadius: '50%', width: 16, height: 16, fontSize: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                }}>×</button>
              </div>
            ))}
            <label style={{
              width: 64, height: 64, border: '1px dashed rgba(242,235,220,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 10, color: 'rgba(242,235,220,0.4)'
            }}>
              <span style={{ fontSize: 16, marginBottom: 2 }}>+</span>
              <span>Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {categories.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 8, fontWeight: 500 }}>Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => toggleCat(c.id)} style={{
                  padding: '5px 12px', fontSize: 10, letterSpacing: '0.1em',
                  fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                  background: form.categoryIds.includes(c.id) ? '#c8f542' : 'rgba(242,235,220,0.05)',
                  color: form.categoryIds.includes(c.id) ? '#080808' : 'rgba(242,235,220,0.5)',
                  border: form.categoryIds.includes(c.id) ? 'none' : '1px solid rgba(242,235,220,0.1)',
                  transition: 'all 0.15s',
                }}>{c.name}</button>
              ))}
            </div>
          </div>
        )}

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '10px 14px', fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <AdminBtn variant="primary" onClick={handleSave} disabled={saving} id="update-product-btn">{saving ? 'Saving...' : 'Update'}</AdminBtn>
          <AdminBtn variant="danger" onClick={handleDelete} disabled={deleting} id="delete-product-btn">{deleting ? 'Deleting...' : 'Delete'}</AdminBtn>
          <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ProductsSection() {
  const { products, categories, colors, sizes, createProduct, updateProduct, deleteProduct, apiLoading, apiError, fetchAllApiData } = useAdmin()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  )

  return (
    <div>
      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          categories={categories}
          colors={colors}
          sizes={sizes}
          onSave={createProduct}
        />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          categories={categories}
          onClose={() => setEditProduct(null)}
          onSave={updateProduct}
          onDelete={deleteProduct}
        />
      )}

      <SectionHeader
        title="Products"
        sub={apiLoading ? 'Loading from API…' : `${products.length} products from API`}
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <AdminBtn variant="ghost" onClick={fetchAllApiData} id="refresh-products-btn">↻ Refresh</AdminBtn>
            <AdminBtn variant="primary" onClick={() => setShowAdd(true)} id="add-product-btn">+ Add Product</AdminBtn>
          </div>
        }
      />

      {apiError && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 18px', marginBottom: 24, fontSize: 12, color: '#f87171', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠ API Error: {apiError}</span>
          <AdminBtn variant="danger" onClick={fetchAllApiData}>Retry</AdminBtn>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          id="product-search"
          placeholder="Search products by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: 'rgba(242,235,220,0.04)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '9px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 280 }}
        />
      </div>

      {/* Loading skeleton */}
      {apiLoading && products.length === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', height: 280, animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!apiLoading || products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} style={{
              background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
              overflow: 'hidden', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,245,66,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,235,220,0.07)'}
            >
              {/* Image area */}
              {(() => {
                let firstImg = null
                try {
                  const stored = localStorage.getItem(`mk_prod_images_${p.id}`)
                  if (stored) {
                    const parsed = JSON.parse(stored)
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      firstImg = parsed[0]
                    }
                  }
                } catch {}

                return (
                  <div style={{ height: 140, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {firstImg ? (
                      <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 32, opacity: 0.2 }}>▦</span>
                    )}
                    <span style={{
                      position: 'absolute', top: 10, right: 10,
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                      background: p.stockQuantity > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: p.stockQuantity > 0 ? '#4ade80' : '#f87171',
                      padding: '3px 8px',
                    }}>{p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                )
              })()}
              <div style={{ padding: '16px 18px' }}>
                <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 4px' }}>
                  ID: {p.id} {p.categories?.length > 0 && `· ${p.categories.map(c => c.name).join(', ')}`}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#f2ebdc', margin: '0 0 8px' }}>{p.name}</p>
                {p.description && (
                  <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.4)', margin: '0 0 10px', fontWeight: 300, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#c8f542' }}>₦{p.price}</span>
                  <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.4)' }}>Stock: {p.stockQuantity}</span>
                </div>
                {/* Variants summary */}
                {p.variants?.length > 0 && (
                  <p style={{ fontSize: 10, color: 'rgba(242,235,220,0.3)', margin: '0 0 12px' }}>{p.variants.length} variant{p.variants.length !== 1 ? 's' : ''}</p>
                )}
                <AdminBtn variant="ghost" onClick={() => setEditProduct(p)} id={`edit-product-${p.id}`}>Edit</AdminBtn>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!apiLoading && filtered.length === 0 && !apiError && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(242,235,220,0.3)', fontSize: 13 }}>
          {products.length === 0 ? 'No products yet. Add your first product.' : 'No products match your search.'}
        </div>
      )}
    </div>
  )
}
