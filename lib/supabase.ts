import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Poop {
  id: string
  user_id: string // Clerk user ID directly
  dog_name: string
  location?: string
  notes?: string
  photo_url?: string
  created_at: string
  updated_at: string
}
