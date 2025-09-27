import { createClient } from '@supabase/supabase-js'
import type { Student, ExamResult, Question, StudentAnswer } from '../types/database'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Provide fallback values for development/demo purposes
const defaultUrl = supabaseUrl || 'https://demo.supabase.co'
const defaultKey = supabaseAnonKey || 'demo-key'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Using demo configuration.')
  console.warn('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.')
}

export const supabase = createClient(defaultUrl, defaultKey)

// Re-export types for convenience
export type { Student, ExamResult, Question, StudentAnswer }