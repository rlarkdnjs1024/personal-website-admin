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
      tb_photos: {
        Row: {
          city_name: string
          country_code: string
          country_name: string
          created_at: string
          file_size_bytes: number
          height: number | null
          latitude: number
          longitude: number
          mime_type: string
          seq: number
          status: string
          storage_path: string
          taken_at: string | null
          uploaded_by: number
          width: number | null
        }
        Insert: {
          city_name: string
          country_code: string
          country_name: string
          created_at?: string
          file_size_bytes: number
          height?: number | null
          latitude: number
          longitude: number
          mime_type: string
          seq?: number
          status?: string
          storage_path: string
          taken_at?: string | null
          uploaded_by: number
          width?: number | null
        }
        Update: {
          city_name?: string
          country_code?: string
          country_name?: string
          created_at?: string
          file_size_bytes?: number
          height?: number | null
          latitude?: number
          longitude?: number
          mime_type?: string
          seq?: number
          status?: string
          storage_path?: string
          taken_at?: string | null
          uploaded_by?: number
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tb_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "tb_user"
            referencedColumns: ["seq"]
          },
        ]
      }
      tb_role: {
        Row: {
          role_name: string
          seq: number
        }
        Insert: {
          role_name: string
          seq?: number
        }
        Update: {
          role_name?: string
          seq?: number
        }
        Relationships: []
      }
      tb_session: {
        Row: {
          created_at: string
          expires_at: string
          session_id_hashed: string
          user_seq: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          session_id_hashed: string
          user_seq: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          session_id_hashed?: string
          user_seq?: number
        }
        Relationships: [
          {
            foreignKeyName: "tb_session_user_seq_fkey"
            columns: ["user_seq"]
            isOneToOne: false
            referencedRelation: "tb_user"
            referencedColumns: ["seq"]
          },
        ]
      }
      tb_user: {
        Row: {
          admin_memo: string | null
          created_at: string
          deleted_yn: boolean
          email: string
          name: string
          password: string
          role_seq: number
          seq: number
        }
        Insert: {
          admin_memo?: string | null
          created_at?: string
          deleted_yn?: boolean
          email: string
          name: string
          password: string
          role_seq: number
          seq?: number
        }
        Update: {
          admin_memo?: string | null
          created_at?: string
          deleted_yn?: boolean
          email?: string
          name?: string
          password?: string
          role_seq?: number
          seq?: number
        }
        Relationships: [
          {
            foreignKeyName: "tb_user_role_seq_fkey"
            columns: ["role_seq"]
            isOneToOne: false
            referencedRelation: "tb_role"
            referencedColumns: ["seq"]
          },
        ]
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
    Enums: {},
  },
} as const
