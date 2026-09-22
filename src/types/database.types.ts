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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analysis: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          member_id: string | null
          original_image_url: string
          result: Json
          result_image_url: string
          share_expires_at: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          member_id?: string | null
          original_image_url: string
          result: Json
          result_image_url: string
          share_expires_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          member_id?: string | null
          original_image_url?: string
          result?: Json
          result_image_url?: string
          share_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
      customer: {
        Row: {
          birth_date: string
          created_at: string
          email: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          email: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          name: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          email?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          name?: string
        }
        Relationships: []
      }
      designer: {
        Row: {
          created_at: string
          id: number
          member_id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: number
          member_id: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: number
          member_id?: string
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "designer_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
      member: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      member_customer_mapping: {
        Row: {
          created_at: string
          customer_id: string
          designer_id: number | null
          id: number
          member_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          designer_id?: number | null
          id?: number
          member_id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          designer_id?: number | null
          id?: number
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_customer_mapping_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_customer_mapping_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_customer_mapping_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
      shop: {
        Row: {
          address: string | null
          address_detail: string | null
          created_at: string
          id: number
          logo_url: string | null
          member_id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          address_detail?: string | null
          created_at?: string
          id?: number
          logo_url?: string | null
          member_id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          address_detail?: string | null
          created_at?: string
          id?: number
          logo_url?: string | null
          member_id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_analysis_count_by_period: {
        Args: {
          p_granularity: string
          p_member_id: string
          p_pivot_date: string
        }
        Returns: {
          bucket_start: string
          cumulative_count: number
          new_count: number
        }[]
      }
      get_customer_confirmed_at: {
        Args: { p_customer_id: string }
        Returns: string
      }
      get_customer_count_by_age_group: {
        Args: { p_member_id: string }
        Returns: {
          age_group: string
          count: number
          gender: string
        }[]
      }
      get_customer_count_by_gender: {
        Args: { p_member_id: string }
        Returns: {
          count: number
          gender: string
        }[]
      }
      get_customer_count_by_period: {
        Args: {
          p_granularity: string
          p_member_id: string
          p_pivot_date: string
        }
        Returns: {
          bucket_start: string
          cumulative_count: number
          new_count: number
        }[]
      }
      get_shared_analysis: {
        Args: { p_analysis_id: string }
        Returns: {
          result: Json
          result_image_url: string
        }[]
      }
    }
    Enums: {
      gender: "M" | "F"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      gender: ["M", "F"],
    },
  },
} as const
