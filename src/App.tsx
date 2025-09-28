import { Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import ExamRules from './components/Exam/ExamRules'
import AdminDashboard from './components/Admin/AdminDashboard'
import ExamLayout from './components/Exam/ExamLayout'
import ExamWaiting from './components/Exam/ExamWaiting'
import ExamCompleted from './components/Exam/ExamCompleted'
import UserDashboard from './components/User/UserDashboard'
import SetupRequired from './components/SetupRequired'
import './App.css'

function App() {
  // Check if environment variables are configured properly
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return url.startsWith('https://') && url.includes('.supabase.co')
    } catch {
      return false
    }
  }

  const isConfigured = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && supabaseAnonKey.length > 10

  if (!isConfigured) {
    return <SetupRequired />
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exam-rules" element={<ExamRules />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/exam-waiting/:subtestId" element={<ExamWaiting />} />
        <Route path="/exam/:subtestId" element={<ExamLayout />} />
        <Route path="/exam-completed" element={<ExamCompleted />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </div>
  )
}

export default App