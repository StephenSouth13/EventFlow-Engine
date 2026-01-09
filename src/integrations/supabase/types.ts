export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cms_cta: {
        Row: {
          created_at: string | null
          final_cta_button_link: string | null
          final_cta_button_text: string | null
          final_cta_subtitle: string | null
          final_cta_title: string | null
          id: string
          is_published: boolean | null
          section_subtitle: string | null
          section_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          final_cta_button_link?: string | null
          final_cta_button_text?: string | null
          final_cta_subtitle?: string | null
          final_cta_title?: string | null
          id?: string
          is_published?: boolean | null
          section_subtitle?: string | null
          section_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          final_cta_button_link?: string | null
          final_cta_button_text?: string | null
          final_cta_subtitle?: string | null
          final_cta_title?: string | null
          id?: string
          is_published?: boolean | null
          section_subtitle?: string | null
          section_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_cta_cards: {
        Row: {
          button_link: string
          button_text: string
          created_at: string | null
          description: string
          icon_name: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_link: string
          button_text: string
          created_at?: string | null
          description: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_link?: string
          button_text?: string
          created_at?: string | null
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_feature_items: {
        Row: {
          created_at: string | null
          description: string
          icon_name: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_features: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean | null
          section_subtitle: string | null
          section_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          section_subtitle?: string | null
          section_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          section_subtitle?: string | null
          section_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_footer: {
        Row: {
          brand_description: string | null
          copyright_text: string | null
          created_at: string | null
          event_info: string | null
          id: string
          instagram_url: string | null
          is_published: boolean | null
          linkedin_url: string | null
          twitter_url: string | null
          updated_at: string | null
          youtube_url: string | null
        }
        Insert: {
          brand_description?: string | null
          copyright_text?: string | null
          created_at?: string | null
          event_info?: string | null
          id?: string
          instagram_url?: string | null
          is_published?: boolean | null
          linkedin_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Update: {
          brand_description?: string | null
          copyright_text?: string | null
          created_at?: string | null
          event_info?: string | null
          id?: string
          instagram_url?: string | null
          is_published?: boolean | null
          linkedin_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      cms_hero: {
        Row: {
          attendees_text: string | null
          background_image_url: string | null
          badge_text: string | null
          created_at: string | null
          cta_primary_link: string | null
          cta_primary_text: string | null
          cta_secondary_link: string | null
          cta_secondary_text: string | null
          draft_attendees_text: string | null
          draft_background_image_url: string | null
          draft_badge_text: string | null
          draft_cta_primary_link: string | null
          draft_cta_primary_text: string | null
          draft_cta_secondary_link: string | null
          draft_cta_secondary_text: string | null
          draft_event_date: string | null
          draft_event_location: string | null
          draft_subtitle: string | null
          draft_title_line1: string | null
          draft_title_line2: string | null
          event_date: string | null
          event_location: string | null
          has_draft: boolean | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          published_at: string | null
          subtitle: string | null
          title_line1: string | null
          title_line2: string | null
          updated_at: string | null
        }
        Insert: {
          attendees_text?: string | null
          background_image_url?: string | null
          badge_text?: string | null
          created_at?: string | null
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          draft_attendees_text?: string | null
          draft_background_image_url?: string | null
          draft_badge_text?: string | null
          draft_cta_primary_link?: string | null
          draft_cta_primary_text?: string | null
          draft_cta_secondary_link?: string | null
          draft_cta_secondary_text?: string | null
          draft_event_date?: string | null
          draft_event_location?: string | null
          draft_subtitle?: string | null
          draft_title_line1?: string | null
          draft_title_line2?: string | null
          event_date?: string | null
          event_location?: string | null
          has_draft?: boolean | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          subtitle?: string | null
          title_line1?: string | null
          title_line2?: string | null
          updated_at?: string | null
        }
        Update: {
          attendees_text?: string | null
          background_image_url?: string | null
          badge_text?: string | null
          created_at?: string | null
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          draft_attendees_text?: string | null
          draft_background_image_url?: string | null
          draft_badge_text?: string | null
          draft_cta_primary_link?: string | null
          draft_cta_primary_text?: string | null
          draft_cta_secondary_link?: string | null
          draft_cta_secondary_text?: string | null
          draft_event_date?: string | null
          draft_event_location?: string | null
          draft_subtitle?: string | null
          draft_title_line1?: string | null
          draft_title_line2?: string | null
          event_date?: string | null
          event_location?: string | null
          has_draft?: boolean | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          subtitle?: string | null
          title_line1?: string | null
          title_line2?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_navigation: {
        Row: {
          created_at: string | null
          href: string
          id: string
          is_visible: boolean | null
          label: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href: string
          id?: string
          is_visible?: boolean | null
          label: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string
          id?: string
          is_visible?: boolean | null
          label?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_publish_history: {
        Row: {
          action: string
          changes: Json | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          published_by: string
        }
        Insert: {
          action: string
          changes?: Json | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          published_by: string
        }
        Update: {
          action?: string
          changes?: Json | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          published_by?: string
        }
        Relationships: []
      }
      cms_sections: {
        Row: {
          created_at: string | null
          id: string
          is_visible: boolean | null
          section_key: string
          section_name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          section_key: string
          section_name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          section_key?: string
          section_name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_settings: {
        Row: {
          created_at: string | null
          event_end_date: string | null
          event_start_date: string | null
          favicon_url: string | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          site_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_end_date?: string | null
          event_start_date?: string | null
          favicon_url?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          site_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_end_date?: string | null
          event_start_date?: string | null
          favicon_url?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          site_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_stats: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string
          sort_order: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          sort_order?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          sort_order?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          max_attendees: number | null
          name: string
          start_date: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_attendees?: number | null
          name: string
          start_date: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_attendees?: number | null
          name?: string
          start_date?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      investors: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string | null
          id: string
          investment_focus: string[] | null
          investment_stages: string[] | null
          is_verified: boolean | null
          linkedin_url: string | null
          name: string
          photo_url: string | null
          portfolio_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          investment_focus?: string[] | null
          investment_stages?: string[] | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          portfolio_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          investment_focus?: string[] | null
          investment_stages?: string[] | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          portfolio_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          message: string | null
          requester_id: string
          scheduled_time: string | null
          startup_id: string | null
          status: string
          target_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          message?: string | null
          requester_id: string
          scheduled_time?: string | null
          startup_id?: string | null
          status?: string
          target_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          message?: string | null
          requester_id?: string
          scheduled_time?: string | null
          startup_id?: string | null
          status?: string
          target_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_startups: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          startup_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          startup_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          startup_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_startups_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      session_speakers: {
        Row: {
          id: string
          session_id: string | null
          speaker_id: string | null
        }
        Insert: {
          id?: string
          session_id?: string | null
          speaker_id?: string | null
        }
        Update: {
          id?: string
          session_id?: string | null
          speaker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_speakers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_speakers_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          event_id: string | null
          id: string
          location: string | null
          max_capacity: number | null
          session_type: string
          start_time: string
          title: string
          track: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          event_id?: string | null
          id?: string
          location?: string | null
          max_capacity?: number | null
          session_type?: string
          start_time: string
          title: string
          track?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_id?: string | null
          id?: string
          location?: string | null
          max_capacity?: number | null
          session_type?: string
          start_time?: string
          title?: string
          track?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      speakers: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          is_approved: boolean | null
          linkedin_url: string | null
          name: string
          photo_url: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          booth_number: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          tier: string
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          booth_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          tier?: string
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          booth_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          tier?: string
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      startups: {
        Row: {
          created_at: string | null
          description: string | null
          founding_year: number | null
          funding_status: string | null
          id: string
          industry: string | null
          is_approved: boolean | null
          logo_url: string | null
          name: string
          pitch_deck_url: string | null
          pitching_slot: string | null
          stage: string | null
          tagline: string | null
          team_size: string | null
          track: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          funding_status?: string | null
          id?: string
          industry?: string | null
          is_approved?: boolean | null
          logo_url?: string | null
          name: string
          pitch_deck_url?: string | null
          pitching_slot?: string | null
          stage?: string | null
          tagline?: string | null
          team_size?: string | null
          track?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          founding_year?: number | null
          funding_status?: string | null
          id?: string
          industry?: string | null
          is_approved?: boolean | null
          logo_url?: string | null
          name?: string
          pitch_deck_url?: string | null
          pitching_slot?: string | null
          stage?: string | null
          tagline?: string | null
          team_size?: string | null
          track?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          checked_in_at: string | null
          created_at: string | null
          event_id: string | null
          id: string
          is_checked_in: boolean | null
          qr_code: string | null
          ticket_type: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_checked_in?: boolean | null
          qr_code?: string | null
          ticket_type?: string
          user_id: string
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_checked_in?: boolean | null
          qr_code?: string | null
          ticket_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "attendee"
        | "startup"
        | "investor"
        | "speaker"
        | "sponsor"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "attendee",
        "startup",
        "investor",
        "speaker",
        "sponsor",
        "admin",
      ],
    },
  },
} as const
