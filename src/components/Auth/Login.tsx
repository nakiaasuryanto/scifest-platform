import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/authService'
import logo from '../../assets/Logo.png'
import './Login.css'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
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
      if (isLogin) {
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
          navigate('/exam-rules')
        }
      } else {
        // Handle signup with table-based auth
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!')
          return
        }

        const { user, error } = await AuthService.register(formData.email, formData.password, formData.name)

        if (error || !user) {
          console.error('Signup error:', error)
          alert(error || 'Error creating account!')
          return
        }

        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userName', user.name)
        localStorage.setItem('userRole', user.role)
        localStorage.setItem('userId', user.id)
        navigate('/exam-rules')
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
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

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

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
    </>
  )
}

export default Login