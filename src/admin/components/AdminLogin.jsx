import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

export default function AdminLogin() {
  const { adminLogin } = useAdmin()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setError('')
    setLoading(true)
    const result = await adminLogin(form)
    if (!result.success) setError(result.error)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: '#FAF9F6', border: '1px solid rgba(30,31,33,0.12)',
    color: '#1E1F21', padding: '12px 16px', fontSize: 13, fontFamily: "'Inter', sans-serif",
    outline: 'none', boxSizing: 'border-box', borderRadius: 4, transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden'
    }}>
      {/* Dynamic Background Pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(150,133,116,0.12) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px', position: 'relative', zIndex: 1 }} className="animate-fade-in">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, background: 'linear-gradient(135deg, #968574 0%, #786858 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 28px -6px rgba(150,133,116,0.4)', borderRadius: 6
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: '#FAF9F6', fontStyle: 'italic' }}>MK</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#968574', margin: 0, fontWeight: 700 }}>MK 1974</p>
              <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.5)', margin: '2px 0 0', fontWeight: 500 }}>Admin Portal</p>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#1E1F21', fontSize: 32, margin: '8px 0 0' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(30,31,33,0.6)', fontSize: 13, fontWeight: 400, marginTop: 8, marginBottom: 0 }}>
            Sign in to manage your storefront dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: '#ffffff', border: '1px solid rgba(30,31,33,0.08)',
            padding: '36px 32px', borderRadius: 8, boxShadow: '0 20px 40px -15px rgba(30,31,33,0.05)',
            marginBottom: 20
          }}>
            {/* Email */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.6)', marginBottom: 8, fontWeight: 600 }}>
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@mk1974.com"
                value={form.email}
                onChange={set('email')}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#968574'; e.target.style.boxShadow = '0 0 0 3px rgba(150,133,116,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(30,31,33,0.12)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(30,31,33,0.6)', marginBottom: 8, fontWeight: 600 }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#968574'; e.target.style.boxShadow = '0 0 0 3px rgba(150,133,116,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(30,31,33,0.12)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                padding: '12px 16px', marginBottom: 24, fontSize: 12, color: '#dc2626', borderRadius: 4
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#b2aca3' : '#1E1F21', color: '#FAF9F6',
                border: 'none', padding: '14px 24px', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.25em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif", borderRadius: 4, transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(30,31,33,0.15)'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#968574'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1E1F21'; }}
            >
              {loading ? 'Authenticating…' : 'Sign In to Control Panel'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'rgba(30,31,33,0.5)', letterSpacing: '0.05em' }}>
          <a href="http://localhost:5173" style={{ color: '#968574', textDecoration: 'none', fontWeight: 600 }}>← Back to Storefront</a>
        </p>
      </div>
    </div>
  )
}
