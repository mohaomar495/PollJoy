import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

// These environment variables need to be set in .env.local
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Create a single supabase client for interacting with your database
export const supabase = supabaseCreateClient(supabaseUrl, supabaseAnonKey);

// Export createClient function for services to use
export const createClient = () =>
  supabaseCreateClient(supabaseUrl, supabaseAnonKey);
