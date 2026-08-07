import { useState, useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

// ─── Add / Edit Product Modal ──────────────────────────────────────────────────
function AddProductModal({ onClose, categories, colors = [], sizes = [], onSave, productToEdit }) {
  const [form, setForm] = useState({
    name: productToEdit?.name || '',
    description: productToEdit?.description || '',
    price: productToEdit?.price || '',
    stockQuantity: productToEdit?.stockQuantity || '',
    categoryIds: productToEdit?.categoryIds || (productToEdit?.categoryId ? [productToEdit.categoryId] : []),
    selectedColors: productToEdit?.selectedColors || [],
    selectedSizes: productToEdit?.selectedSizes || [],
    imageUrl: '',
    images: productToEdit?.images || [],     // preview data URLs
    imageFiles: [], // original File objects (sent to the API)
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
    setForm(f => ({ ...f, imageFiles: [...f.imageFiles, ...files] }))
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
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT }
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
    e.target.value = ''
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

      const categoryArray = form.categoryIds.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0)

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        discountPrice: 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryId: categoryArray,   // Exact C# DTO property name in Swagger ProductCreateDto & ProductUpdateDto
        categoryIds: categoryArray,  // Fallback property name
        variants,
      }

      const created = await onSave(payload, form.imageFiles)
      const productId = created?.productId ?? created?.id ?? productToEdit?.id
      if (productId && form.images.length > 0) {
        try {
          localStorage.setItem(`mk_prod_images_${productId}`, JSON.stringify(form.images))
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
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border-strong)',
    color: 'var(--text-primary)', padding: '10px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', borderRadius: 'var(--radius)', boxSizing: 'border-box'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20,
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 28,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: 4, background: 'none', border: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {error && <p style={{ fontSize: 12, color: 'var(--danger)', margin: '0 0 16px', background: 'var(--danger-dim)', padding: '8px 12px', borderRadius: 4 }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Product Name *</label>
            <input style={inputStyle} placeholder="e.g. Apex Full Tracksuit" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Product details..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Price (₦) *</label>
              <input style={inputStyle} type="number" placeholder="e.g. 75000" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Total Stock *</label>
              <input style={inputStyle} type="number" placeholder="e.g. 50" value={form.stockQuantity} onChange={e => set('stockQuantity', e.target.value)} />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => {
                const sel = form.categoryIds.includes(c.id)
                return (
                  <button key={c.id} type="button" onClick={() => toggleCat(c.id)} style={{
                    padding: '5px 12px', fontSize: 12, borderRadius: 'var(--radius)',
                    background: sel ? 'var(--accent)' : 'var(--bg)',
                    color: sel ? '#fff' : 'var(--text-primary)',
                    border: `1px solid ${sel ? 'var(--accent)' : 'var(--border-strong)'}`,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}>{c.name}</button>
                )
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Colors</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {colors.map(c => {
                const sel = form.selectedColors.includes(c.id)
                return (
                  <button key={c.id} type="button" onClick={() => toggleColor(c.id)} style={{
                    padding: '5px 12px', fontSize: 12, borderRadius: 'var(--radius)',
                    background: sel ? 'var(--accent)' : 'var(--bg)',
                    color: sel ? '#fff' : 'var(--text-primary)',
                    border: `1px solid ${sel ? 'var(--accent)' : 'var(--border-strong)'}`,
                    cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.hexCode || '#000', display: 'inline-block' }} />
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Sizes</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sizes.map(s => {
                const sel = form.selectedSizes.includes(s.id)
                return (
                  <button key={s.id} type="button" onClick={() => toggleSize(s.id)} style={{
                    padding: '5px 12px', fontSize: 12, borderRadius: 'var(--radius)',
                    background: sel ? 'var(--accent)' : 'var(--bg)',
                    color: sel ? '#fff' : 'var(--text-primary)',
                    border: `1px solid ${sel ? 'var(--accent)' : 'var(--border-strong)'}`,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}>{s.name}</button>
                )
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Product Images</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Image URL (http://...)" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
              <AdminBtn variant="ghost" onClick={handleAddImageUrl}>+ Add URL</AdminBtn>
            </div>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px',
              border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius)', background: 'var(--bg)',
              cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)', gap: 8, transition: 'background 0.15s'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Image File
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>

            {form.images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 60, height: 75, border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))} style={{
                      position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff',
                      border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <AdminBtn variant="ghost" onClick={onClose}>Cancel</AdminBtn>
          <AdminBtn variant="secondary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : productToEdit ? 'Update Product' : 'Save Product'}
          </AdminBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Products Section ──────────────────────────────────────────────────────────
export default function ProductsSection() {
  const { products, categories, colors, sizes, createProduct, updateProduct, deleteProduct } = useAdmin()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [stockFilter, setStockFilter] = useState('all') // 'all' | 'instock' | 'outstock'
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  // Calculate refined counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length }
    categories.forEach(cat => {
      const catIdStr = String(cat.id).toLowerCase()
      const catNameStr = cat.name?.toLowerCase()
      const count = products.filter(p => {
        if (p.categoryId != null && String(p.categoryId).toLowerCase() === catIdStr) return true
        if (Array.isArray(p.categoryIds) && p.categoryIds.some(id => String(id).toLowerCase() === catIdStr)) return true
        if (Array.isArray(p.categories)) {
          return p.categories.some(c => {
            if (typeof c === 'string') return c.toLowerCase() === catIdStr || (catNameStr && c.toLowerCase() === catNameStr)
            const cId = String(c.id ?? c.categoryId ?? '').toLowerCase()
            const cName = String(c.name || '').toLowerCase()
            return cId === catIdStr || (catNameStr && (cName === catNameStr || cName.includes(catNameStr)))
          })
        }
        if (p.category) {
          const pCat = String(p.category).toLowerCase()
          return pCat === catIdStr || (catNameStr && (pCat === catNameStr || pCat.includes(catNameStr)))
        }
        return false
      }).length
      counts[cat.id] = count
    })
    return counts
  }, [products, categories])

  const targetCatObj = categories.find(c => String(c.id) === String(selectedCat))
  const targetCatName = targetCatObj?.name?.toLowerCase()

  // Refined filtering: Search + Category + Stock status
  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const q = search.trim().toLowerCase()
        // 1. Search term matches Product Name, ID, Description, or Category Name!
        const matchSearch = !q ||
          p.name?.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.category && String(p.category).toLowerCase().includes(q)) ||
          (Array.isArray(p.categories) && p.categories.some(c => (typeof c === 'string' ? c : c.name || '').toLowerCase().includes(q)))

        // 2. Category selection match
        let matchCat = selectedCat === 'all'
        if (!matchCat) {
          const catIdStr = String(selectedCat).toLowerCase()
          if (p.categoryId != null && String(p.categoryId).toLowerCase() === catIdStr) matchCat = true
          if (Array.isArray(p.categoryIds) && p.categoryIds.some(id => String(id).toLowerCase() === catIdStr)) matchCat = true
          if (Array.isArray(p.categoryId) && p.categoryId.some(id => String(id).toLowerCase() === catIdStr)) matchCat = true
          if (!matchCat && Array.isArray(p.categories)) {
            matchCat = p.categories.some(c => {
              if (typeof c === 'string') {
                const cLower = c.toLowerCase()
                return cLower === catIdStr || (targetCatName && cLower === targetCatName)
              }
              if (c && typeof c === 'object') {
                const cId = String(c.id ?? c.categoryId ?? '').toLowerCase()
                const cName = String(c.name || '').toLowerCase()
                return cId === catIdStr || (targetCatName && (cName === targetCatName || cName.includes(targetCatName)))
              }
              return false
            })
          }
          if (!matchCat && p.category) {
            const pCat = String(p.category).toLowerCase()
            if (pCat === catIdStr || (targetCatName && (pCat === targetCatName || pCat.includes(targetCatName)))) {
              matchCat = true
            }
          }
        }

        // 3. Stock Status filter
        let matchStock = true
        if (stockFilter === 'instock') matchStock = (p.stockQuantity > 0 || p.inStock)
        if (stockFilter === 'outstock') matchStock = (!p.stockQuantity || p.stockQuantity <= 0 || p.inStock === false)

        return matchSearch && matchCat && matchStock
      })
      // Newest first sorting
      .sort((a, b) => {
        const idA = Number(a.productId ?? a.id) || 0
        const idB = Number(b.productId ?? b.id) || 0
        return idB - idA
      })
  }, [products, search, selectedCat, stockFilter, targetCatName])

  const isFilterActive = search.trim() !== '' || selectedCat !== 'all' || stockFilter !== 'all'

  const resetFilters = () => {
    setSearch('')
    setSelectedCat('all')
    setStockFilter('all')
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Products Catalogue"
        sub={`${products.length} active inventory items · ${filtered.length} showing`}
        action={
          <AdminBtn id="add-product-btn" variant="secondary" onClick={() => setShowAddModal(true)}>
            + Add Product
          </AdminBtn>
        }
      />

      {/* Refined Filter Toolbar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18, marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          
          {/* Left Controls: Search + Category Dropdown */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            
            {/* Search Input with Clear Button */}
            <div style={{ position: 'relative', minWidth: 240, flex: 1, maxWidth: 360 }}>
              <input
                id="product-search"
                placeholder="Search by product name, SKU, or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: 'var(--bg)', border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)', padding: '9px 34px 9px 14px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  outline: 'none', width: '100%', borderRadius: 'var(--radius)', boxSizing: 'border-box'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12
                  }}
                >✕</button>
              )}
            </div>

            {/* Category Select Dropdown for fast access */}
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)', padding: '8.5px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                outline: 'none', borderRadius: 'var(--radius)', cursor: 'pointer'
              }}
            >
              <option value="all">All Categories ({categoryCounts.all || 0})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({categoryCounts[c.id] || 0})
                </option>
              ))}
            </select>

            {/* Stock Status Filter */}
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)', padding: '8.5px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                outline: 'none', borderRadius: 'var(--radius)', cursor: 'pointer'
              }}
            >
              <option value="all">All Stock Status</option>
              <option value="instock">In Stock Only</option>
              <option value="outstock">Out of Stock</option>
            </select>

            {isFilterActive && (
              <button
                onClick={resetFilters}
                style={{
                  background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12.5,
                  fontWeight: 600, cursor: 'pointer', padding: '4px 8px'
                }}
              >
                Reset Filters ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle (Grid / List) */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', padding: 3, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '6px 12px', fontSize: 12, background: viewMode === 'grid' ? 'var(--accent)' : 'transparent', color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)', borderRadius: 4, fontWeight: viewMode === 'grid' ? 500 : 400, display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Grid
            </button>
            <button onClick={() => setViewMode('table')} style={{ padding: '6px 12px', fontSize: 12, background: viewMode === 'table' ? 'var(--accent)' : 'transparent', color: viewMode === 'table' ? '#fff' : 'var(--text-muted)', borderRadius: 4, fontWeight: viewMode === 'table' ? 500 : 400, display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              List
            </button>
          </div>

        </div>

        {/* Horizontal Category Quick Pills with Dynamic Counts */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginRight: 4 }}>Refine Category:</span>
          <button
            onClick={() => setSelectedCat('all')}
            style={{
              padding: '6px 14px', fontSize: 12.5, fontWeight: selectedCat === 'all' ? 600 : 400, cursor: 'pointer', borderRadius: 20,
              background: selectedCat === 'all' ? 'var(--accent)' : 'var(--bg)',
              color: selectedCat === 'all' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${selectedCat === 'all' ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            All
            <span style={{ fontSize: 11, opacity: 0.8, background: selectedCat === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--border)', padding: '1px 6px', borderRadius: 10 }}>
              {categoryCounts.all || 0}
            </span>
          </button>

          {categories.map(c => {
            const isSelected = String(selectedCat) === String(c.id)
            const count = categoryCounts[c.id] || 0
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                style={{
                  padding: '6px 14px', fontSize: 12.5, fontWeight: isSelected ? 600 : 400, cursor: 'pointer', borderRadius: 20,
                  background: isSelected ? 'var(--accent)' : 'var(--bg)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                {c.name}
                <span style={{ fontSize: 11, opacity: 0.8, background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--border)', padding: '1px 6px', borderRadius: 10 }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {filtered.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 60, textAlign: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: '0 auto 12px' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>No products match your refine criteria</p>
              <p style={{ margin: '4px 0 16px', fontSize: 12, color: 'var(--text-secondary)' }}>Try adjusting your search keyword, category selection, or stock status.</p>
              <AdminBtn variant="ghost" onClick={resetFilters}>Clear All Filters</AdminBtn>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
              {filtered.map(p => {
                let firstImg = null
                if (Array.isArray(p.images) && p.images.length > 0) {
                  const primary = p.images.find(img => img.isPrimary) || p.images[0]
                  firstImg = primary?.url || primary?.imageUrl || primary
                  if (typeof firstImg !== 'string') firstImg = null
                }
                if (!firstImg) {
                  try {
                    const stored = localStorage.getItem(`mk_prod_images_${p.id}`)
                    if (stored) {
                      const parsed = JSON.parse(stored)
                      if (Array.isArray(parsed) && parsed.length > 0) firstImg = parsed[0]
                    }
                  } catch {}
                }

                const catName = p.categories?.[0]?.name || p.category || (categories.find(c => String(c.id) === String(p.categoryId))?.name) || 'Apparel'

                return (
                  <div key={p.id} className="card-lift" style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ height: 160, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                      {firstImg ? (
                        <img src={firstImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                        </svg>
                      )}
                      <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <span style={{
                          fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                          background: (p.stockQuantity > 0 || p.inStock) ? 'var(--success-dim)' : 'var(--danger-dim)',
                          color: (p.stockQuantity > 0 || p.inStock) ? 'var(--success)' : 'var(--danger)',
                          border: `1px solid ${(p.stockQuantity > 0 || p.inStock) ? 'rgba(45,138,78,0.2)' : 'rgba(208,49,49,0.2)'}`
                        }}>
                          {(p.stockQuantity > 0 || p.inStock) ? `${p.stockQuantity || 'In'} Stock` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{catName}</span>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>ID: {p.id}</span>
                        </div>
                        <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{p.name}</h4>
                        {p.description && <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>₦{Number(p.price || 0).toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <AdminBtn variant="ghost" onClick={() => setEditProduct(p)}>Edit</AdminBtn>
                          <AdminBtn variant="danger" onClick={() => deleteProduct(p.id)}>Delete</AdminBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const catName = p.categories?.[0]?.name || p.category || (categories.find(c => String(c.id) === String(p.categoryId))?.name) || 'Apparel'
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12 }}>{p.id}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{catName}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>₦{Number(p.price || 0).toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: p.stockQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {p.stockQuantity || (p.inStock ? 'In Stock' : '0')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <AdminBtn variant="ghost" onClick={() => setEditProduct(p)}>Edit</AdminBtn>
                        <AdminBtn variant="danger" onClick={() => deleteProduct(p.id)}>Delete</AdminBtn>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAddModal || editProduct) && (
        <AddProductModal
          categories={categories}
          colors={colors}
          sizes={sizes}
          productToEdit={editProduct}
          onClose={() => { setShowAddModal(false); setEditProduct(null) }}
          onSave={editProduct ? (payload) => updateProduct(editProduct.id, payload) : createProduct}
        />
      )}
    </div>
  )
}
