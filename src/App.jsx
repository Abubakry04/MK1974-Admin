import React, { Component } from 'react'
import { AppProvider } from './context/AppContext'
import { AdminProvider } from './admin/context/AdminContext'
import AdminLayout from './admin/AdminLayout'
import Toast from './components/Toast'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin ErrorBoundary Caught]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F0F0F',
          color: '#FFFFFF',
          padding: 32,
          fontFamily: "'DM Sans', sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 8px' }}>Something went wrong</h2>
          <p style={{ fontSize: 13, color: '#888888', maxWidth: 460, margin: '0 0 24px', lineHeight: 1.6 }}>
            {this.state.error?.message || 'An unexpected rendering error occurred in the admin panel.'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('mk1974_admin')
              window.location.reload()
            }}
            style={{
              background: '#FFFFFF',
              color: '#0F0F0F',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reset Session & Reload Admin
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AdminProvider>
          <AdminLayout />
          <Toast />
        </AdminProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}
