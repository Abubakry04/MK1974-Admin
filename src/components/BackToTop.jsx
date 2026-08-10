import React, { useState, useEffect } from 'react'

/**
 * BackToTop - Universal Floating Scroll-To-Top Button
 * Catches scroll events from window, document, and any overflow containers in capture phase.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      let maxScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0

      // Check all potential scroll containers in the document
      const elements = document.querySelectorAll('div, section, main, article')
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].scrollTop > maxScroll) {
          maxScroll = elements[i].scrollTop
        }
      }

      setVisible(maxScroll > 100)
    }

    checkScroll()

    // Capture phase event listener catches scroll events from ANY scrollable child
    window.addEventListener('scroll', checkScroll, { capture: true, passive: true })
    
    // Interval check for dynamic page layout shifts
    const intervalId = setInterval(checkScroll, 500)

    return () => {
      window.removeEventListener('scroll', checkScroll, { capture: true })
      clearInterval(intervalId)
    }
  }, [])

  const handleScrollToTop = () => {
    // 1. Scroll window and document
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (e) {
      window.scrollTo(0, 0)
    }

    // 2. Scroll any overflow-y containers in DOM
    const scrollContainers = document.querySelectorAll('div, section, main, article')
    scrollContainers.forEach(el => {
      if (el.scrollTop > 0) {
        try {
          el.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        } catch (e) {
          el.scrollTop = 0
        }
      }
    })
  }

  if (!visible) return null

  return (
    <button
      id="back-to-top-btn"
      onClick={handleScrollToTop}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: '#121212',
        color: '#CCFF00',
        border: '1.5px solid #CCFF00',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(204, 255, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        outline: 'none',
      }}
      className="animate-fade-in group hover:scale-110 active:scale-95"
      onMouseEnter={e => {
        e.currentTarget.style.background = '#CCFF00'
        e.currentTarget.style.color = '#121212'
        e.currentTarget.style.borderColor = '#CCFF00'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(204, 255, 0, 0.5), 0 0 20px rgba(204, 255, 0, 0.6)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#121212'
        e.currentTarget.style.color = '#CCFF00'
        e.currentTarget.style.borderColor = '#CCFF00'
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(204, 255, 0, 0.4)'
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'transform 0.2s ease' }}
        className="group-hover:-translate-y-1"
      >
        <path d="M12 19V5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  )
}
