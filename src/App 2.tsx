import { Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import ExamRules from './components/Exam/ExamRules'
import ExamLayout from './components/Exam/ExamLayout'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exam-rules" element={<ExamRules />} />
        <Route path="/exam/:subtestId" element={<ExamLayout />} />
      </Routes>
    </div>
  )
}

export default App