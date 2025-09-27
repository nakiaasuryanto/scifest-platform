import { supabase } from '../lib/supabase'
import type { Student, ExamResult, Question } from '../types/database'

export class AuthService {
  // Simple table-based authentication
  static async login(email: string, password: string) {
    try {
      console.log('🔍 Attempting login with:', { email, password })

      // Try a simple select first to see what columns exist
      const { data: allUsers, error: listError } = await supabase
        .from('students')
        .select('*')
        .limit(1)

      console.log('📋 Available columns/sample:', allUsers)
      console.log('📋 List error:', listError)

      // First, check if user exists by email only (using specific columns)
      const { data: userCheck, error: userError } = await supabase
        .from('students')
        .select('id, email, name, role, password, created_at, updated_at')
        .eq('email', email)
        .single()

      console.log('👤 User found:', userCheck)
      console.log('❌ User error:', userError)

      if (userError) {
        console.log('❌ Database error details:', userError)
        return { user: null, error: 'Database error: ' + userError.message }
      }

      if (!userCheck) {
        console.log('❌ No user found with email:', email)
        return { user: null, error: 'Invalid email or password' }
      }

      // Check if password column exists
      if (!userCheck.password) {
        console.log('❌ Password column is missing or null')
        return { user: null, error: 'Password not set for user' }
      }

      // Check password
      if (userCheck.password !== password) {
        console.log('❌ Password mismatch. Expected:', userCheck.password, 'Got:', password)
        return { user: null, error: 'Invalid email or password' }
      }

      console.log('✅ Login successful for:', email)
      return { user: userCheck, error: null }
    } catch (error) {
      console.log('💥 Login exception:', error)
      return { user: null, error: 'Login failed: ' + error }
    }
  }

  static async register(email: string, password: string, name: string) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('students')
        .select('email')
        .eq('email', email)
        .single()

      if (existingUser) {
        return { user: null, error: 'Email already exists' }
      }

      // Create new user
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            email,
            password,
            name,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        return { user: null, error: 'Registration failed' }
      }

      return { user: data, error: null }
    } catch (error) {
      return { user: null, error: 'Registration failed' }
    }
  }

  // Keep the same methods for exam results and questions
  static async getAllStudents(): Promise<{ data: Student[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getStudentById(id: string): Promise<{ data: Student | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async saveExamResult(examResult: Omit<ExamResult, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .insert([
          {
            ...examResult,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getStudentExamResults(studentId: string): Promise<{ data: ExamResult[] | null, error: any }> {
    try {
      console.log('📊 Fetching exam results for student ID:', studentId)

      // First check if exam_results table exists and is accessible
      const { data: testData, error: testError } = await supabase
        .from('exam_results')
        .select('*')
        .limit(1)

      console.log('🧪 Test query result:', { testData, testError })

      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })

      console.log('📊 Query result:', { data, error, studentId })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('💥 Error in getStudentExamResults:', error)
      return { data: null, error }
    }
  }

  static async getQuestionsBySubtest(subtestId: number): Promise<{ data: Question[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subtest_id', subtestId)
        .order('id', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getExamStatistics() {
    try {
      // Get total students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('role', 'student')

      if (studentsError) throw studentsError

      // Get exam results
      const { data: results, error: resultsError } = await supabase
        .from('exam_results')
        .select('score, student_id')

      if (resultsError) throw resultsError

      const totalStudents = students?.length || 0
      const completedExams = results?.length || 0
      const uniqueStudentsWithExams = new Set(results?.map(r => r.student_id)).size
      const averageScore = results?.length > 0
        ? results.reduce((sum, r) => sum + r.score, 0) / results.length
        : 0

      return {
        data: {
          totalStudents,
          completedExams: uniqueStudentsWithExams,
          totalExamsTaken: completedExams,
          averageScore: Math.round(averageScore * 100) / 100,
          notStarted: totalStudents - uniqueStudentsWithExams
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all students who have completed at least one exam
  static async getAllCompletedStudents() {
    try {
      const { data: results, error } = await supabase
        .from('exam_results')
        .select('student_id')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Get unique student IDs in the order they first completed an exam
      const uniqueStudentIds = []
      const seenStudents = new Set()

      results?.forEach(result => {
        if (!seenStudents.has(result.student_id)) {
          seenStudents.add(result.student_id)
          uniqueStudentIds.push({ id: result.student_id })
        }
      })

      return {
        data: uniqueStudentIds,
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }
}