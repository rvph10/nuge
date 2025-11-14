export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          icon_url: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          slug: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          slug: string;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          slug?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          address: string | null;
          category_id: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          created_by: string | null;
          deleted_at: string | null;
          description: string | null;
          end_time: string;
          facebook_url: string | null;
          id: string;
          instagram_handle: string | null;
          is_active_now: boolean | null;
          is_recurring: boolean | null;
          location: unknown;
          name: string;
          organizer_id: string;
          recurrence_rule: string | null;
          start_time: string;
          status: Database["public"]["Enums"]["listing_status"] | null;
          timezone: string | null;
          updated_at: string | null;
          updated_by: string | null;
          venue_name: string | null;
          website_url: string | null;
        };
        Insert: {
          address?: string | null;
          category_id?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          end_time: string;
          facebook_url?: string | null;
          id?: string;
          instagram_handle?: string | null;
          is_active_now?: boolean | null;
          is_recurring?: boolean | null;
          location?: unknown;
          name: string;
          organizer_id: string;
          recurrence_rule?: string | null;
          start_time: string;
          status?: Database["public"]["Enums"]["listing_status"] | null;
          timezone?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          venue_name?: string | null;
          website_url?: string | null;
        };
        Update: {
          address?: string | null;
          category_id?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          end_time?: string;
          facebook_url?: string | null;
          id?: string;
          instagram_handle?: string | null;
          is_active_now?: boolean | null;
          is_recurring?: boolean | null;
          location?: unknown;
          name?: string;
          organizer_id?: string;
          recurrence_rule?: string | null;
          start_time?: string;
          status?: Database["public"]["Enums"]["listing_status"] | null;
          timezone?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          venue_name?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_organizer_id_fkey";
            columns: ["organizer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_items: {
        Row: {
          allergens: string[] | null;
          category: string | null;
          created_at: string | null;
          currency: string | null;
          deleted_at: string | null;
          description: string | null;
          display_order: number | null;
          id: string;
          image_url: string;
          is_available: boolean | null;
          is_gluten_free: boolean | null;
          is_vegan: boolean | null;
          is_vegetarian: boolean | null;
          name: string;
          price: number | null;
          updated_at: string | null;
          vendor_id: string;
        };
        Insert: {
          allergens?: string[] | null;
          category?: string | null;
          created_at?: string | null;
          currency?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          id?: string;
          image_url: string;
          is_available?: boolean | null;
          is_gluten_free?: boolean | null;
          is_vegan?: boolean | null;
          is_vegetarian?: boolean | null;
          name: string;
          price?: number | null;
          updated_at?: string | null;
          vendor_id: string;
        };
        Update: {
          allergens?: string[] | null;
          category?: string | null;
          created_at?: string | null;
          currency?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          id?: string;
          image_url?: string;
          is_available?: boolean | null;
          is_gluten_free?: boolean | null;
          is_vegan?: boolean | null;
          is_vegetarian?: boolean | null;
          name?: string;
          price?: number | null;
          updated_at?: string | null;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      plan_limits: {
        Row: {
          can_remove_branding: boolean | null;
          can_respond_to_reviews: boolean | null;
          can_use_advanced_analytics: boolean | null;
          can_use_analytics: boolean | null;
          can_use_announcements: boolean | null;
          can_use_api_access: boolean | null;
          can_use_direct_messaging: boolean | null;
          can_use_featured_placement: boolean | null;
          can_use_marketing_tools: boolean | null;
          can_use_team_accounts: boolean | null;
          can_use_verified_badge: boolean | null;
          can_use_weekly_schedule: boolean | null;
          created_at: string | null;
          has_priority_support: boolean | null;
          id: string;
          max_menu_items: number | null;
          max_photos_per_vendor: number | null;
          max_vendors: number | null;
          support_response_time_hours: number | null;
          tier: Database["public"]["Enums"]["subscription_tier"];
          updated_at: string | null;
        };
        Insert: {
          can_remove_branding?: boolean | null;
          can_respond_to_reviews?: boolean | null;
          can_use_advanced_analytics?: boolean | null;
          can_use_analytics?: boolean | null;
          can_use_announcements?: boolean | null;
          can_use_api_access?: boolean | null;
          can_use_direct_messaging?: boolean | null;
          can_use_featured_placement?: boolean | null;
          can_use_marketing_tools?: boolean | null;
          can_use_team_accounts?: boolean | null;
          can_use_verified_badge?: boolean | null;
          can_use_weekly_schedule?: boolean | null;
          created_at?: string | null;
          has_priority_support?: boolean | null;
          id?: string;
          max_menu_items?: number | null;
          max_photos_per_vendor?: number | null;
          max_vendors?: number | null;
          support_response_time_hours?: number | null;
          tier: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string | null;
        };
        Update: {
          can_remove_branding?: boolean | null;
          can_respond_to_reviews?: boolean | null;
          can_use_advanced_analytics?: boolean | null;
          can_use_analytics?: boolean | null;
          can_use_announcements?: boolean | null;
          can_use_api_access?: boolean | null;
          can_use_direct_messaging?: boolean | null;
          can_use_featured_placement?: boolean | null;
          can_use_marketing_tools?: boolean | null;
          can_use_team_accounts?: boolean | null;
          can_use_verified_badge?: boolean | null;
          can_use_weekly_schedule?: boolean | null;
          created_at?: string | null;
          has_priority_support?: boolean | null;
          id?: string;
          max_menu_items?: number | null;
          max_photos_per_vendor?: number | null;
          max_vendors?: number | null;
          support_response_time_hours?: number | null;
          tier?: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      pricing_migrations: {
        Row: {
          affected_users: number | null;
          affected_vendors: number | null;
          cutoff_date: string | null;
          executed_at: string | null;
          id: string;
          migration_name: string;
          notes: string | null;
        };
        Insert: {
          affected_users?: number | null;
          affected_vendors?: number | null;
          cutoff_date?: string | null;
          executed_at?: string | null;
          id?: string;
          migration_name: string;
          notes?: string | null;
        };
        Update: {
          affected_users?: number | null;
          affected_vendors?: number | null;
          cutoff_date?: string | null;
          executed_at?: string | null;
          id?: string;
          migration_name?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      spatial_ref_sys: {
        Row: {
          auth_name: string | null;
          auth_srid: number | null;
          proj4text: string | null;
          srid: number;
          srtext: string | null;
        };
        Insert: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid: number;
          srtext?: string | null;
        };
        Update: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid?: number;
          srtext?: string | null;
        };
        Relationships: [];
      };
      stripe_prices: {
        Row: {
          amount: number;
          billing_interval: string;
          created_at: string | null;
          currency: string | null;
          id: string;
          is_active: boolean | null;
          is_early_adopter: boolean | null;
          stripe_price_id: string;
          tier: Database["public"]["Enums"]["subscription_tier"];
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          billing_interval: string;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_early_adopter?: boolean | null;
          stripe_price_id: string;
          tier: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          billing_interval?: string;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_early_adopter?: boolean | null;
          stripe_price_id?: string;
          tier?: Database["public"]["Enums"]["subscription_tier"];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      subscription_history: {
        Row: {
          change_reason: string | null;
          changed_at: string | null;
          changed_by: string | null;
          from_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
          from_tier: Database["public"]["Enums"]["subscription_tier"] | null;
          id: string;
          notes: string | null;
          stripe_event_id: string | null;
          stripe_subscription_id: string | null;
          to_status: Database["public"]["Enums"]["subscription_status"];
          to_tier: Database["public"]["Enums"]["subscription_tier"];
          user_id: string;
        };
        Insert: {
          change_reason?: string | null;
          changed_at?: string | null;
          changed_by?: string | null;
          from_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
          from_tier?: Database["public"]["Enums"]["subscription_tier"] | null;
          id?: string;
          notes?: string | null;
          stripe_event_id?: string | null;
          stripe_subscription_id?: string | null;
          to_status: Database["public"]["Enums"]["subscription_status"];
          to_tier: Database["public"]["Enums"]["subscription_tier"];
          user_id: string;
        };
        Update: {
          change_reason?: string | null;
          changed_at?: string | null;
          changed_by?: string | null;
          from_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
          from_tier?: Database["public"]["Enums"]["subscription_tier"] | null;
          id?: string;
          notes?: string | null;
          stripe_event_id?: string | null;
          stripe_subscription_id?: string | null;
          to_status?: Database["public"]["Enums"]["subscription_status"];
          to_tier?: Database["public"]["Enums"]["subscription_tier"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscription_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscription_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_activated_at: string | null;
          created_at: string | null;
          deleted_at: string | null;
          early_adopter_discount_percent: number | null;
          email_notifications_enabled: boolean | null;
          founder_date: string | null;
          founder_tier: Database["public"]["Enums"]["subscription_tier"] | null;
          full_name: string | null;
          id: string;
          is_early_adopter: boolean | null;
          location_sharing_enabled: boolean | null;
          notification_enabled: boolean | null;
          phone_number: string | null;
          roles: string[] | null;
          stripe_customer_id: string | null;
          stripe_price_id: string | null;
          stripe_subscription_id: string | null;
          subscription_ends_at: string | null;
          subscription_started_at: string | null;
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_activated_at?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          early_adopter_discount_percent?: number | null;
          email_notifications_enabled?: boolean | null;
          founder_date?: string | null;
          founder_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null;
          full_name?: string | null;
          id: string;
          is_early_adopter?: boolean | null;
          location_sharing_enabled?: boolean | null;
          notification_enabled?: boolean | null;
          phone_number?: string | null;
          roles?: string[] | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          subscription_started_at?: string | null;
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_activated_at?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          early_adopter_discount_percent?: number | null;
          email_notifications_enabled?: boolean | null;
          founder_date?: string | null;
          founder_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null;
          full_name?: string | null;
          id?: string;
          is_early_adopter?: boolean | null;
          location_sharing_enabled?: boolean | null;
          notification_enabled?: boolean | null;
          phone_number?: string | null;
          roles?: string[] | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          subscription_started_at?: string | null;
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      vendor_locations: {
        Row: {
          accuracy: number | null;
          address: string | null;
          id: string;
          location: unknown;
          recorded_at: string | null;
          session_id: string | null;
          source: string | null;
          vendor_id: string;
        };
        Insert: {
          accuracy?: number | null;
          address?: string | null;
          id?: string;
          location: unknown;
          recorded_at?: string | null;
          session_id?: string | null;
          source?: string | null;
          vendor_id: string;
        };
        Update: {
          accuracy?: number | null;
          address?: string | null;
          id?: string;
          location?: unknown;
          recorded_at?: string | null;
          session_id?: string | null;
          source?: string | null;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vendor_locations_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "vendor_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendor_locations_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      vendor_schedules: {
        Row: {
          closing_time: string;
          created_at: string | null;
          day_of_week: Database["public"]["Enums"]["day_of_week"];
          id: string;
          is_active: boolean | null;
          opening_time: string;
          updated_at: string | null;
          vendor_id: string;
        };
        Insert: {
          closing_time: string;
          created_at?: string | null;
          day_of_week: Database["public"]["Enums"]["day_of_week"];
          id?: string;
          is_active?: boolean | null;
          opening_time: string;
          updated_at?: string | null;
          vendor_id: string;
        };
        Update: {
          closing_time?: string;
          created_at?: string | null;
          day_of_week?: Database["public"]["Enums"]["day_of_week"];
          id?: string;
          is_active?: boolean | null;
          opening_time?: string;
          updated_at?: string | null;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vendor_schedules_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      vendor_sessions: {
        Row: {
          address: string | null;
          ended_at: string | null;
          id: string;
          is_active: boolean | null;
          last_ping_at: string | null;
          location: unknown;
          notes: string | null;
          started_at: string | null;
          vendor_id: string;
        };
        Insert: {
          address?: string | null;
          ended_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_ping_at?: string | null;
          location: unknown;
          notes?: string | null;
          started_at?: string | null;
          vendor_id: string;
        };
        Update: {
          address?: string | null;
          ended_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_ping_at?: string | null;
          location?: unknown;
          notes?: string | null;
          started_at?: string | null;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vendor_sessions_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      vendors: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          created_by: string | null;
          current_address: string | null;
          current_location: unknown;
          deleted_at: string | null;
          description: string | null;
          email: string | null;
          facebook_url: string | null;
          id: string;
          instagram_handle: string | null;
          is_grandfathered: boolean | null;
          is_open_now: boolean | null;
          name: string;
          owner_id: string;
          phone_number: string | null;
          status: Database["public"]["Enums"]["listing_status"] | null;
          timezone: string | null;
          updated_at: string | null;
          updated_by: string | null;
          website_url: string | null;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          current_address?: string | null;
          current_location?: unknown;
          deleted_at?: string | null;
          description?: string | null;
          email?: string | null;
          facebook_url?: string | null;
          id?: string;
          instagram_handle?: string | null;
          is_grandfathered?: boolean | null;
          is_open_now?: boolean | null;
          name: string;
          owner_id: string;
          phone_number?: string | null;
          status?: Database["public"]["Enums"]["listing_status"] | null;
          timezone?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          website_url?: string | null;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          current_address?: string | null;
          current_location?: unknown;
          deleted_at?: string | null;
          description?: string | null;
          email?: string | null;
          facebook_url?: string | null;
          id?: string;
          instagram_handle?: string | null;
          is_grandfathered?: boolean | null;
          is_open_now?: boolean | null;
          name?: string;
          owner_id?: string;
          phone_number?: string | null;
          status?: Database["public"]["Enums"]["listing_status"] | null;
          timezone?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vendors_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendors_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendors_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendors_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null;
          f_geography_column: unknown;
          f_table_catalog: unknown;
          f_table_name: unknown;
          f_table_schema: unknown;
          srid: number | null;
          type: string | null;
        };
        Relationships: [];
      };
      geometry_columns: {
        Row: {
          coord_dimension: number | null;
          f_geometry_column: unknown;
          f_table_catalog: string | null;
          f_table_name: unknown;
          f_table_schema: unknown;
          srid: number | null;
          type: string | null;
        };
        Insert: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown;
          f_table_catalog?: string | null;
          f_table_name?: unknown;
          f_table_schema?: unknown;
          srid?: number | null;
          type?: string | null;
        };
        Update: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown;
          f_table_catalog?: string | null;
          f_table_name?: unknown;
          f_table_schema?: unknown;
          srid?: number | null;
          type?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string };
        Returns: undefined;
      };
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown };
        Returns: unknown;
      };
      _postgis_pgsql_version: { Args: never; Returns: string };
      _postgis_scripts_pgsql_version: { Args: never; Returns: string };
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown };
        Returns: number;
      };
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown };
        Returns: string;
      };
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_sortablehash: { Args: { geom: unknown }; Returns: number };
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_voronoi: {
        Args: {
          clip?: unknown;
          g1: unknown;
          return_polygons?: boolean;
          tolerance?: number;
        };
        Returns: unknown;
      };
      _st_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      add_user_role: {
        Args: { p_role: string; p_user_id: string };
        Returns: undefined;
      };
      addauth: { Args: { "": string }; Returns: boolean };
      addgeometrycolumn:
        | {
            Args: {
              column_name: string;
              new_dim: number;
              new_srid: number;
              new_type: string;
              schema_name: string;
              table_name: string;
              use_typmod?: boolean;
            };
            Returns: string;
          }
        | {
            Args: {
              column_name: string;
              new_dim: number;
              new_srid: number;
              new_type: string;
              table_name: string;
              use_typmod?: boolean;
            };
            Returns: string;
          }
        | {
            Args: {
              catalog_name: string;
              column_name: string;
              new_dim: number;
              new_srid_in: number;
              new_type: string;
              schema_name: string;
              table_name: string;
              use_typmod?: boolean;
            };
            Returns: string;
          };
      become_creator: { Args: never; Returns: undefined };
      can_user_access_feature: {
        Args: { p_feature_name: string; p_user_id: string };
        Returns: boolean;
      };
      disablelongtransactions: { Args: never; Returns: string };
      dropgeometrycolumn:
        | {
            Args: {
              column_name: string;
              schema_name: string;
              table_name: string;
            };
            Returns: string;
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string;
              column_name: string;
              schema_name: string;
              table_name: string;
            };
            Returns: string;
          };
      dropgeometrytable:
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string;
              schema_name: string;
              table_name: string;
            };
            Returns: string;
          };
      enablelongtransactions: { Args: never; Returns: string };
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      find_events_near_me: {
        Args: { lat: number; lng: number; radius_meters?: number };
        Returns: {
          category_name: string;
          distance_meters: number;
          end_time: string;
          event_id: string;
          event_name: string;
          is_active_now: boolean;
          start_time: string;
        }[];
      };
      find_vendors_near_me: {
        Args: { lat: number; lng: number; radius_meters?: number };
        Returns: {
          category_name: string;
          current_location: unknown;
          distance_meters: number;
          is_open_now: boolean;
          vendor_id: string;
          vendor_name: string;
        }[];
      };
      geometry: { Args: { "": string }; Returns: unknown };
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geomfromewkt: { Args: { "": string }; Returns: unknown };
      get_stripe_price_id_for_user: {
        Args: {
          p_billing_interval?: string;
          p_tier: Database["public"]["Enums"]["subscription_tier"];
          p_user_id: string;
        };
        Returns: string;
      };
      get_user_price: {
        Args: {
          p_billing_interval?: string;
          p_tier: Database["public"]["Enums"]["subscription_tier"];
          p_user_id: string;
        };
        Returns: number;
      };
      get_user_roles: { Args: { p_user_id: string }; Returns: string[] };
      get_vendor_active_session: {
        Args: { p_vendor_id: string };
        Returns: {
          address: string | null;
          ended_at: string | null;
          id: string;
          is_active: boolean | null;
          last_ping_at: string | null;
          location: unknown;
          notes: string | null;
          started_at: string | null;
          vendor_id: string;
        };
        SetofOptions: {
          from: "*";
          to: "vendor_sessions";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      gettransactionid: { Args: never; Returns: unknown };
      longtransactionsenabled: { Args: never; Returns: boolean };
      make_user_admin: { Args: { p_email: string }; Returns: undefined };
      populate_geometry_columns:
        | { Args: { use_typmod?: boolean }; Returns: string }
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number };
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: number;
      };
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: number;
      };
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: string;
      };
      postgis_extensions_upgrade: { Args: never; Returns: string };
      postgis_full_version: { Args: never; Returns: string };
      postgis_geos_version: { Args: never; Returns: string };
      postgis_lib_build_date: { Args: never; Returns: string };
      postgis_lib_revision: { Args: never; Returns: string };
      postgis_lib_version: { Args: never; Returns: string };
      postgis_libjson_version: { Args: never; Returns: string };
      postgis_liblwgeom_version: { Args: never; Returns: string };
      postgis_libprotobuf_version: { Args: never; Returns: string };
      postgis_libxml_version: { Args: never; Returns: string };
      postgis_proj_version: { Args: never; Returns: string };
      postgis_scripts_build_date: { Args: never; Returns: string };
      postgis_scripts_installed: { Args: never; Returns: string };
      postgis_scripts_released: { Args: never; Returns: string };
      postgis_svn_version: { Args: never; Returns: string };
      postgis_type_name: {
        Args: {
          coord_dimension: number;
          geomname: string;
          use_new_name?: boolean;
        };
        Returns: string;
      };
      postgis_version: { Args: never; Returns: string };
      postgis_wagyu_version: { Args: never; Returns: string };
      remove_user_role: {
        Args: { p_role: string; p_user_id: string };
        Returns: undefined;
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown };
            Returns: number;
          };
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number };
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number };
        Returns: string;
      };
      st_asewkt: { Args: { "": string }; Returns: string };
      st_asgeojson:
        | {
            Args: {
              geom_column?: string;
              maxdecimaldigits?: number;
              pretty_bool?: boolean;
              r: Record<string, unknown>;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              maxdecimaldigits?: number;
              options?: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geog: unknown;
              maxdecimaldigits?: number;
              options?: number;
            };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_asgml:
        | {
            Args: {
              geom: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
              version: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              maxdecimaldigits?: number;
              options?: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geog: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
              version: number;
            };
            Returns: string;
          }
        | {
            Args: {
              geog: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
            };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_askml:
        | {
            Args: {
              geom: unknown;
              maxdecimaldigits?: number;
              nprefix?: string;
            };
            Returns: string;
          }
        | {
            Args: {
              geog: unknown;
              maxdecimaldigits?: number;
              nprefix?: string;
            };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string };
        Returns: string;
      };
      st_asmarc21: {
        Args: { format?: string; geom: unknown };
        Returns: string;
      };
      st_asmvtgeom: {
        Args: {
          bounds: unknown;
          buffer?: number;
          clip_geom?: boolean;
          extent?: number;
          geom: unknown;
        };
        Returns: unknown;
      };
      st_assvg:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number };
            Returns: string;
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number };
            Returns: string;
          }
        | { Args: { "": string }; Returns: string };
      st_astext: { Args: { "": string }; Returns: string };
      st_astwkb:
        | {
            Args: {
              geom: unknown[];
              ids: number[];
              prec?: number;
              prec_m?: number;
              prec_z?: number;
              with_boxes?: boolean;
              with_sizes?: boolean;
            };
            Returns: string;
          }
        | {
            Args: {
              geom: unknown;
              prec?: number;
              prec_m?: number;
              prec_z?: number;
              with_boxes?: boolean;
              with_sizes?: boolean;
            };
            Returns: string;
          };
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number };
        Returns: string;
      };
      st_azimuth:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number };
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown };
        Returns: unknown;
      };
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number };
            Returns: unknown;
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number };
            Returns: unknown;
          };
      st_centroid: { Args: { "": string }; Returns: unknown };
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown };
        Returns: unknown;
      };
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_collect: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean;
          param_geom: unknown;
          param_pctconvex: number;
        };
        Returns: unknown;
      };
      st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_coorddim: { Args: { geometry: unknown }; Returns: number };
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number };
        Returns: unknown;
      };
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_distance:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean };
            Returns: number;
          };
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number };
            Returns: number;
          };
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_expand:
        | {
            Args: {
              dm?: number;
              dx: number;
              dy: number;
              dz?: number;
              geom: unknown;
            };
            Returns: unknown;
          }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number };
            Returns: unknown;
          }
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown };
      st_force3d: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number };
        Returns: unknown;
      };
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number };
        Returns: unknown;
      };
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number };
            Returns: unknown;
          };
      st_geogfromtext: { Args: { "": string }; Returns: unknown };
      st_geographyfromtext: { Args: { "": string }; Returns: unknown };
      st_geohash:
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
        | { Args: { geog: unknown; maxchars?: number }; Returns: string };
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown };
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean;
          g: unknown;
          max_iter?: number;
          tolerance?: number;
        };
        Returns: unknown;
      };
      st_geometryfromtext: { Args: { "": string }; Returns: unknown };
      st_geomfromewkt: { Args: { "": string }; Returns: unknown };
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown };
      st_geomfromgml: { Args: { "": string }; Returns: unknown };
      st_geomfromkml: { Args: { "": string }; Returns: unknown };
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown };
      st_geomfromtext: { Args: { "": string }; Returns: unknown };
      st_gmltosql: { Args: { "": string }; Returns: unknown };
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean };
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_hexagon: {
        Args: {
          cell_i: number;
          cell_j: number;
          origin?: unknown;
          size: number;
        };
        Returns: unknown;
      };
      st_hexagongrid: {
        Args: { bounds: unknown; size: number };
        Returns: Record<string, unknown>[];
      };
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown };
        Returns: number;
      };
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_intersects:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean };
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown };
        Returns: Database["public"]["CompositeTypes"]["valid_detail"];
        SetofOptions: {
          from: "*";
          to: "valid_detail";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number };
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown };
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string };
        Returns: unknown;
      };
      st_linefromtext: { Args: { "": string }; Returns: unknown };
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown };
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number };
        Returns: unknown;
      };
      st_locatebetween: {
        Args: {
          frommeasure: number;
          geometry: unknown;
          leftrightoffset?: number;
          tomeasure: number;
        };
        Returns: unknown;
      };
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number };
        Returns: unknown;
      };
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makevalid: {
        Args: { geom: unknown; params: string };
        Returns: unknown;
      };
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number };
        Returns: unknown;
      };
      st_mlinefromtext: { Args: { "": string }; Returns: unknown };
      st_mpointfromtext: { Args: { "": string }; Returns: unknown };
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown };
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown };
      st_multipointfromtext: { Args: { "": string }; Returns: unknown };
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown };
      st_node: { Args: { g: unknown }; Returns: unknown };
      st_normalize: { Args: { geom: unknown }; Returns: unknown };
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string };
        Returns: unknown;
      };
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_pointfromtext: { Args: { "": string }; Returns: unknown };
      st_pointm: {
        Args: {
          mcoordinate: number;
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
        };
        Returns: unknown;
      };
      st_pointz: {
        Args: {
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
        };
        Returns: unknown;
      };
      st_pointzm: {
        Args: {
          mcoordinate: number;
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
        };
        Returns: unknown;
      };
      st_polyfromtext: { Args: { "": string }; Returns: unknown };
      st_polygonfromtext: { Args: { "": string }; Returns: unknown };
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown };
        Returns: unknown;
      };
      st_quantizecoordinates: {
        Args: {
          g: unknown;
          prec_m?: number;
          prec_x: number;
          prec_y?: number;
          prec_z?: number;
        };
        Returns: unknown;
      };
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number };
        Returns: unknown;
      };
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string };
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number };
        Returns: unknown;
      };
      st_setsrid:
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
        | { Args: { geog: unknown; srid: number }; Returns: unknown };
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number };
        Returns: unknown;
      };
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown };
      st_square: {
        Args: {
          cell_i: number;
          cell_j: number;
          origin?: unknown;
          size: number;
        };
        Returns: unknown;
      };
      st_squaregrid: {
        Args: { bounds: unknown; size: number };
        Returns: Record<string, unknown>[];
      };
      st_srid:
        | { Args: { geom: unknown }; Returns: number }
        | { Args: { geog: unknown }; Returns: number };
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number };
        Returns: unknown[];
      };
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown };
        Returns: unknown;
      };
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_tileenvelope: {
        Args: {
          bounds?: unknown;
          margin?: number;
          x: number;
          y: number;
          zoom: number;
        };
        Returns: unknown;
      };
      st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_transform:
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number };
            Returns: unknown;
          }
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string };
            Returns: unknown;
          };
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown };
      st_union:
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number };
            Returns: unknown;
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown };
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean };
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown };
      st_wkttosql: { Args: { "": string }; Returns: unknown };
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number };
        Returns: unknown;
      };
      unlockrows: { Args: { "": string }; Returns: number };
      updategeometrysrid: {
        Args: {
          catalogn_name: string;
          column_name: string;
          new_srid_in: number;
          schema_name: string;
          table_name: string;
        };
        Returns: string;
      };
      user_has_role: {
        Args: { p_role: string; p_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday";
      listing_status: "active" | "inactive" | "pending" | "suspended";
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "paused";
      subscription_tier: "free" | "pro" | "premium";
    };
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null;
        geom: unknown;
      };
      valid_detail: {
        valid: boolean | null;
        reason: string | null;
        location: unknown;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      listing_status: ["active", "inactive", "pending", "suspended"],
      subscription_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "paused",
      ],
      subscription_tier: ["free", "pro", "premium"],
    },
  },
} as const;
