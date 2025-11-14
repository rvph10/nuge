/**
 * Application Constants
 *
 * This file contains non-sensitive configuration values and constants
 * used throughout the application.
 */

// ===================================
// Map Configuration
// ===================================

export const MAP_CONFIG = {
  /** Default map center (Brussels, Belgium) */
  DEFAULT_CENTER: {
    latitude: 50.8503,
    longitude: 4.3517,
  },
  /** Default zoom level */
  DEFAULT_ZOOM: 12,
  /** Maximum zoom level */
  MAX_ZOOM: 18,
  /** Minimum zoom level */
  MIN_ZOOM: 8,
  /** Default search radius in meters */
  DEFAULT_SEARCH_RADIUS: 5000, // 5km
  /** Maximum search radius in meters */
  MAX_SEARCH_RADIUS: 100000, // 100km
} as const;

// ===================================
// Search & Pagination
// ===================================

export const PAGINATION = {
  /** Default items per page */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum items per page */
  MAX_PAGE_SIZE: 100,
  /** Vendors per page */
  VENDORS_PER_PAGE: 12,
  /** Events per page */
  EVENTS_PER_PAGE: 12,
  /** Menu items per page */
  MENU_ITEMS_PER_PAGE: 20,
} as const;

// ===================================
// Cache & Data Refetch
// ===================================

export const CACHE_CONFIG = {
  /** How often to refetch vendor locations (ms) */
  VENDOR_LOCATION_REFETCH: 30000, // 30 seconds
  /** How often to refetch events (ms) */
  EVENTS_REFETCH: 60000, // 1 minute
  /** Stale time for user profile (ms) */
  USER_PROFILE_STALE_TIME: 300000, // 5 minutes
  /** Stale time for categories (ms) */
  CATEGORIES_STALE_TIME: 3600000, // 1 hour
  /** Default stale time (ms) */
  DEFAULT_STALE_TIME: 60000, // 1 minute
} as const;

// ===================================
// Limits & Validation
// ===================================

export const LIMITS = {
  /** Maximum file upload size in bytes (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Allowed image mime types */
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  /** Maximum vendor name length */
  MAX_VENDOR_NAME_LENGTH: 200,
  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 2000,
  /** Maximum bio length */
  MAX_BIO_LENGTH: 500,
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,
  /** Maximum menu items per vendor (free tier) */
  FREE_TIER_MENU_ITEMS: 10,
  /** Maximum menu items per vendor (pro tier) */
  PRO_TIER_MENU_ITEMS: 50,
  /** Maximum vendors per user (free tier) */
  FREE_TIER_VENDORS: 1,
  /** Maximum vendors per user (pro tier) */
  PRO_TIER_VENDORS: 5,
} as const;

// ===================================
// Time & Date
// ===================================

export const TIME_CONFIG = {
  /** Default timezone */
  DEFAULT_TIMEZONE: "Europe/Brussels",
  /** Supported timezones */
  SUPPORTED_TIMEZONES: [
    "Europe/Brussels",
    "Europe/Paris",
    "Europe/London",
    "America/New_York",
    "America/Los_Angeles",
  ],
  /** Date format for display */
  DATE_FORMAT: "MMM dd, yyyy",
  /** Time format for display */
  TIME_FORMAT: "HH:mm",
  /** DateTime format for display */
  DATETIME_FORMAT: "MMM dd, yyyy HH:mm",
} as const;

// ===================================
// Subscription & Billing
// ===================================

export const SUBSCRIPTION = {
  /** Free tier name */
  FREE_TIER: "free",
  /** Pro tier name */
  PRO_TIER: "pro",
  /** Premium tier name */
  PREMIUM_TIER: "premium",
  /** Early adopter discount percentage */
  EARLY_ADOPTER_DISCOUNT: 20,
  /** Trial period in days */
  TRIAL_PERIOD_DAYS: 14,
} as const;

// ===================================
// Routes
// ===================================

export const ROUTES = {
  HOME: "/",
  MAP: "/map",

  // Auth
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  SIGN_OUT: "/auth/sign-out",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // User
  PROFILE: "/profile",
  SETTINGS: "/settings",
  FAVORITES: "/favorites",

  // Vendors
  VENDORS: "/vendors",
  VENDOR_DETAIL: (id: string) => `/vendors/${id}`,
  VENDOR_CREATE: "/vendors/create",
  VENDOR_EDIT: (id: string) => `/vendors/${id}/edit`,
  VENDOR_DASHBOARD: (id: string) => `/vendors/${id}/dashboard`,

  // Events
  EVENTS: "/events",
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_CREATE: "/events/create",
  EVENT_EDIT: (id: string) => `/events/${id}/edit`,

  // Categories
  CATEGORY: (slug: string) => `/category/${slug}`,

  // Dashboard
  DASHBOARD: "/dashboard",

  // Subscription
  PRICING: "/pricing",
  BILLING: "/billing",

  // Legal
  TERMS: "/terms",
  PRIVACY: "/privacy",

  // API
  API: {
    AUTH: "/api/auth",
    VENDORS: "/api/vendors",
    EVENTS: "/api/events",
    SEARCH: "/api/search",
    UPLOAD: "/api/upload",
    WEBHOOK: "/api/webhook",
  },
} as const;

// ===================================
// Feature Flags
// ===================================

export const FEATURES = {
  /** Enable analytics tracking */
  ANALYTICS_ENABLED: true,
  /** Enable real-time location updates */
  REALTIME_ENABLED: true,
  /** Enable push notifications */
  PUSH_NOTIFICATIONS_ENABLED: false,
  /** Enable dark mode */
  DARK_MODE_ENABLED: true,
  /** Enable beta features */
  BETA_FEATURES_ENABLED: false,
} as const;

// ===================================
// External Links
// ===================================

export const EXTERNAL_LINKS = {
  GITHUB: "https://github.com/yourusername/nuge",
  TWITTER: "https://twitter.com/nuge",
  INSTAGRAM: "https://instagram.com/nuge",
  SUPPORT_EMAIL: "support@nuge.app",
  FEEDBACK_EMAIL: "feedback@nuge.app",
} as const;

// ===================================
// Status Codes
// ===================================

export const STATUS = {
  // Listing Status
  LISTING: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    SUSPENDED: "suspended",
  },
  // Subscription Status
  SUBSCRIPTION: {
    ACTIVE: "active",
    TRIALING: "trialing",
    PAST_DUE: "past_due",
    CANCELED: "canceled",
    UNPAID: "unpaid",
    INCOMPLETE: "incomplete",
    PAUSED: "paused",
  },
} as const;

// ===================================
// Error Messages
// ===================================

export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You must be signed in to do that.",
  FORBIDDEN: "You don't have permission to do that.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  RATE_LIMIT: "Too many requests. Please slow down.",
} as const;

// ===================================
// Success Messages
// ===================================

export const SUCCESS_MESSAGES = {
  VENDOR_CREATED: "Vendor created successfully!",
  VENDOR_UPDATED: "Vendor updated successfully!",
  EVENT_CREATED: "Event created successfully!",
  EVENT_UPDATED: "Event updated successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  SESSION_STARTED: "Session started! You're now visible on the map.",
  SESSION_ENDED: "Session ended successfully.",
} as const;
