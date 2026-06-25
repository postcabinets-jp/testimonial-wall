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
      profiles: {
        Row: {
          id: string
          display_name: string | null
          company_name: string | null
          website_url: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          company_name?: string | null
          website_url?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          company_name?: string | null
          website_url?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          project_id: string
          author_name: string
          author_title: string | null
          author_company: string | null
          author_avatar_url: string | null
          content: string
          rating: number | null
          video_url: string | null
          source_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          is_featured: boolean
          tags: string[]
          submitted_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          author_name: string
          author_title?: string | null
          author_company?: string | null
          author_avatar_url?: string | null
          content: string
          rating?: number | null
          video_url?: string | null
          source_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          tags?: string[]
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          author_name?: string
          author_title?: string | null
          author_company?: string | null
          author_avatar_url?: string | null
          content?: string
          rating?: number | null
          video_url?: string | null
          source_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          tags?: string[]
          submitted_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type TestimonialStatus = Testimonial['status']

export type ProjectSettings = {
  theme?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  layout?: 'masonry' | 'carousel' | 'list'
  showRating?: boolean
  showAvatar?: boolean
  maxItems?: number
}
