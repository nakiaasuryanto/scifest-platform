export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export interface Subtest {
  id: number
  name: string
  duration: number // in minutes
  questions: Question[]
}

export interface ExamState {
  currentSubtest: number
  currentQuestion: number
  answers: { [key: string]: number }
  doubtfulQuestions: Set<number>
  timeRemaining: number
  isCompleted: boolean
}

export interface ExamData {
  subtests: Subtest[]
}