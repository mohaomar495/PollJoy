export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          user_id: string
          is_public: boolean
          allow_multiple_votes: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          user_id: string
          is_public?: boolean
          allow_multiple_votes?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          allow_multiple_votes?: boolean
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          voter_fingerprint: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          voter_fingerprint: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          voter_fingerprint?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          created_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}