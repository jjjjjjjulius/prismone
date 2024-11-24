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
      beliefs: {
        Row: {
          id: string
          user_id: string
          text: string
          category: string
          created_at: string
          transformed_belief: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          category: string
          created_at?: string
          transformed_belief: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          category?: string
          created_at?: string
          transformed_belief?: string
        }
      }
      evidence: {
        Row: {
          id: string
          belief_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          belief_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          belief_id?: string
          text?: string
          created_at?: string
        }
      }
    }
  }
}