import { createClient, Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create Supabase client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== '' && supabaseAnonKey !== '' &&
  supabaseUrl !== 'your_supabase_url_here' && supabaseAnonKey !== 'your_supabase_anon_key_here'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: { user_name?: string }) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase not configured' } }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getCurrentSession: async () => {
    if (!supabase) {
      return { session: null, error: { message: 'Supabase not configured' } }
    }
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Get user profile
  getProfile: async (userId: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Record<string, unknown>) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
    return { data, error }
  },

  // Create user profile
  createProfile: async (userId: string, profileData: Record<string, unknown>) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profileData }])
      .select()
    return { data, error }
  }
}