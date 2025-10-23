import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zfrqgpyspgmuzpxijmhh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYnpvcmRubWdmb3loeXRiZ2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTE5MDYsImV4cCI6MjA3Mzk4NzkwNn0.3FElNS91vf7OD8v7O7sf5elM06HhyUUgCe1XUU93bag'

// Create Supabase client with proper error handling
let supabase: SupabaseClient | null = null;

// Initialize Supabase client safely
const initializeSupabase = () => {
  if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey && 
      supabaseUrl.startsWith('https://') && 
      !supabaseUrl.includes('placeholder') && 
      !supabaseAnonKey.includes('placeholder')) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      return true;
    } catch (error) {
      console.warn('Failed to create Supabase client:', error);
      supabase = null;
      return false;
    }
  }
  supabase = null;
  return false;
};

// Initialize on module load
initializeSupabase();

export { supabase };

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
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
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
  updateProfile: async (userId: string, updates: any) => {
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
  createProfile: async (userId: string, profileData: any) => {
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
