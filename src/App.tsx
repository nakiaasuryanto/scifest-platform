import { Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import ExamRules from './components/Exam/ExamRules'
import AdminDashboard from './components/Admin/AdminDashboard'
import ExamLayout from './components/Exam/ExamLayout'
import ExamWaiting from './components/Exam/ExamWaiting'
import ExamCompleted from './components/Exam/ExamCompleted'
import UserDashboard from './components/User/UserDashboard'
import './App.css'

function App() {
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