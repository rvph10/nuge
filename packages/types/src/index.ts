// ===================================
// Database Types (Auto-generated)
// ===================================
export type { Database, Tables, Enums } from "./database.types";
export type { Json } from "./database.types";

// ===================================
// Domain Types (Built on Database Types)
// ===================================
import type { Database, Tables } from "./database.types";

// Extract row types from database
export type User = Tables<"users">;
export type Vendor = Tables<"vendors">;
export type Event = Tables<"events">;
export type Category = Tables<"categories">;
export type MenuItem = Tables<"menu_items">;
export type VendorSession = Tables<"vendor_sessions">;
export type VendorLocation = Tables<"vendor_locations">;
export type VendorSchedule = Tables<"vendor_schedules">;
export type SubscriptionHistory = Tables<"subscription_history">;
export type PlanLimits = Tables<"plan_limits">;
export type StripePrice = Tables<"stripe_prices">;

// Extract enum types
export type ListingStatus = Database["public"]["Enums"]["listing_status"];
export type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];
export type SubscriptionStatus =
  Database["public"]["Enums"]["subscription_status"];
export type DayOfWeek = Database["public"]["Enums"]["day_of_week"];

// ===================================
// Helper Types
// ===================================

// User roles (stored as text array in database)
export type UserRole = "customer" | "vendor" | "organizer" | "admin";

// Coordinates helper
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Convert PostGIS geography point to Coordinates
export function parseLocation(location: unknown): Coordinates | null {
  if (!location) return null;
  // PostGIS returns geography as GeoJSON or WKT
  // This is a placeholder - actual parsing depends on Supabase response format
  // Typically Supabase returns: { type: 'Point', coordinates: [lng, lat] }
  if (
    typeof location === "object" &&
    location !== null &&
    "coordinates" in location
  ) {
    const coords = (location as any).coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      return { longitude: coords[0], latitude: coords[1] };
    }
  }
  return null;
}

// ===================================
// Domain-Specific Types
// ===================================

// Vendor with populated relationships
export interface VendorWithDetails extends Vendor {
  category?: Category;
  menu_items?: MenuItem[];
  active_session?: VendorSession;
  schedules?: VendorSchedule[];
  owner?: User;
}

// Event with populated relationships
export interface EventWithDetails extends Event {
  category?: Category;
  organizer?: User;
}

// User with subscription details
export interface UserProfile extends User {
  plan_limits?: PlanLimits;
  vendors?: Vendor[];
  events?: Event[];
}

// ===================================
// API Request/Response Types
// ===================================

export interface NearbyVendorsRequest {
  latitude: number;
  longitude: number;
  radius_meters?: number; // defaults to 5000 in database function
}

export interface NearbyEventsRequest {
  latitude: number;
  longitude: number;
  radius_meters?: number; // defaults to 10000 in database function
}

// Response types for database functions (auto-inferred from database.types.ts)
export type NearbyVendorResult = {
  vendor_id: string;
  vendor_name: string;
  current_location: unknown;
  distance_meters: number;
  is_open_now: boolean;
  category_name: string;
};

export type NearbyEventResult = {
  event_id: string;
  event_name: string;
  location: unknown;
  distance_meters: number;
  category_name: string;
};

// Location update types
export interface UpdateLocationRequest {
  vendor_id: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface StartVendorSessionRequest {
  vendor_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  notes?: string;
}

export interface EndVendorSessionRequest {
  session_id: string;
}

// ===================================
// Form/Validation Types
// ===================================

export interface CreateVendorInput {
  name: string;
  description?: string;
  category_id: string;
  email?: string;
  phone?: string;
  website_url?: string;
  instagram_handle?: string;
  facebook_url?: string;
}

export interface UpdateVendorInput {
  name?: string;
  description?: string;
  category_id?: string;
  email?: string;
  phone?: string;
  website_url?: string;
  instagram_handle?: string;
  facebook_url?: string;
  status?: ListingStatus;
}

export interface CreateEventInput {
  name: string;
  description?: string;
  category_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  venue_name?: string;
  start_time: string;
  end_time: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  instagram_handle?: string;
  facebook_url?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
}

export interface CreateMenuItemInput {
  vendor_id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  is_available?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  image_url?: string;
}

// ===================================
// Subscription & Billing Types
// ===================================

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface PlanLimitsInfo extends PlanLimits {
  current_usage?: {
    vendors?: number;
    menu_items?: number;
    photos?: number;
  };
}

// ===================================
// Database Function Types
// ===================================

// For calling database functions with proper types
export interface DatabaseFunctions {
  find_vendors_near_me: {
    args: { lat: number; lng: number; radius_meters?: number };
    returns: NearbyVendorResult[];
  };
  find_events_near_me: {
    args: { lat: number; lng: number; radius_meters?: number };
    returns: NearbyEventResult[];
  };
  get_user_roles: {
    args: { p_user_id: string };
    returns: string[];
  };
  user_has_role: {
    args: { p_user_id: string; p_role: string };
    returns: boolean;
  };
  can_user_access_feature: {
    args: { p_user_id: string; p_feature_name: string };
    returns: boolean;
  };
  check_vendor_limit: {
    args: { p_user_id: string };
    returns: boolean;
  };
  check_menu_item_limit: {
    args: { p_vendor_id: string };
    returns: boolean;
  };
  become_creator: {
    args: never;
    returns: void;
  };
}
