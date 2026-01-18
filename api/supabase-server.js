import { createClient } from '@supabase/supabase-js'

// For API routes, we need to use process.env instead of import.meta.env
// This works in both Vercel serverless and local Node.js environment

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'set' : 'MISSING')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'MISSING')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
