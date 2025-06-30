import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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