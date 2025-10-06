import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import type { Question, ExamState } from '../../types/database'
import Timer from './Timer'
import QuestionNavigation from './QuestionNavigation'
import QuestionDisplay from './QuestionDisplay'
import logo from '../../assets/Logo.png'
import '../../utils/copyProtection'
import './ExamLayout.css'

const ExamLayout = () => {
  const { subtestId } = useParams<{ subtestId: string }>()
  const navigate = useNavigate()

  const currentSubtestId = parseInt(subtestId || '1')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExitModal, setShowExitModal] = useState(false)

  // Define subtest info with actual durations and question counts
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

  const [examState, setExamState] = useState<ExamState>({
    currentSubtest: currentSubtestId - 1,
    currentQuestion: 0,
    answers: {},
    doubtfulQuestions: new Set(),
    timeRemaining: currentSubtest?.duration * 60 || 0,
    isCompleted: false
  })

  useEffect(() => {
    let isMounted = true

    // Check if student has already completed exam
    const checkExamStatus = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        navigate('/login')
        return false
      }

      const { data: examResults } = await AuthService.getStudentExamResults(userId)

      // Check if all 7 subtests are completed
      if (examResults && examResults.length > 0) {
        const completedSubtests = new Set(examResults.map(result => result.subtest_id))
        if (completedSubtests.size >= 7) {
          // All subtests completed, redirect to dashboard
          navigate('/user-dashboard')
          return false
        }

        // Check if this specific subtest is already completed
        if (completedSubtests.has(currentSubtestId)) {
          // This subtest already completed, go to next one
          const nextSubtest = currentSubtestId + 1
          if (nextSubtest <= 7) {
            navigate(`/exam-waiting/${nextSubtest}`)
          } else {
            navigate('/user-dashboard')
          }
          return false
        }
      }

      return true
    }

    // Prevent back navigation with confirmation
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      setShowExitModal(true)
      window.history.pushState(null, '', window.location.href)
    }

    // Prevent page reload/close with confirmation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = '' // Chrome requires returnValue to be set
      return '' // Some browsers require a return value
    }

    // Push initial state and set up listeners
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    const loadQuestions = async () => {
      if (!currentSubtest) {
        navigate('/exam-rules')
        return
      }

      // Check exam status first
      const canProceed = await checkExamStatus()
      if (!canProceed) return

      setLoading(true)
      setError(null)

      try {
        console.log('🔍 Loading questions for subtest:', currentSubtestId)
        const startTime = Date.now()

        const { data: questionsData, error: questionsError } = await AuthService.getQuestionsBySubtest(currentSubtestId)

        const loadTime = Date.now() - startTime
        console.log('⏱️ Questions loaded in', loadTime, 'ms')

        if (!isMounted) return

        if (questionsError) {
          console.error('❌ Error loading questions:', questionsError)
          setError('Failed to load questions. Please try again.')
          return
        }

        if (!questionsData || questionsData.length === 0) {
          console.log('📭 No questions found for subtest', currentSubtestId)
          setError('No questions found for this subtest. Please contact the administrator to add questions.')
          return
        }

        console.log('✅ Loaded', questionsData.length, 'questions')
        setQuestions(questionsData)
        setExamState(prev => ({
          ...prev,
          currentSubtest: currentSubtestId - 1,
          timeRemaining: currentSubtest.duration * 60
        }))
      } catch (err) {
        console.error('💥 Error loading questions:', err)
        if (isMounted) {
          setError('Failed to load questions. Please check your connection and try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadQuestions()

    return () => {
      isMounted = false
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentSubtestId, navigate])

  const handleAnswerSelect = (optionIndex: number) => {
    const questionKey = `${examState.currentSubtest}-${examState.currentQuestion}`
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: optionIndex
      }
    }))
  }

  const handleQuestionNavigation = (questionIndex: number) => {
    setExamState(prev => ({
      ...prev,
      currentQuestion: questionIndex
    }))
  }

  const handlePreviousQuestion = () => {
    if (examState.currentQuestion > 0) {
      setExamState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }))
    }
  }

  const handleNextQuestion = () => {
    if (examState.currentQuestion < questions.length - 1) {
      setExamState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }))
    } else {
      handleSubmitSubtest()
    }
  }

  const handleDoubtful = () => {
    const questionKey = `${examState.currentSubtest}-${examState.currentQuestion}`
    setExamState(prev => {
      const newDoubtfulQuestions = new Set(prev.doubtfulQuestions)
      if (newDoubtfulQuestions.has(parseInt(questionKey))) {
        newDoubtfulQuestions.delete(parseInt(questionKey))
      } else {
        newDoubtfulQuestions.add(parseInt(questionKey))
      }
      return {
        ...prev,
        doubtfulQuestions: newDoubtfulQuestions
      }
    })
  }

  const handleSubmitSubtest = async () => {
    try {
      // Calculate score - each question has equal points
      const correctAnswers = questions.filter((question, index) => {
        const questionKey = `${examState.currentSubtest}-${index}`
        const selectedAnswer = examState.answers[questionKey]
        return selectedAnswer !== undefined && selectedAnswer === question.correct_answer
      }).length

      // Calculate score: 1000 points / total questions in this subtest
      const pointsPerQuestion = questions.length > 0 ? (1000 / questions.length) : 0
      const rawScore = correctAnswers * pointsPerQuestion
      // Round to nearest integer (>0.5 rounds up)
      const score = Math.round(rawScore)
      const wrongAnswers = questions.length - correctAnswers

      // Prepare detailed answers
      const detailedAnswers = questions.map((question, index) => {
        const questionKey = `${examState.currentSubtest}-${index}`
        const selectedAnswer = examState.answers[questionKey]
        return {
          question_id: question.id,
          selected_answer: selectedAnswer !== undefined ? selectedAnswer : -1,
          correct_answer: question.correct_answer,
          is_correct: selectedAnswer !== undefined && selectedAnswer === question.correct_answer,
          time_spent: 0 // TODO: implement time tracking per question
        }
      })

      // Save exam result
      const userId = localStorage.getItem('userId')
      if (userId) {
        const examResult = {
          student_id: userId,
          subtest_id: currentSubtestId,
          subtest_name: currentSubtest.name,
          score: score, // Already rounded score out of 1000
          total_questions: questions.length,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          completed_at: new Date().toISOString(),
          duration: (currentSubtest.duration * 60) - examState.timeRemaining,
          answers: detailedAnswers
        }

        console.log('💾 Saving exam result:', examResult)
        const { data: saveData, error: saveError } = await AuthService.saveExamResult(examResult)
        if (saveError) {
          console.error('❌ Error saving exam result:', saveError)
        } else {
          console.log('✅ Exam result saved successfully:', saveData)
        }
      } else {
        console.error('❌ No userId found in localStorage')
      }

      // Move to next subtest or finish
      const nextSubtestId = currentSubtestId + 1
      if (nextSubtestId <= 7) {
        // Navigate to waiting page before next subtest
        navigate(`/exam-waiting/${nextSubtestId}`)
      } else {
        setExamState(prev => ({ ...prev, isCompleted: true }))
        navigate('/exam-completed')
      }
    } catch (error) {
      console.error('Error submitting subtest:', error)
      alert('Error submitting exam. Please try again.')
    }
  }

  const handleTimeUp = () => {
    alert('Waktu habis! Melanjutkan ke subtest berikutnya.')
    handleSubmitSubtest()
  }

  const handleExitConfirm = () => {
    // Clear user session and navigate to login
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  const handleExitCancel = () => {
    setShowExitModal(false)
  }

  if (loading) {
    return (
      <div className="exam-layout">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>
        <div className="exam-header">
          <div className="subtest-title">
            <h1>Loading Subtest {currentSubtestId}...</h1>
            <p className="subtest-details">Please wait while we prepare your questions</p>
          </div>
        </div>
        <div className="exam-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="exam-layout">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>
        <div className="exam-header">
          <div className="subtest-title">
            <h1>Subtest {currentSubtestId}</h1>
            <p className="subtest-details">Error loading questions</p>
          </div>
        </div>
        <div className="exam-content">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button className="nav-btn next" onClick={() => navigate('/exam-rules')}>
              Back to Exam Rules
            </button>
            <button className="nav-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSubtest || questions.length === 0) {
    return (
      <div className="exam-layout">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>
        <div className="exam-header">
          <div className="subtest-title">
            <h1>Subtest {currentSubtestId}</h1>
            <p className="subtest-details">No questions available</p>
          </div>
        </div>
        <div className="exam-content">
          <div className="error-container">
            <div className="error-message">
              No questions found for this subtest. Please contact the administrator to add questions.
            </div>
            <button className="nav-btn next" onClick={() => navigate('/exam-rules')}>
              Back to Exam Rules
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[examState.currentQuestion]
  const questionKey = `${examState.currentSubtest}-${examState.currentQuestion}`

  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    // Disable common shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'p' || e.key === 'u')) {
      e.preventDefault()
    }
    // Disable F12 and other dev tools shortcuts
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault()
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className="exam-layout copy-protected"
      onKeyDown={handleGlobalKeyDown}
      onContextMenu={handleContextMenu}
      tabIndex={-1}
    >
      <div className="exam-header">
        <div className="exam-logo-container">
          <img src={logo} alt="Logo" className="exam-logo" />
        </div>
        <div className="subtest-title">
          <h1>Subtest {currentSubtestId}: {currentSubtest.name}</h1>
          <p className="subtest-details">
            Durasi: {currentSubtest.duration % 1 === 0 ? currentSubtest.duration : currentSubtest.duration} menit |
            {currentSubtest.questionCount} soal |
            Soal {examState.currentQuestion + 1} dari {questions.length}
          </p>
        </div>
        <Timer
          timeRemaining={examState.timeRemaining}
          onTimeUp={handleTimeUp}
          setTimeRemaining={(time) => setExamState(prev => ({ ...prev, timeRemaining: time }))}
        />
      </div>

      <div className="exam-content">
        <div className="question-navigation-panel">
          <QuestionNavigation
            questions={questions}
            currentQuestion={examState.currentQuestion}
            answers={examState.answers}
            doubtfulQuestions={examState.doubtfulQuestions}
            subtestIndex={examState.currentSubtest}
            onQuestionSelect={handleQuestionNavigation}
          />
        </div>

        <div className="question-display-panel">
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={examState.answers[questionKey]}
            onAnswerSelect={handleAnswerSelect}
          />

          <div className="navigation-controls">
            <button
              className="nav-btn previous"
              onClick={handlePreviousQuestion}
              disabled={examState.currentQuestion === 0}
            >
              Previous
            </button>

            <button
              className="nav-btn doubtful"
              onClick={handleDoubtful}
            >
              Ragu-ragu
            </button>

            <button
              className="nav-btn next"
              onClick={handleNextQuestion}
            >
              {examState.currentQuestion === questions.length - 1 ? 'Selesai' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Anda yakin meninggalkan ujian?</h3>
            <p>Jawaban tidak akan tersimpan dan Anda akan logout dari sistem.</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleExitCancel}>
                Tidak
              </button>
              <button className="confirm-btn" onClick={handleExitConfirm}>
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamLayout