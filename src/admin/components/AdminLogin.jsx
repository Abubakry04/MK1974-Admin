import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import mkLogo from '../../assets/mk2.png'

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      background: '#FAFAFA',
    }}>
      {/* Left — Brand Panel */}
      <div
        className="mobile-hide"
        style={{
          width: '42%',
          background: '#0F0F0F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 52px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle texture layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(196,98,45,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,98,45,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <img
            src={mkLogo}
            alt="MK 1974"
            style={{ height: 44, width: 'auto', filter: 'invert(1)', opacity: 0.92 }}
          />
        </div>

        {/* Editorial copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 38,
            color: '#FFFFFF',
            lineHeight: 1.25,
            margin: '0 0 24px',
            letterSpacing: '-0.01em',
          }}>
            Where craft meets<br />
            <span style={{ color: 'var(--accent)' }}>control.</span>
          </p>
          <p style={{
            fontSize: 13.5,
            color: '#888888',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 300,
            fontWeight: 400,
          }}>
            Manage your catalogue, orders, and customers from one unified platform.
          </p>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: '#555555',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#AAAAAA'}
            onMouseLeave={e => e.currentTarget.style.color = '#555555'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Storefront
          </a>
        </div>
      </div>

      {/* Right — Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-up">
          {/* Mobile brand logo — standalone logo mark */}
          <div className="desktop-hide" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}>
              <img
                src={mkLogo}
                alt="Brand Logo"
                style={{
                  height: 34,
                  width: 'auto',
                  display: 'block',
                  filter: 'brightness(0)',
                }}
              />
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 34,
              color: '#111111',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}>
              Sign in
            </h1>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              margin: 0,
              fontWeight: 400,
            }}>
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: '#444',
                marginBottom: 7,
              }}>
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="you@mk1974.com"
                value={form.email}
                onChange={set('email')}
                required
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-strong)',
                  color: '#111',
                  padding: '11px 14px',
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  borderRadius: 'var(--radius)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(196,98,45,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border-strong)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: '#444',
                marginBottom: 7,
              }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-strong)',
                  color: '#111',
                  padding: '11px 14px',
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  borderRadius: 'var(--radius)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(196,98,45,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border-strong)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'var(--danger-dim)',
                border: '1px solid rgba(208,49,49,0.2)',
                padding: '11px 14px',
                marginBottom: 20,
                fontSize: 13,
                color: 'var(--danger)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#B8A898' : 'var(--accent)',
                color: '#FFFFFF',
                border: 'none',
                padding: '13px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: 'var(--radius)',
                transition: 'background 0.2s, transform 0.15s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#A8501F' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
            >
              {loading ? 'Signing in…' : 'Sign in to Admin'}
            </button>
          </form>

          {/* Mobile storefront link */}
          <p className="desktop-hide" style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            <a href="http://localhost:5173" style={{ color: 'var(--accent)', fontWeight: 500 }}>← Back to Storefront</a>
          </p>
        </div>
      </div>
    </div>
  )
}
