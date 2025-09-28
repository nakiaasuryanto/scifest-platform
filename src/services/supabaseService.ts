import { supabase } from '../lib/supabase'
import type { Student, ExamResult, Question } from '../types/database'

export class SupabaseService {
  // Authentication
  static async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'student'
          }
        }
      })

      if (error) throw error

      // Create user profile in students table
      if (data.user) {
        await this.createStudentProfile(data.user.id, name, email, 'student')
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Student Management
  static async createStudentProfile(id: string, name: string, email: string, role: 'admin' | 'student') {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            id,
            name,
            email,
            role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

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

  // Exam Results
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
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getAllExamResults(): Promise<{ data: ExamResult[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          *,
          students (
            name,
            email
          )
        `)
        .order('completed_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Questions Management
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

  static async createQuestion(question: Omit<Question, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([
          {
            ...question,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updateQuestion(id: number, updates: Partial<Question>) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async deleteQuestion(id: number) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Statistics
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
      const uniqueStudentsWithExams = new Set(results?.map((r: any) => r.student_id)).size
      const averageScore = results?.length > 0
        ? results.reduce((sum: number, r: any) => sum + r.score, 0) / results.length
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
}