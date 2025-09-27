import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import './ExamCompleted.css'

const ExamCompleted = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [userName] = useState(localStorage.getItem('userName') || 'Peserta')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/user-dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleGoToDashboard = () => {
    navigate('/user-dashboard')
  }

  return (
    <div className="exam-completed">
      <div className="exam-logo-container">
        <img src={logo} alt="Logo" className="exam-logo" />
      </div>

      <div className="completion-content">
        <div className="unified-completion-card">
          {/* Header with success icon */}
          <div className="completion-header">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="var(--primary-green)"
                  strokeWidth="2"
                  fill="var(--primary-green)"
                  fillOpacity="0.1"
                  className="check-circle"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="var(--primary-green)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="check-mark"
                />
              </svg>
            </div>
            <div className="completion-title">
              <h1>Selamat, {userName}!</h1>
              <h2>Ujian Telah Selesai</h2>
            </div>
          </div>

          {/* Divider */}
          <div className="card-divider"></div>

          {/* Completion stats */}
          <div className="completion-summary">
            <p className="completion-message">
              Anda telah menyelesaikan seluruh ujian dengan baik!
            </p>

            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-icon">📋</span>
                <span className="summary-text">7 Subtest Selesai</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">✅</span>
                <span className="summary-text">Status: Lengkap</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">🎯</span>
                <span className="summary-text">Hasil Tersimpan</span>
              </div>
            </div>
          </div>

          {/* Next steps info */}
          <div className="next-steps-compact">
            <h3>Langkah Selanjutnya</h3>
            <div className="steps-list">
              <span>✓ Hasil ujian diproses otomatis</span>
              <span>✓ Skor dan analisis tersedia di dashboard</span>
              <span>✓ Dapat dilihat kapan saja</span>
            </div>
          </div>

          {/* Action section with countdown */}
          <div className="action-section">
            <div className="redirect-info-compact">
              <div className="countdown-timer">{countdown}</div>
              <div className="countdown-label">
                <span>Ke dashboard dalam</span>
                <span className="countdown-unit">{countdown} detik</span>
              </div>
            </div>

            <button className="dashboard-btn" onClick={handleGoToDashboard}>
              Lihat Hasil Sekarang
            </button>
          </div>

          {/* Celebration message */}
          <div className="celebration-footer">
            <p>🎉 Semoga hasil ujian Anda memuaskan! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamCompleted