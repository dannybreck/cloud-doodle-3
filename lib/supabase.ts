import { createClient } from '@supabase/supabase-js';

// Fallback values for development
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Only create real client if we have valid credentials
const isConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder_key' &&
  supabaseUrl.includes('supabase.co');

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      // Mock Supabase client for development
      from: (table: string) => ({
        select: (columns: string = '*') => ({
          order: (column: string, options: any = {}) => ({
            eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
            then: (callback: any) => callback({ data: [], error: null })
          }),
          eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => callback({ data: [], error: null })
        }),
        insert: (data: any) => Promise.resolve({ data: null, error: null }),
        update: (data: any) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
        }),
        delete: () => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
        }),
        upsert: (data: any) => Promise.resolve({ data: null, error: null })
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => ({ 
          data: { subscription: { unsubscribe: () => {} } } 
        })
      },
      storage: {
        from: (bucket: string) => ({
          upload: (path: string, file: any) => Promise.resolve({ data: null, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: '' } })
        })
      }
    };

export type Doodle = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  drawing_data: {
    paths: any[];
    assets: any[];
  };
  created_at: string;
  likes: number;
  is_liked: boolean;
  tags: string[];
  user_id?: string;
};

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = isConfigured;

// Console log for debugging
if (!isConfigured) {
  console.log('🔧 Supabase not configured - using mock client for development');
  console.log('Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable Supabase');
} else {
  console.log('✅ Supabase configured and connected');
}