// Shared Zod validation schemas for web and mobile
import { z } from "zod";
import type {
  UserRole,
  ListingStatus,
  SubscriptionTier,
  DayOfWeek,
} from "@nuge/types";

// ===================================
// User & Auth Schemas
// ===================================
export const userRoleSchema = z.enum([
  "customer",
  "vendor",
  "organizer",
  "admin",
]) as z.ZodType<UserRole>;

export const profileSchema = z.object({
  display_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatar_url: z.string().url().optional(),
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  display_name: z.string().min(2).max(100),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ===================================
// OTP Auth Schemas
// ===================================

/**
 * Schema for requesting an OTP (magic link or code)
 */
export const requestOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * Schema for verifying an OTP code
 */
export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z
    .string()
    .length(6, "OTP code must be 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only numbers"),
});

/**
 * Schema for OTP sign up with display name
 */
export const signUpWithOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  display_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),
});

// ===================================
// Enum Schemas
// ===================================
export const listingStatusSchema = z.enum([
  "active",
  "inactive",
  "pending",
  "suspended",
]) as z.ZodType<ListingStatus>;

export const subscriptionTierSchema = z.enum([
  "free",
  "pro",
  "premium",
]) as z.ZodType<SubscriptionTier>;

export const dayOfWeekSchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]) as z.ZodType<DayOfWeek>;

// ===================================
// Location & Coordinates Schemas
// ===================================
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const nearbySearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius_meters: z.number().min(100).max(100000).default(5000), // 100m to 100km, default 5km
});

// ===================================
// Vendor Schemas
// ===================================
export const createVendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(2000).optional(),
  category_id: z.string().uuid("Invalid category"),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  website_url: z.string().url().optional(),
  instagram_handle: z.string().max(100).optional(),
  facebook_url: z.string().url().optional(),
});

export const updateVendorSchema = createVendorSchema.partial().extend({
  status: listingStatusSchema.optional(),
});

export const startVendorSessionSchema = z.object({
  vendor_id: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

// ===================================
// Event Schemas
// ===================================
const eventBaseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  category_id: z.string().uuid("Invalid category"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  venue_name: z.string().max(200).optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  contact_email: z.string().email().optional(),
  contact_phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  website_url: z.string().url().optional(),
  instagram_handle: z.string().max(100).optional(),
  facebook_url: z.string().url().optional(),
  is_recurring: z.boolean().optional(),
  recurrence_rule: z.string().optional(),
});

export const createEventSchema = eventBaseSchema.refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  {
    message: "End time must be after start time",
    path: ["end_time"],
  }
);

export const updateEventSchema = eventBaseSchema.partial().extend({
  status: listingStatusSchema.optional(),
});

// ===================================
// Menu Item Schemas
// ===================================
export const createMenuItemSchema = z.object({
  vendor_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().min(0).optional(),
  category: z.string().max(100).optional(),
  is_available: z.boolean().default(true),
  is_vegetarian: z.boolean().default(false),
  is_vegan: z.boolean().default(false),
  is_gluten_free: z.boolean().default(false),
  allergens: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema
  .partial()
  .omit({ vendor_id: true });

// ===================================
// Vendor Schedule Schemas
// ===================================
export const createScheduleSchema = z.object({
  vendor_id: z.string().uuid(),
  day_of_week: dayOfWeekSchema,
  opening_time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "Invalid time format (HH:MM)"
    ),
  closing_time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "Invalid time format (HH:MM)"
    ),
  is_active: z.boolean().default(true),
});

export const updateScheduleSchema = createScheduleSchema
  .partial()
  .omit({ vendor_id: true });

// ===================================
// Category Schemas
// ===================================
export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  type: z.enum(["vendor", "event"]),
  description: z.string().max(500).optional(),
  icon_url: z.string().url().optional(),
  display_order: z.number().int().min(0).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
