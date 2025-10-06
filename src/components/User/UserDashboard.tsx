import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import type { ExamResult } from '../../types/database'
import { shouldDisplayScores, getCalibrationWaitingMessage, getSystemScoringStatus } from '../../utils/scoringStatus'
import logo from '../../assets/Logo.png'
import './UserDashboard.css'

const UserDashboard = () => {
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCompletedStudents, setAllCompletedStudents] = useState<string[]>([])
  const [showScores, setShowScores] = useState(false)
  const navigate = useNavigate()

  const userName = localStorage.getItem('userName') || 'Peserta'
  const userId = localStorage.getItem('userId')

  // Subtest info for display
  const subtestInfo = {
    1: { name: "Penalaran Umum", duration: 30, questionCount: 30 },
    2: { name: "Pengetahuan dan Pemahaman Umum", duration: 15, questionCount: 20 },
    3: { name: "Pemahaman Bacaan dan Menulis", duration: 25, questionCount: 20 },
    4: { name: "Pengetahuan Kuantitatif", duration: 20, questionCount: 20 },
    5: { name: "Literasi Bahasa Indonesia", duration: 42.5, questionCount: 20 },
    6: { name: "Literasi Bahasa Inggris", duration: 20, questionCount: 20 },
    7: { name: "Penalaran Matematika", duration: 42.5, questionCount: 20 }
  }

  useEffect(() => {
    const loadExamResults = async () => {
      if (!userId) {
        navigate('/login')
        return
      }

      try {
        console.log('🔍 Fetching exam results for userId:', userId)
        const { data: results, error: resultsError } = await AuthService.getStudentExamResults(userId)

        if (resultsError) {
          console.error('❌ Error loading exam results:', resultsError)
          setError('Failed to load exam results')
          return
        }

        console.log('📊 Fetched exam results:', results)
        setExamResults(results || [])

        // Get all completed students for calibration status
        const { data: allStudents, error: studentsError } = await AuthService.getAllCompletedStudents()
        if (!studentsError && allStudents) {
          const completedStudentIds = allStudents.map((s: any) => s.id)
          setAllCompletedStudents(completedStudentIds)

          // Check if this student should see scores
          if (userId) {
            const canShowScores = shouldDisplayScores(userId, completedStudentIds)
            setShowScores(canShowScores)
          }
        }
      } catch (err) {
        console.error('💥 Error:', err)
        setError('Failed to load exam results')
      } finally {
        setLoading(false)
      }
    }

    loadExamResults()
  }, [userId, navigate])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    navigate('/login')
  }


  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-excellent'
    if (score >= 70) return 'score-good'
    if (score >= 60) return 'score-average'
    return 'score-poor'
  }

  const getIRTScores = () => {
    if (examResults.length === 0) return { totalScore: 0, averageScore: 0, percentile: 0 }

    // Get best result for each subtest
    const bestResults = new Map()
    examResults.forEach(result => {
      const currentBest = bestResults.get(result.subtest_id)
      if (!currentBest || result.score > currentBest.score) {
        bestResults.set(result.subtest_id, result)
      }
    })

    if (bestResults.size === 0) return { totalScore: 0, averageScore: 0, percentile: 0 }

    // Sum all subtest scores and divide by 7
    const sumOfScores = Array.from(bestResults.values()).reduce((sum, result) => sum + result.score, 0)
    const totalScore = Math.round(sumOfScores / 7)
    const averageScore = totalScore

    return {
      totalScore,
      averageScore,
      percentile: 0 // Not using percentile anymore
    }
  }

  const getCompletionStatus = () => {
    const uniqueSubtests = new Set(examResults.map(result => result.subtest_id))
    const completedSubtests = uniqueSubtests.size
    return {
      completed: completedSubtests,
      total: 7,
      percentage: Math.round((completedSubtests / 7) * 100)
    }
  }

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const completionStatus = getCompletionStatus()
  const irtScores = showScores ? getIRTScores() : { totalScore: 0, averageScore: 0, percentile: 0 }
  const systemStatus = getSystemScoringStatus(allCompletedStudents)

  // If student has completed exam but scores aren't ready, show waiting message
  if (examResults.length > 0 && !showScores) {
    return (
      <div className="user-dashboard">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="welcome-section">
                <h1>Dashboard Hasil Ujian</h1>
                <p className="welcome-text">Selamat datang, <strong>{userName}</strong></p>
              </div>
              <div className="header-actions">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="calibration-waiting">
            <div className="waiting-card">
              <div className="waiting-icon">⏳</div>
              <h2>Ujian Telah Selesai</h2>
              <p className="waiting-message">
                {getCalibrationWaitingMessage(systemStatus.totalStudentsCompleted)}
              </p>
              <div className="calibration-progress">
                <div className="progress-info">
                  <span>Progress Kalibrasi: {systemStatus.totalStudentsCompleted}/5 peserta</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, (systemStatus.totalStudentsCompleted / 5) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="info-text">
                Skor akan ditampilkan otomatis setelah sistem kalibrasi selesai.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="user-dashboard">
      <div className="exam-logo-container">
        <img src={logo} alt="Logo" className="exam-logo" />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Dashboard Hasil Ujian</h1>
              <p className="welcome-text">Selamat datang, <strong>{userName}</strong></p>
            </div>
            <div className="header-actions">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Subtest Scores Grid */}
        <div className="scores-section">
          <h2>Skor Per Subtest</h2>

          {/* First Row: Subtests 1-4 */}
          <div className="scores-row">
            {[1, 2, 3, 4].map(subtestId => {
              const info = subtestInfo[subtestId as keyof typeof subtestInfo]
              const subtestResults = examResults.filter(r => r.subtest_id === subtestId)
              const bestResult = subtestResults.length > 0
                ? subtestResults.reduce((best, current) => current.score > best.score ? current : best)
                : null

              return (
                <div key={subtestId} className={`score-card ${bestResult ? 'completed' : 'not-completed'}`}>
                  <div className="score-card-header">
                    <div className="subtest-badge">Subtest {subtestId}</div>
                    <h4>{info.name}</h4>
                  </div>
                  <div className="score-value">
                    {bestResult ? `${bestResult.score}/1000` : '-'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Second Row: Subtests 5-7 */}
          <div className="scores-row">
            {[5, 6, 7].map(subtestId => {
              const info = subtestInfo[subtestId as keyof typeof subtestInfo]
              const subtestResults = examResults.filter(r => r.subtest_id === subtestId)
              const bestResult = subtestResults.length > 0
                ? subtestResults.reduce((best, current) => current.score > best.score ? current : best)
                : null

              return (
                <div key={subtestId} className={`score-card ${bestResult ? 'completed' : 'not-completed'}`}>
                  <div className="score-card-header">
                    <div className="subtest-badge">Subtest {subtestId}</div>
                    <h4>{info.name}</h4>
                  </div>
                  <div className="score-value">
                    {bestResult ? `${bestResult.score}/1000` : '-'}
                  </div>
                </div>
              )
            })}
            {/* Empty placeholder to maintain grid */}
            <div className="score-card placeholder"></div>
          </div>

          {/* Third Row: Total Score */}
          <div className="scores-row total-row">
            <div className="total-score-card">
              <div className="total-score-header">
                <div className="card-icon">🎯</div>
                <h3>Skor Total</h3>
              </div>
              <div className={`total-score-value ${getScoreColor(irtScores.totalScore/10)}`}>
                {irtScores.totalScore}/1000
              </div>
              <div className="score-details">
                <span>Progress: {completionStatus.completed}/7 subtest</span>
              </div>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2>Hasil Detail Per Subtest</h2>

          {examResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📝</div>
              <h3>Belum Ada Hasil Ujian</h3>
              <p>Anda belum mengerjakan ujian. Silakan hubungi administrator untuk memulai ujian.</p>
            </div>
          ) : (
            <div className="results-grid">
              {Object.entries(subtestInfo).map(([subtestId, info]) => {
                // Get best result for this subtest
                const subtestResults = examResults.filter(r => r.subtest_id === parseInt(subtestId))
                const bestResult = subtestResults.length > 0
                  ? subtestResults.reduce((best, current) => current.score > best.score ? current : best)
                  : null
                const attempts = subtestResults.length

                return (
                  <div key={subtestId} className={`result-card ${bestResult ? 'completed' : 'not-completed'}`}>
                    <div className="result-header">
                      <div className="subtest-number">{subtestId}</div>
                      <div className="subtest-info">
                        <h4>{info.name}</h4>
                        <p>{info.questionCount} soal • {info.duration} menit</p>
                        {attempts > 1 && <p style={{color: '#666', fontSize: '12px'}}>Percobaan: {attempts}x</p>}
                      </div>
                    </div>

                    {bestResult ? (
                      <div className="result-details">
                        <div className={`score-badge ${getScoreColor(bestResult.score / 10)}`}>
                          {bestResult.score}/1000
                        </div>
                        <div className="result-stats">
                          <div className="stat">
                            <span className="stat-label">Benar:</span>
                            <span className="stat-value">{bestResult.correct_answers}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Salah:</span>
                            <span className="stat-value">{bestResult.wrong_answers}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Waktu:</span>
                            <span className="stat-value">{Math.round(bestResult.duration / 60)} menit</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="not-completed-message">
                        <span>Belum dikerjakan</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard