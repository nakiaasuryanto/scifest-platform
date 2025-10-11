// Database Types for Exam Platform
export interface Student {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'student'
  created_at: string
  updated_at: string
}

export interface ExamResult {
  id: string
  student_id: string
  subtest_id: number
  subtest_name: string
  score: number
  total_questions: number
  correct_answers: number
  wrong_answers: number
  completed_at: string
  duration: number
  answers: StudentAnswer[]
}

export interface StudentAnswer {
  question_id: number
  selected_answer: number
  correct_answer: number
  is_correct: boolean
  time_spent: number
}

export interface Question {
  id: number
  subtest_id: number
  question_text: string
  options: string[]
  correct_answer: number // Keep for backward compatibility
  correct_answer_text: string // New: actual correct answer text
  image_url?: string // Optional: URL for question image
  created_at: string
}

export interface ExamState {
  currentSubtest: number
  currentQuestion: number
  answers: { [key: string]: number }
  timeRemaining: number
  isCompleted: boolean
}