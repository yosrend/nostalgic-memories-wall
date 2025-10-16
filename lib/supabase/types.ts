export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          name: string | null
          content: string
          image_url: string | null
          is_anonymous: boolean
          status: 'pending' | 'approved' | 'rejected'
          is_visible: boolean
          likes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          content: string
          image_url?: string | null
          is_anonymous?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          is_visible?: boolean
          likes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          content?: string
          image_url?: string | null
          is_anonymous?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          is_visible?: boolean
          likes_count?: number
          created_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          post_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          emoji?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          name: string
          instagram: string | null
          facebook: string | null
          threads: string | null
          x: string | null
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          instagram?: string | null
          facebook?: string | null
          threads?: string | null
          x?: string | null
          whatsapp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          instagram?: string | null
          facebook?: string | null
          threads?: string | null
          x?: string | null
          whatsapp?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type Reaction = Database['public']['Tables']['reactions']['Row']
export type ReactionInsert = Database['public']['Tables']['reactions']['Insert']
export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type SocialLinkInsert = Database['public']['Tables']['social_links']['Insert']
