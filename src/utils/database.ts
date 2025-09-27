// Simple local database simulation using localStorage
// In production, this would be replaced with a real database

export interface Student {
  id: string
  name: string
  email: string
  password: string
  role: 'student' | 'admin'
  examHistory: ExamResult[]
  createdAt: string
}

export interface ExamResult {
  id: string
  studentId: string
  subtestId: number
  subtestName: string
  answers: StudentAnswer[]
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  completedAt: string
  duration: number // in seconds
}

export interface StudentAnswer {
  questionId: number
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
  timeSpent: number // in seconds
}

// Initialize database with default data
const initializeDatabase = () => {
  if (!localStorage.getItem('students_db')) {
    const defaultStudents: Student[] = [
      {
        id: 'admin-1',
        name: 'Administrator',
        email: 'admin@exam.com',
        password: 'admin123',
        role: 'admin',
        examHistory: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'student-1',
        name: 'Student User',
        email: 'student@exam.com',
        password: 'student123',
        role: 'student',
        examHistory: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'student-2',
        name: 'John Doe',
        email: 'student2@exam.com',
        password: 'student123',
        role: 'student',
        examHistory: [
          {
            id: 'exam-1',
            studentId: 'student-2',
            subtestId: 1,
            subtestName: 'Tes Potensi Skolastik - Penalaran Umum',
            answers: [
              { questionId: 1, selectedAnswer: 3, correctAnswer: 3, isCorrect: true, timeSpent: 45 },
              { questionId: 2, selectedAnswer: 1, correctAnswer: 2, isCorrect: false, timeSpent: 32 }
            ],
            score: 50,
            totalQuestions: 2,
            correctAnswers: 1,
            wrongAnswers: 1,
            completedAt: '2024-01-15T09:15:00.000Z',
            duration: 77
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'student-3',
        name: 'Jane Smith',
        email: 'student3@exam.com',
        password: 'student123',
        role: 'student',
        examHistory: [
          {
            id: 'exam-2',
            studentId: 'student-3',
            subtestId: 1,
            subtestName: 'Tes Potensi Skolastik - Penalaran Umum',
            answers: [
              { questionId: 1, selectedAnswer: 3, correctAnswer: 3, isCorrect: true, timeSpent: 30 },
              { questionId: 2, selectedAnswer: 2, correctAnswer: 2, isCorrect: true, timeSpent: 25 },
              { questionId: 3, selectedAnswer: 3, correctAnswer: 3, isCorrect: true, timeSpent: 40 },
              { questionId: 4, selectedAnswer: 1, correctAnswer: 1, isCorrect: true, timeSpent: 35 }
            ],
            score: 100,
            totalQuestions: 4,
            correctAnswers: 4,
            wrongAnswers: 0,
            completedAt: '2024-01-14T14:20:00.000Z',
            duration: 130
          }
        ],
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem('students_db', JSON.stringify(defaultStudents))
  }
}

// Database operations
export const dbOperations = {
  // Initialize the database
  init: () => {
    initializeDatabase()
  },

  // Get all students
  getAllStudents: (): Student[] => {
    const students = localStorage.getItem('students_db')
    return students ? JSON.parse(students) : []
  },

  // Get student by email
  getStudentByEmail: (email: string): Student | null => {
    const students = dbOperations.getAllStudents()
    return students.find(s => s.email === email) || null
  },

  // Validate student credentials
  validateStudent: (email: string, password: string): Student | null => {
    const student = dbOperations.getStudentByEmail(email)
    if (student && student.password === password) {
      return student
    }
    return null
  },

  // Add new student
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>): Student => {
    const students = dbOperations.getAllStudents()
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    students.push(newStudent)
    localStorage.setItem('students_db', JSON.stringify(students))
    return newStudent
  },

  // Save exam result
  saveExamResult: (studentId: string, examResult: Omit<ExamResult, 'id' | 'studentId'>): void => {
    const students = dbOperations.getAllStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)

    if (studentIndex !== -1) {
      const newResult: ExamResult = {
        ...examResult,
        id: `exam-${Date.now()}`,
        studentId
      }
      students[studentIndex].examHistory.push(newResult)
      localStorage.setItem('students_db', JSON.stringify(students))
    }
  },

  // Get student exam history
  getStudentExamHistory: (studentId: string): ExamResult[] => {
    const student = dbOperations.getAllStudents().find(s => s.id === studentId)
    return student ? student.examHistory : []
  },

  // Update student last login
  updateLastLogin: (studentId: string): void => {
    const students = dbOperations.getAllStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)

    if (studentIndex !== -1) {
      // You can add a lastLogin field to Student interface if needed
      localStorage.setItem('students_db', JSON.stringify(students))
    }
  },

  // Get exam statistics
  getExamStatistics: () => {
    const students = dbOperations.getAllStudents().filter(s => s.role === 'student')
    const totalStudents = students.length
    const studentsWithExams = students.filter(s => s.examHistory.length > 0)
    const completedExams = studentsWithExams.length
    const totalExamsTaken = students.reduce((sum, s) => sum + s.examHistory.length, 0)

    return {
      totalStudents,
      completedExams,
      inProgress: 0, // This would need to be tracked separately
      notStarted: totalStudents - completedExams,
      totalExamsTaken,
      averageScore: studentsWithExams.length > 0
        ? studentsWithExams.reduce((sum, s) => {
            const avgScore = s.examHistory.reduce((avg, exam) => avg + exam.score, 0) / s.examHistory.length
            return sum + avgScore
          }, 0) / studentsWithExams.length
        : 0
    }
  }
}

// Initialize database on import
dbOperations.init()