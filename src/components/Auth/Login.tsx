import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import { SupabaseService } from '../../services/supabaseService'
import logo from '../../assets/Logo.png'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Handle login with table-based auth
      const { user, error } = await AuthService.login(formData.email, formData.password)

      if (error || !user) {
        console.error('Login error:', error)
        alert(error || 'Invalid email or password!')
        return
      }

      // Store user info in localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userName', user.name)
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userId', user.id)

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard')
      } else {
        // Check if student has already completed exam
        const { data: examResults } = await SupabaseService.getStudentExamResults(user.id)

        if (examResults && examResults.length > 0) {
          // Student has completed exam, redirect to dashboard
          navigate('/user-dashboard')
        } else {
          // Student hasn't done exam yet, show exam rules
          navigate('/exam-rules')
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <>
      <div className="top-logo-container">
        <img src={logo} alt="Logo" className="top-logo" />
      </div>
      <div className="login-container">
        <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login