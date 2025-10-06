import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import '../shared/Logo.css'
import './ExamWaiting.css'

const ExamWaiting = () => {
  const { subtestId } = useParams<{ subtestId: string }>()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  const currentSubtestId = parseInt(subtestId || '1')

  // Define subtest info (same as ExamLayout)
  const subtestInfo = {
    1: { name: "Penalaran Umum", duration: 30, questionCount: 30 },
    2: { name: "Pengetahuan dan Pemahaman Umum", duration: 15, questionCount: 20 },
    3: { name: "Pemahaman Bacaan dan Menulis", duration: 25, questionCount: 20 },
    4: { name: "Pengetahuan Kuantitatif", duration: 20, questionCount: 20 },
    5: { name: "Literasi Bahasa Indonesia", duration: 42.5, questionCount: 20 },
    6: { name: "Literasi Bahasa Inggris", duration: 20, questionCount: 20 },
    7: { name: "Penalaran Matematika", duration: 42.5, questionCount: 20 }
  }

  const currentSubtest = subtestInfo[currentSubtestId as keyof typeof subtestInfo]
  const previousSubtest = subtestInfo[(currentSubtestId - 1) as keyof typeof subtestInfo]

  useEffect(() => {
    // Prevent back navigation
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }

    // Push initial state and set up listener
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate(`/exam/${currentSubtestId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate, currentSubtestId])

  const handleStartNow = () => {
    navigate(`/exam/${currentSubtestId}`)
  }

  if (!currentSubtest) {
    navigate('/exam-rules')
    return null
  }

  return (
    <div className="exam-waiting">
      <div className="exam-logo-container">
        <img src={logo} alt="Logo" className="exam-logo" />
      </div>

      <div className="waiting-content">
        <div className="unified-waiting-card">
          {/* Header with completion status */}
          <div className="card-header">
            <div className="completion-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="var(--primary-green)" strokeWidth="2" fill="var(--primary-green)" fillOpacity="0.1"/>
                <path d="m9 12 2 2 4-4" stroke="var(--primary-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h2>Subtest {currentSubtestId - 1} Selesai</h2>
              <p>{previousSubtest?.name} berhasil diselesaikan</p>
            </div>
          </div>

          {/* Divider */}
          <div className="card-divider"></div>

          {/* Next subtest info */}
          <div className="next-subtest-section">
            <div className="subtest-header">
              <div className="subtest-badge">{currentSubtestId}</div>
              <div className="subtest-title">
                <h3>Subtest Selanjutnya</h3>
                <h4>{currentSubtest.name}</h4>
              </div>
            </div>

            <div className="subtest-details-compact">
              <div className="detail-item">
                <span className="detail-icon">📋</span>
                <span className="detail-text">{currentSubtest.questionCount} soal</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏱️</span>
                <span className="detail-text">{currentSubtest.duration} menit</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📊</span>
                <span className="detail-text">{currentSubtestId - 1}/7 selesai</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentSubtestId - 1) / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Countdown and action */}
          <div className="action-section">
            <div className="countdown-compact">
              <div className="countdown-timer">{countdown}</div>
              <div className="countdown-label">
                <span>Mulai otomatis dalam</span>
                <span className="countdown-unit">{countdown} detik</span>
              </div>
            </div>

            <button className="start-now-btn" onClick={handleStartNow}>
              Mulai Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamWaiting