import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import { addSampleQuestions } from '../../utils/addSampleQuestions'
import logo from '../../assets/Logo.png'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [students, setStudents] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [addingQuestions, setAddingQuestions] = useState(false)
  const [questionMessage, setQuestionMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load students from Supabase
        const { data: studentsData, error: studentsError } = await AuthService.getAllStudents()

        if (studentsError) {
          console.error('Error loading students:', studentsError)
          return
        }

        // Load exam results for each student
        const studentsWithResults = await Promise.all(
          (studentsData || []).map(async (student) => {
            const { data: results, error: resultsError } = await AuthService.getStudentExamResults(student.id)

            if (resultsError) {
              console.error('Error loading results for student:', student.id, resultsError)
            }

            const examResults = results || []
            const avgScore = examResults.length > 0
              ? Math.round(examResults.reduce((sum, exam) => sum + exam.score, 0) / examResults.length)
              : null

            return {
              id: student.id,
              name: student.name,
              email: student.email,
              examStatus: examResults.length > 0 ? 'Completed' : 'Not Started',
              lastLogin: new Date(student.created_at).toLocaleString(),
              score: avgScore,
              totalExams: examResults.length
            }
          })
        )

        setStudents(studentsWithResults)

        // Load statistics
        const { data: statistics, error: statsError } = await AuthService.getExamStatistics()

        if (statsError) {
          console.error('Error loading statistics:', statsError)
        } else {
          setStats(statistics || {})
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    loadData()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  const handleAddSampleQuestions = async () => {
    setAddingQuestions(true)
    setQuestionMessage('')

    try {
      const result = await addSampleQuestions()

      if (result.success) {
        if (result.count) {
          setQuestionMessage(`✅ Successfully added ${result.count} sample questions!`)
        } else {
          setQuestionMessage('✅ Sample questions already exist in database')
        }
      } else {
        setQuestionMessage(`❌ Error: ${(result.error as any)?.message || 'Failed to add questions'}`)
      }
    } catch (error) {
      setQuestionMessage('❌ Error adding sample questions')
      console.error('Error:', error)
    } finally {
      setAddingQuestions(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Not Started': 'status-not-started',
      'In Progress': 'status-in-progress',
      'Completed': 'status-completed'
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-default'
  }

  return (
    <div className="admin-dashboard">
      <div className="exam-logo-container">
        <img src={logo} alt="Logo" className="exam-logo" />
      </div>
        <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <span className="welcome-text">Welcome, Administrator</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <div className="stat-number">{stats.totalStudents || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Completed Exams</h3>
            <div className="stat-number">{stats.completedExams || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <div className="stat-number">{Math.round(stats.averageScore || 0)}%</div>
          </div>
          <div className="stat-card">
            <h3>Total Exams Taken</h3>
            <div className="stat-number">{stats.totalExamsTaken || 0}</div>
          </div>
        </div>

        <div className="admin-utilities">
          <h2>Admin Utilities</h2>
          <div className="utility-section">
            <h3>Database Setup</h3>
            <div className="utility-controls">
              <button
                className="utility-btn"
                onClick={handleAddSampleQuestions}
                disabled={addingQuestions}
              >
                {addingQuestions ? 'Adding Questions...' : 'Add Sample Questions'}
              </button>
              {questionMessage && (
                <div className="utility-message">
                  {questionMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="students-section">
          <h2>Student Management</h2>
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Exam Status</th>
                  <th>Registered</th>
                  <th>Avg Score</th>
                  <th>Exams Taken</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id.slice(-8)}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(student.examStatus)}`}>
                        {student.examStatus}
                      </span>
                    </td>
                    <td>{student.lastLogin}</td>
                    <td>{student.score !== null ? `${student.score}%` : '-'}</td>
                    <td>{student.totalExams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard