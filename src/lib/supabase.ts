import { createClient } from '@supabase/supabase-js'
import type { Student, ExamResult, Question, StudentAnswer } from '../types/database'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.startsWith('https://') && url.includes('.supabase.co')
  } catch {
    return false
  }
}

// Check if credentials are properly configured
const hasValidCredentials = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && supabaseAnonKey.length > 10

let finalUrl: string
let finalKey: string

if (!hasValidCredentials) {
  console.warn('⚠️ Invalid or missing Supabase environment variables.')
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? 'Present but invalid format' : 'Missing')
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  console.warn('Please configure valid credentials in Vercel environment variables.')

  // Use safe fallback values that won't cause errors
  finalUrl = 'https://placeholder.supabase.co'
  finalKey = 'placeholder-key-for-demo-purposes-only'
} else {
  finalUrl = supabaseUrl
  finalKey = supabaseAnonKey
}

export const supabase = createClient(finalUrl, finalKey)

// Re-export types for convenience
export type { Student, ExamResult, Question, StudentAnswer }