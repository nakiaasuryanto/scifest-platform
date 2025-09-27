// Global copy protection utilities
export function setupCopyProtection() {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  // Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Disable Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+Shift+I, F12
    if (
      (e.ctrlKey || e.metaKey) &&
      ['c', 'a', 's', 'p', 'u', 'v', 'x'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault()
      showCopyWarning()
    }

    // Disable F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault()
      showCopyWarning()
    }

    // Disable Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      showCopyWarning()
    }

    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault()
      showCopyWarning()
    }

    // Disable Ctrl+Shift+C (Element inspector)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      showCopyWarning()
    }
  })

  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault()
  })

  // Disable text selection on double click
  document.addEventListener('selectstart', (e) => {
    if ((e.target as HTMLElement).closest('.copy-protected')) {
      e.preventDefault()
    }
  })

  // Disable print
  window.addEventListener('beforeprint', (e) => {
    alert('Pencetakan tidak diizinkan selama ujian!')
    e.preventDefault()
  })

  // Detect developer tools (basic detection)
  const detectDevTools = () => {
    const threshold = 160
    const widthThreshold = window.outerWidth - window.innerWidth > threshold
    const heightThreshold = window.outerHeight - window.innerHeight > threshold

    if (widthThreshold || heightThreshold) {
      console.clear()
      console.log('%cPeringatan!', 'color: red; font-size: 30px; font-weight: bold;')
      console.log('%cDeteksi Developer Tools terbuka!', 'color: red; font-size: 16px;')
      console.log('%cAkses ke developer tools tidak diizinkan selama ujian.', 'color: red; font-size: 14px;')
    }
  }

  // Check for dev tools periodically
  setInterval(detectDevTools, 1000)
}

export function showCopyWarning() {
  // Create a temporary warning message
  const warning = document.createElement('div')
  warning.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
  `
  warning.textContent = '⚠️ Copy/paste tidak diizinkan selama ujian!'

  document.body.appendChild(warning)

  // Remove warning after 3 seconds
  setTimeout(() => {
    if (warning.parentNode) {
      warning.parentNode.removeChild(warning)
    }
  }, 3000)
}

// Initialize protection when module is imported
if (typeof window !== 'undefined') {
  // Setup protection after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCopyProtection)
  } else {
    setupCopyProtection()
  }
}