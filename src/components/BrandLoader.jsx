import React from 'react'
import mkLogo from '../assets/mk2.png'

/**
 * BrandLoader - Premium MK 1974 Brand Logo Loader
 *
 * Props:
 * - message: Subtitle string (e.g. "Loading catalog...", "Syncing live data...")
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - dark: boolean (force dark mode theme overlay vs light mode)
 * - fullScreen: boolean (full-screen backdrop overlay)
 * - inline: boolean (compact horizontal loader for buttons/small cards)
 */
export default function BrandLoader({
  message = 'Loading...',
  size = 'md',
  dark = false,
  fullScreen = false,
  inline = false,
  className = ''
}) {
  const dimensions = {
    sm: { logoHeight: 20, ringSize: 42, text: 10, gap: 8 },
    md: { logoHeight: 32, ringSize: 64, text: 12, gap: 12 },
    lg: { logoHeight: 46, ringSize: 84, text: 13, gap: 16 },
    xl: { logoHeight: 64, ringSize: 110, text: 15, gap: 20 },
  }[size] || { logoHeight: 32, ringSize: 64, text: 12, gap: 12 }

  if (inline) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} className={className}>
        <span style={{
          position: 'relative',
          width: dimensions.logoHeight + 12,
          height: dimensions.logoHeight + 12,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(30,31,33,0.15)'}`,
            borderTopColor: dark ? '#FFFFFF' : 'var(--accent, #968574)',
            animation: 'spin 0.9s linear infinite',
          }} />
          <img
            src={mkLogo}
            alt="MK 1974"
            style={{
              height: dimensions.logoHeight,
              width: 'auto',
              filter: dark ? 'invert(1)' : 'none',
              animation: 'logo-pulse 1.8s ease-in-out infinite',
              objectFit: 'contain'
            }}
          />
        </span>
        {message && (
          <span style={{
            fontSize: dimensions.text,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'currentColor'
          }}>
            {message}
          </span>
        )}
      </span>
    )
  }

  const containerStyle = fullScreen ? {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: dark ? 'rgba(15, 15, 15, 0.96)' : 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dimensions.gap,
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    gap: dimensions.gap,
    width: '100%',
  }

  return (
    <div style={containerStyle} className={`brand-loader-wrapper animate-fade-in ${className}`}>
      <div style={{
        position: 'relative',
        width: dimensions.ringSize,
        height: dimensions.ringSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Rotating Outer Accent Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(30,31,33,0.1)'}`,
          borderTopColor: dark ? '#FFFFFF' : 'var(--accent, #968574)',
          borderRightColor: dark ? 'rgba(255,255,255,0.35)' : 'rgba(150,133,116,0.35)',
          animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }} />

        {/* Soft Radial Glow Backdrop */}
        <div style={{
          position: 'absolute',
          inset: 6,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(150,133,116,0.12) 0%, transparent 70%)',
          animation: 'logo-pulse 2s ease-in-out infinite',
        }} />

        {/* Brand Logo Image */}
        <img
          src={mkLogo}
          alt="MK 1974"
          style={{
            height: dimensions.logoHeight,
            width: 'auto',
            filter: dark ? 'invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.25))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
            animation: 'logo-pulse 2s ease-in-out infinite',
            userSelect: 'none',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Caption Text */}
      {message && (
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: 0,
            fontSize: dimensions.text,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: dark ? '#FFFFFF' : '#1E1F21',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {message}
          </p>
          <span style={{
            display: 'block',
            fontSize: 9,
            letterSpacing: '0.28em',
            color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(30,31,33,0.45)',
            textTransform: 'uppercase',
            marginTop: 4,
            fontWeight: 600,
            fontFamily: "'Cormorant Garamond', serif"
          }}>
            MK 1974
          </span>
        </div>
      )}
    </div>
  )
}
