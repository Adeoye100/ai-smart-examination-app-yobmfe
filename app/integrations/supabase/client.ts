import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://gwqyiuayzhtpiwnpyvpl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cXlpdWF5emh0cGl3bnB5dnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTYxMTYsImV4cCI6MjA3Njg5MjExNn0.9RDvbfdtQOy46oLFFCoIVOiZxYaYmdkrkEk0RMLI4h4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
