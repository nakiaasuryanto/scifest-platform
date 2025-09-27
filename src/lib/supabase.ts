import { createClient } from '@supabase/supabase-js'
import type { Student, ExamResult, Question, StudentAnswer } from '../types/database'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Re-export types for convenience
export type { Student, ExamResult, Question, StudentAnswer }