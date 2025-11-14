drop extension if exists "pg_net";

create extension if not exists "pg_trgm" with schema "public";

create extension if not exists "postgis" with schema "public";

create type "public"."day_of_week" as enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

create type "public"."listing_status" as enum ('active', 'inactive', 'pending', 'suspended');

create type "public"."subscription_status" as enum ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'paused');

create type "public"."subscription_tier" as enum ('free', 'pro', 'premium');


  create table "public"."categories" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(100) not null,
    "slug" character varying(100) not null,
    "description" text,
    "icon_url" text,
    "type" character varying(20) not null,
    "display_order" integer default 0,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."categories" enable row level security;


  create table "public"."events" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "organizer_id" uuid not null,
    "name" character varying(255) not null,
    "description" text,
    "category_id" uuid,
    "contact_email" character varying(255),
    "contact_phone" character varying(50),
    "website_url" text,
    "location" public.geography(Point,4326),
    "address" text,
    "venue_name" character varying(255),
    "timezone" character varying(50) default 'Europe/Brussels'::character varying,
    "start_time" timestamp with time zone not null,
    "end_time" timestamp with time zone not null,
    "is_recurring" boolean default false,
    "recurrence_rule" text,
    "status" public.listing_status default 'active'::public.listing_status,
    "is_active_now" boolean default false,
    "instagram_handle" character varying(100),
    "facebook_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone
      );


alter table "public"."events" enable row level security;


  create table "public"."menu_items" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "vendor_id" uuid not null,
    "name" character varying(255) not null,
    "description" text,
    "price" numeric(10,2),
    "currency" character varying(3) default 'EUR'::character varying,
    "image_url" text not null,
    "is_available" boolean default true,
    "display_order" integer default 0,
    "category" character varying(100),
    "is_vegetarian" boolean default false,
    "is_vegan" boolean default false,
    "is_gluten_free" boolean default false,
    "allergens" text[],
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "deleted_at" timestamp with time zone
      );


alter table "public"."menu_items" enable row level security;


  create table "public"."plan_limits" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "tier" public.subscription_tier not null,
    "max_vendors" integer,
    "max_menu_items" integer,
    "max_photos_per_vendor" integer,
    "can_use_weekly_schedule" boolean default false,
    "can_use_analytics" boolean default false,
    "can_remove_branding" boolean default false,
    "can_use_verified_badge" boolean default false,
    "can_use_direct_messaging" boolean default false,
    "can_respond_to_reviews" boolean default false,
    "can_use_announcements" boolean default false,
    "can_use_team_accounts" boolean default false,
    "can_use_featured_placement" boolean default false,
    "can_use_advanced_analytics" boolean default false,
    "can_use_marketing_tools" boolean default false,
    "can_use_api_access" boolean default false,
    "support_response_time_hours" integer,
    "has_priority_support" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."plan_limits" enable row level security;


  create table "public"."pricing_migrations" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "migration_name" character varying(255) not null,
    "executed_at" timestamp with time zone default now(),
    "affected_vendors" integer,
    "affected_users" integer,
    "cutoff_date" timestamp with time zone,
    "notes" text
      );


alter table "public"."pricing_migrations" enable row level security;


  create table "public"."stripe_prices" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "tier" public.subscription_tier not null,
    "billing_interval" character varying(20) not null,
    "is_early_adopter" boolean default false,
    "stripe_price_id" character varying(255) not null,
    "amount" numeric(10,2) not null,
    "currency" character varying(3) default 'EUR'::character varying,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."stripe_prices" enable row level security;


  create table "public"."subscription_history" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "from_tier" public.subscription_tier,
    "to_tier" public.subscription_tier not null,
    "from_status" public.subscription_status,
    "to_status" public.subscription_status not null,
    "change_reason" character varying(100),
    "notes" text,
    "stripe_event_id" character varying(255),
    "stripe_subscription_id" character varying(255),
    "changed_by" uuid,
    "changed_at" timestamp with time zone default now()
      );


alter table "public"."subscription_history" enable row level security;


  create table "public"."users" (
    "id" uuid not null,
    "full_name" character varying(255),
    "phone_number" character varying(50),
    "avatar_url" text,
    "subscription_tier" public.subscription_tier default 'free'::public.subscription_tier,
    "subscription_status" public.subscription_status default 'active'::public.subscription_status,
    "subscription_started_at" timestamp with time zone,
    "subscription_ends_at" timestamp with time zone,
    "is_early_adopter" boolean default false,
    "early_adopter_discount_percent" integer default 0,
    "founder_tier" public.subscription_tier,
    "founder_date" timestamp with time zone,
    "billing_activated_at" timestamp with time zone,
    "stripe_customer_id" character varying(255),
    "stripe_subscription_id" character varying(255),
    "stripe_price_id" character varying(255),
    "notification_enabled" boolean default true,
    "location_sharing_enabled" boolean default true,
    "email_notifications_enabled" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "deleted_at" timestamp with time zone,
    "roles" text[] default ARRAY['customer'::text]
      );


alter table "public"."users" enable row level security;


  create table "public"."vendor_locations" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "vendor_id" uuid not null,
    "session_id" uuid,
    "location" public.geography(Point,4326) not null,
    "address" text,
    "recorded_at" timestamp with time zone default now(),
    "accuracy" double precision,
    "source" character varying(50) default 'manual'::character varying
      );


alter table "public"."vendor_locations" enable row level security;


  create table "public"."vendor_schedules" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "vendor_id" uuid not null,
    "day_of_week" public.day_of_week not null,
    "opening_time" time without time zone not null,
    "closing_time" time without time zone not null,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."vendor_schedules" enable row level security;


  create table "public"."vendor_sessions" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "vendor_id" uuid not null,
    "started_at" timestamp with time zone default now(),
    "ended_at" timestamp with time zone,
    "location" public.geography(Point,4326) not null,
    "address" text,
    "last_ping_at" timestamp with time zone default now(),
    "is_active" boolean default true,
    "notes" text
      );


alter table "public"."vendor_sessions" enable row level security;


  create table "public"."vendors" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "owner_id" uuid not null,
    "name" character varying(255) not null,
    "description" text,
    "category_id" uuid,
    "phone_number" character varying(50),
    "email" character varying(255),
    "website_url" text,
    "current_location" public.geography(Point,4326),
    "current_address" text,
    "timezone" character varying(50) default 'Europe/Brussels'::character varying,
    "status" public.listing_status default 'active'::public.listing_status,
    "is_open_now" boolean default false,
    "is_grandfathered" boolean default false,
    "instagram_handle" character varying(100),
    "facebook_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone
      );


alter table "public"."vendors" enable row level security;

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE INDEX idx_categories_active ON public.categories USING btree (is_active) WHERE (is_active = true);

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);

CREATE INDEX idx_categories_type ON public.categories USING btree (type);

CREATE INDEX idx_events_active ON public.events USING btree (is_active_now) WHERE (is_active_now = true);

CREATE INDEX idx_events_category ON public.events USING btree (category_id);

CREATE INDEX idx_events_deleted_at ON public.events USING btree (deleted_at) WHERE (deleted_at IS NULL);

CREATE INDEX idx_events_location ON public.events USING gist (location);

CREATE INDEX idx_events_name_trgm ON public.events USING gin (name public.gin_trgm_ops);

CREATE INDEX idx_events_organizer ON public.events USING btree (organizer_id);

CREATE INDEX idx_events_status ON public.events USING btree (status);

CREATE INDEX idx_events_time_range ON public.events USING btree (start_time, end_time);

CREATE INDEX idx_menu_items_available ON public.menu_items USING btree (is_available) WHERE (is_available = true);

CREATE INDEX idx_menu_items_deleted_at ON public.menu_items USING btree (deleted_at) WHERE (deleted_at IS NULL);

CREATE INDEX idx_menu_items_display_order ON public.menu_items USING btree (vendor_id, display_order);

CREATE INDEX idx_menu_items_vendor ON public.menu_items USING btree (vendor_id);

CREATE INDEX idx_subscription_history_changed_at ON public.subscription_history USING btree (changed_at DESC);

CREATE INDEX idx_subscription_history_reason ON public.subscription_history USING btree (change_reason);

CREATE INDEX idx_subscription_history_user ON public.subscription_history USING btree (user_id);

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at) WHERE (deleted_at IS NULL);

CREATE INDEX idx_users_early_adopter ON public.users USING btree (is_early_adopter) WHERE (is_early_adopter = true);

CREATE INDEX idx_users_roles ON public.users USING gin (roles);

CREATE INDEX idx_users_stripe_customer ON public.users USING btree (stripe_customer_id) WHERE (stripe_customer_id IS NOT NULL);

CREATE INDEX idx_users_subscription_status ON public.users USING btree (subscription_status);

CREATE INDEX idx_users_subscription_tier ON public.users USING btree (subscription_tier);

CREATE INDEX idx_vendor_locations_location ON public.vendor_locations USING gist (location);

CREATE INDEX idx_vendor_locations_recorded_at ON public.vendor_locations USING btree (recorded_at DESC);

CREATE INDEX idx_vendor_locations_session ON public.vendor_locations USING btree (session_id);

CREATE INDEX idx_vendor_locations_vendor ON public.vendor_locations USING btree (vendor_id);

CREATE INDEX idx_vendor_schedules_day ON public.vendor_schedules USING btree (day_of_week);

CREATE INDEX idx_vendor_schedules_vendor ON public.vendor_schedules USING btree (vendor_id);

CREATE INDEX idx_vendor_sessions_active ON public.vendor_sessions USING btree (is_active) WHERE (is_active = true);

CREATE INDEX idx_vendor_sessions_last_ping ON public.vendor_sessions USING btree (last_ping_at);

CREATE INDEX idx_vendor_sessions_location ON public.vendor_sessions USING gist (location);

CREATE INDEX idx_vendor_sessions_time_range ON public.vendor_sessions USING btree (started_at, ended_at);

CREATE INDEX idx_vendor_sessions_vendor ON public.vendor_sessions USING btree (vendor_id);

CREATE INDEX idx_vendors_category ON public.vendors USING btree (category_id);

CREATE INDEX idx_vendors_deleted_at ON public.vendors USING btree (deleted_at) WHERE (deleted_at IS NULL);

CREATE INDEX idx_vendors_grandfathered ON public.vendors USING btree (is_grandfathered);

CREATE INDEX idx_vendors_is_open ON public.vendors USING btree (is_open_now) WHERE (is_open_now = true);

CREATE INDEX idx_vendors_location ON public.vendors USING gist (current_location);

CREATE INDEX idx_vendors_name_trgm ON public.vendors USING gin (name public.gin_trgm_ops);

CREATE INDEX idx_vendors_owner ON public.vendors USING btree (owner_id);

CREATE INDEX idx_vendors_status ON public.vendors USING btree (status);

CREATE UNIQUE INDEX menu_items_pkey ON public.menu_items USING btree (id);

CREATE UNIQUE INDEX plan_limits_pkey ON public.plan_limits USING btree (id);

CREATE UNIQUE INDEX plan_limits_tier_key ON public.plan_limits USING btree (tier);

CREATE UNIQUE INDEX pricing_migrations_migration_name_key ON public.pricing_migrations USING btree (migration_name);

CREATE UNIQUE INDEX pricing_migrations_pkey ON public.pricing_migrations USING btree (id);

CREATE UNIQUE INDEX stripe_prices_pkey ON public.stripe_prices USING btree (id);

CREATE UNIQUE INDEX stripe_prices_stripe_price_id_key ON public.stripe_prices USING btree (stripe_price_id);

CREATE UNIQUE INDEX subscription_history_pkey ON public.subscription_history USING btree (id);

CREATE UNIQUE INDEX unique_vendor_day ON public.vendor_schedules USING btree (vendor_id, day_of_week);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_stripe_customer_id_key ON public.users USING btree (stripe_customer_id);

CREATE UNIQUE INDEX vendor_locations_pkey ON public.vendor_locations USING btree (id);

CREATE UNIQUE INDEX vendor_schedules_pkey ON public.vendor_schedules USING btree (id);

CREATE UNIQUE INDEX vendor_sessions_pkey ON public.vendor_sessions USING btree (id);

CREATE UNIQUE INDEX vendors_pkey ON public.vendors USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."menu_items" add constraint "menu_items_pkey" PRIMARY KEY using index "menu_items_pkey";

alter table "public"."plan_limits" add constraint "plan_limits_pkey" PRIMARY KEY using index "plan_limits_pkey";

alter table "public"."pricing_migrations" add constraint "pricing_migrations_pkey" PRIMARY KEY using index "pricing_migrations_pkey";

alter table "public"."stripe_prices" add constraint "stripe_prices_pkey" PRIMARY KEY using index "stripe_prices_pkey";

alter table "public"."subscription_history" add constraint "subscription_history_pkey" PRIMARY KEY using index "subscription_history_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."vendor_locations" add constraint "vendor_locations_pkey" PRIMARY KEY using index "vendor_locations_pkey";

alter table "public"."vendor_schedules" add constraint "vendor_schedules_pkey" PRIMARY KEY using index "vendor_schedules_pkey";

alter table "public"."vendor_sessions" add constraint "vendor_sessions_pkey" PRIMARY KEY using index "vendor_sessions_pkey";

alter table "public"."vendors" add constraint "vendors_pkey" PRIMARY KEY using index "vendors_pkey";

alter table "public"."categories" add constraint "categories_name_key" UNIQUE using index "categories_name_key";

alter table "public"."categories" add constraint "categories_slug_key" UNIQUE using index "categories_slug_key";

alter table "public"."categories" add constraint "categories_type_check" CHECK (((type)::text = ANY ((ARRAY['vendor'::character varying, 'event'::character varying])::text[]))) not valid;

alter table "public"."categories" validate constraint "categories_type_check";

alter table "public"."events" add constraint "events_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL not valid;

alter table "public"."events" validate constraint "events_category_id_fkey";

alter table "public"."events" add constraint "events_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) not valid;

alter table "public"."events" validate constraint "events_created_by_fkey";

alter table "public"."events" add constraint "events_organizer_id_fkey" FOREIGN KEY (organizer_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_organizer_id_fkey";

alter table "public"."events" add constraint "events_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."events" validate constraint "events_updated_by_fkey";

alter table "public"."menu_items" add constraint "menu_items_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE not valid;

alter table "public"."menu_items" validate constraint "menu_items_vendor_id_fkey";

alter table "public"."plan_limits" add constraint "plan_limits_tier_key" UNIQUE using index "plan_limits_tier_key";

alter table "public"."pricing_migrations" add constraint "pricing_migrations_migration_name_key" UNIQUE using index "pricing_migrations_migration_name_key";

alter table "public"."stripe_prices" add constraint "stripe_prices_billing_interval_check" CHECK (((billing_interval)::text = ANY ((ARRAY['month'::character varying, 'year'::character varying])::text[]))) not valid;

alter table "public"."stripe_prices" validate constraint "stripe_prices_billing_interval_check";

alter table "public"."stripe_prices" add constraint "stripe_prices_stripe_price_id_key" UNIQUE using index "stripe_prices_stripe_price_id_key";

alter table "public"."subscription_history" add constraint "subscription_history_changed_by_fkey" FOREIGN KEY (changed_by) REFERENCES public.users(id) not valid;

alter table "public"."subscription_history" validate constraint "subscription_history_changed_by_fkey";

alter table "public"."subscription_history" add constraint "subscription_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."subscription_history" validate constraint "subscription_history_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_stripe_customer_id_key" UNIQUE using index "users_stripe_customer_id_key";

alter table "public"."vendor_locations" add constraint "vendor_locations_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.vendor_sessions(id) ON DELETE SET NULL not valid;

alter table "public"."vendor_locations" validate constraint "vendor_locations_session_id_fkey";

alter table "public"."vendor_locations" add constraint "vendor_locations_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE not valid;

alter table "public"."vendor_locations" validate constraint "vendor_locations_vendor_id_fkey";

alter table "public"."vendor_schedules" add constraint "unique_vendor_day" UNIQUE using index "unique_vendor_day";

alter table "public"."vendor_schedules" add constraint "vendor_schedules_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE not valid;

alter table "public"."vendor_schedules" validate constraint "vendor_schedules_vendor_id_fkey";

alter table "public"."vendor_sessions" add constraint "vendor_sessions_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE not valid;

alter table "public"."vendor_sessions" validate constraint "vendor_sessions_vendor_id_fkey";

alter table "public"."vendors" add constraint "vendors_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL not valid;

alter table "public"."vendors" validate constraint "vendors_category_id_fkey";

alter table "public"."vendors" add constraint "vendors_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) not valid;

alter table "public"."vendors" validate constraint "vendors_created_by_fkey";

alter table "public"."vendors" add constraint "vendors_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."vendors" validate constraint "vendors_owner_id_fkey";

alter table "public"."vendors" add constraint "vendors_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."vendors" validate constraint "vendors_updated_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_role(p_user_id uuid, p_role text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE users
  SET roles = array_append(roles, p_role)
  WHERE id = p_user_id
    AND NOT (p_role = ANY(roles)) -- Prevent duplicates
    AND deleted_at IS NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.become_creator()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- We use auth.uid() to securely get the ID of the user calling this function
  PERFORM add_user_role(auth.uid(), 'creator');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.can_user_access_feature(p_user_id uuid, p_feature_name character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  user_tier subscription_tier;
  has_access BOOLEAN;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM users WHERE id = p_user_id;
  
  SELECT 
    CASE p_feature_name
      WHEN 'weekly_schedule' THEN pl.can_use_weekly_schedule
      WHEN 'analytics' THEN pl.can_use_analytics
      WHEN 'remove_branding' THEN pl.can_remove_branding
      WHEN 'verified_badge' THEN pl.can_use_verified_badge
      WHEN 'direct_messaging' THEN pl.can_use_direct_messaging
      WHEN 'respond_to_reviews' THEN pl.can_respond_to_reviews
      WHEN 'announcements' THEN pl.can_use_announcements
      WHEN 'team_accounts' THEN pl.can_use_team_accounts
      WHEN 'featured_placement' THEN pl.can_use_featured_placement
      WHEN 'advanced_analytics' THEN pl.can_use_advanced_analytics
      WHEN 'marketing_tools' THEN pl.can_use_marketing_tools
      WHEN 'api_access' THEN pl.can_use_api_access
      ELSE false
    END INTO has_access
  FROM plan_limits pl
  WHERE pl.tier = user_tier;
  
  RETURN COALESCE(has_access, false);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_menu_item_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  user_tier subscription_tier;
  menu_item_count INTEGER;
  max_allowed INTEGER;
  vendor_owner_id UUID;
BEGIN
  SELECT owner_id INTO vendor_owner_id
  FROM vendors
  WHERE id = NEW.vendor_id;
  
  SELECT subscription_tier INTO user_tier
  FROM users WHERE id = vendor_owner_id;
  
  SELECT COUNT(*) INTO menu_item_count
  FROM menu_items 
  WHERE vendor_id = NEW.vendor_id
    AND deleted_at IS NULL
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  SELECT max_menu_items INTO max_allowed
  FROM plan_limits
  WHERE tier = user_tier;
  
  IF max_allowed IS NULL THEN
    RETURN NEW;
  END IF;
  
  IF menu_item_count >= max_allowed THEN
    RAISE EXCEPTION 'Menu item limit reached for % tier. This vendor has % items but limit is %. Please upgrade your plan.', 
      user_tier, menu_item_count, max_allowed;
  END IF;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_vendor_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  user_tier subscription_tier;
  vendor_count INTEGER;
  max_allowed INTEGER;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM users WHERE id = NEW.owner_id;
  
  SELECT COUNT(*) INTO vendor_count
  FROM vendors 
  WHERE owner_id = NEW.owner_id 
    AND deleted_at IS NULL
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  SELECT max_vendors INTO max_allowed
  FROM plan_limits
  WHERE tier = user_tier;
  
  IF max_allowed IS NULL THEN
    RETURN NEW;
  END IF;
  
  IF vendor_count >= max_allowed THEN
    RAISE EXCEPTION 'Vendor limit reached for % tier. You have % vendors but limit is %. Please upgrade your plan.', 
      user_tier, vendor_count, max_allowed;
  END IF;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.find_events_near_me(lat double precision, lng double precision, radius_meters integer DEFAULT 5000)
 RETURNS TABLE(event_id uuid, event_name character varying, category_name character varying, distance_meters double precision, start_time timestamp with time zone, end_time timestamp with time zone, is_active_now boolean)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    c.name as category_name,
    ST_Distance(
      e.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters,
    e.start_time,
    e.end_time,
    e.is_active_now
  FROM events e
  LEFT JOIN categories c ON c.id = e.category_id
  WHERE 
    e.status = 'active'
    AND e.deleted_at IS NULL
    AND e.location IS NOT NULL
    AND ST_DWithin(
      e.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY distance_meters ASC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.find_vendors_near_me(lat double precision, lng double precision, radius_meters integer DEFAULT 5000)
 RETURNS TABLE(vendor_id uuid, vendor_name character varying, category_name character varying, distance_meters double precision, current_location public.geography, is_open_now boolean)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    c.name as category_name,
    ST_Distance(
      v.current_location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters,
    v.current_location,
    v.is_open_now
  FROM vendors v
  LEFT JOIN categories c ON c.id = v.category_id
  WHERE 
    v.status = 'active'
    AND v.deleted_at IS NULL
    AND v.current_location IS NOT NULL
    AND ST_DWithin(
      v.current_location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY distance_meters ASC;
END;
$function$
;

create type "public"."geometry_dump" as ("path" integer[], "geom" public.geometry);

CREATE OR REPLACE FUNCTION public.get_stripe_price_id_for_user(p_user_id uuid, p_tier public.subscription_tier, p_billing_interval character varying DEFAULT 'month'::character varying)
 RETURNS character varying
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_is_early_adopter BOOLEAN;
  v_price_id VARCHAR(255);
BEGIN
  SELECT is_early_adopter INTO v_is_early_adopter
  FROM users
  WHERE id = p_user_id;
  
  SELECT stripe_price_id INTO v_price_id
  FROM stripe_prices
  WHERE tier = p_tier
    AND billing_interval = p_billing_interval
    AND is_early_adopter = COALESCE(v_is_early_adopter, false)
    AND is_active = true
  LIMIT 1;
  
  RETURN v_price_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_price(p_user_id uuid, p_tier public.subscription_tier, p_billing_interval character varying DEFAULT 'month'::character varying)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_base_price DECIMAL(10,2);
  v_is_early_adopter BOOLEAN;
BEGIN
  IF p_tier = 'free' THEN
    RETURN 0.00;
  END IF;
  
  SELECT is_early_adopter 
  INTO v_is_early_adopter
  FROM users
  WHERE id = p_user_id;
  
  SELECT amount INTO v_base_price
  FROM stripe_prices
  WHERE tier = p_tier
    AND billing_interval = p_billing_interval
    AND is_early_adopter = COALESCE(v_is_early_adopter, false)
    AND is_active = true
  LIMIT 1;
  
  RETURN v_base_price;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_roles(p_user_id uuid)
 RETURNS text[]
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT roles
  FROM users
  WHERE id = p_user_id
    AND deleted_at IS NULL;
$function$
;

CREATE OR REPLACE FUNCTION public.get_vendor_active_session(p_vendor_id uuid)
 RETURNS public.vendor_sessions
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT *
  FROM vendor_sessions
  WHERE vendor_id = p_vendor_id
    AND is_active = true
    AND ended_at IS NULL
  ORDER BY started_at DESC
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.grant_organizer_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Add 'organizer' role if user doesn't have it yet
  PERFORM add_user_role(NEW.organizer_id, 'organizer');
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.grant_vendor_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Add 'vendor' role if user doesn't have it yet
  PERFORM add_user_role(NEW.owner_id, 'vendor');
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert a new row into public.users
  -- The 'id' comes from the new auth.users record (NEW.id)
  -- We also try to grab full_name and avatar_url
  -- from the auth metadata, if it exists.
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Don't forget to return the NEW record
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_subscription_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF (OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier) OR 
     (OLD.subscription_status IS DISTINCT FROM NEW.subscription_status) THEN
    
    INSERT INTO subscription_history (
      user_id,
      from_tier,
      to_tier,
      from_status,
      to_status,
      change_reason,
      notes
    ) VALUES (
      NEW.id,
      OLD.subscription_tier,
      NEW.subscription_tier,
      OLD.subscription_status,
      NEW.subscription_status,
      'automatic',
      NULL
    );
  END IF;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.make_user_admin(p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', p_email;
  END IF;

  -- Add admin role to users table
  PERFORM add_user_role(v_user_id, 'admin');
  
  -- Also update auth.users metadata for additional security
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  WHERE id = v_user_id;
  
  RAISE NOTICE 'User % is now an admin', p_email;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_protected_field_updates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only check if this is an UPDATE (not INSERT)
  IF TG_OP = 'UPDATE' THEN
    -- Prevent modification of protected subscription/billing fields
    IF OLD.roles IS DISTINCT FROM NEW.roles THEN
      RAISE EXCEPTION 'Cannot modify roles field';
    END IF;
    
    IF OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier THEN
      RAISE EXCEPTION 'Cannot modify subscription_tier field';
    END IF;
    
    IF OLD.subscription_status IS DISTINCT FROM NEW.subscription_status THEN
      RAISE EXCEPTION 'Cannot modify subscription_status field';
    END IF;
    
    IF OLD.is_early_adopter IS DISTINCT FROM NEW.is_early_adopter THEN
      RAISE EXCEPTION 'Cannot modify is_early_adopter field';
    END IF;
    
    IF OLD.early_adopter_discount_percent IS DISTINCT FROM NEW.early_adopter_discount_percent THEN
      RAISE EXCEPTION 'Cannot modify early_adopter_discount_percent field';
    END IF;
    
    IF OLD.founder_tier IS DISTINCT FROM NEW.founder_tier THEN
      RAISE EXCEPTION 'Cannot modify founder_tier field';
    END IF;
    
    IF OLD.founder_date IS DISTINCT FROM NEW.founder_date THEN
      RAISE EXCEPTION 'Cannot modify founder_date field';
    END IF;
    
    IF OLD.billing_activated_at IS DISTINCT FROM NEW.billing_activated_at THEN
      RAISE EXCEPTION 'Cannot modify billing_activated_at field';
    END IF;
    
    IF OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id THEN
      RAISE EXCEPTION 'Cannot modify stripe_customer_id field';
    END IF;
    
    IF OLD.stripe_subscription_id IS DISTINCT FROM NEW.stripe_subscription_id THEN
      RAISE EXCEPTION 'Cannot modify stripe_subscription_id field';
    END IF;
    
    IF OLD.stripe_price_id IS DISTINCT FROM NEW.stripe_price_id THEN
      RAISE EXCEPTION 'Cannot modify stripe_price_id field';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.remove_user_role(p_user_id uuid, p_role text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE users
  SET roles = array_remove(roles, p_role)
  WHERE id = p_user_id
    AND deleted_at IS NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_event_active_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.is_active_now = (NOW() BETWEEN NEW.start_time AND NEW.end_time);
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_vendor_current_location()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE vendors
    SET 
      current_location = NEW.location,
      current_address = NEW.address,
      is_open_now = true
    WHERE id = NEW.vendor_id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.user_has_role(p_user_id uuid, p_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM users
    WHERE id = p_user_id
      AND p_role = ANY(roles)
      AND deleted_at IS NULL
  );
END;
$function$
;

create type "public"."valid_detail" as ("valid" boolean, "reason" character varying, "location" public.geometry);

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."menu_items" to "anon";

grant insert on table "public"."menu_items" to "anon";

grant references on table "public"."menu_items" to "anon";

grant select on table "public"."menu_items" to "anon";

grant trigger on table "public"."menu_items" to "anon";

grant truncate on table "public"."menu_items" to "anon";

grant update on table "public"."menu_items" to "anon";

grant delete on table "public"."menu_items" to "authenticated";

grant insert on table "public"."menu_items" to "authenticated";

grant references on table "public"."menu_items" to "authenticated";

grant select on table "public"."menu_items" to "authenticated";

grant trigger on table "public"."menu_items" to "authenticated";

grant truncate on table "public"."menu_items" to "authenticated";

grant update on table "public"."menu_items" to "authenticated";

grant delete on table "public"."menu_items" to "service_role";

grant insert on table "public"."menu_items" to "service_role";

grant references on table "public"."menu_items" to "service_role";

grant select on table "public"."menu_items" to "service_role";

grant trigger on table "public"."menu_items" to "service_role";

grant truncate on table "public"."menu_items" to "service_role";

grant update on table "public"."menu_items" to "service_role";

grant delete on table "public"."plan_limits" to "anon";

grant insert on table "public"."plan_limits" to "anon";

grant references on table "public"."plan_limits" to "anon";

grant select on table "public"."plan_limits" to "anon";

grant trigger on table "public"."plan_limits" to "anon";

grant truncate on table "public"."plan_limits" to "anon";

grant update on table "public"."plan_limits" to "anon";

grant delete on table "public"."plan_limits" to "authenticated";

grant insert on table "public"."plan_limits" to "authenticated";

grant references on table "public"."plan_limits" to "authenticated";

grant select on table "public"."plan_limits" to "authenticated";

grant trigger on table "public"."plan_limits" to "authenticated";

grant truncate on table "public"."plan_limits" to "authenticated";

grant update on table "public"."plan_limits" to "authenticated";

grant delete on table "public"."plan_limits" to "service_role";

grant insert on table "public"."plan_limits" to "service_role";

grant references on table "public"."plan_limits" to "service_role";

grant select on table "public"."plan_limits" to "service_role";

grant trigger on table "public"."plan_limits" to "service_role";

grant truncate on table "public"."plan_limits" to "service_role";

grant update on table "public"."plan_limits" to "service_role";

grant delete on table "public"."pricing_migrations" to "anon";

grant insert on table "public"."pricing_migrations" to "anon";

grant references on table "public"."pricing_migrations" to "anon";

grant select on table "public"."pricing_migrations" to "anon";

grant trigger on table "public"."pricing_migrations" to "anon";

grant truncate on table "public"."pricing_migrations" to "anon";

grant update on table "public"."pricing_migrations" to "anon";

grant delete on table "public"."pricing_migrations" to "authenticated";

grant insert on table "public"."pricing_migrations" to "authenticated";

grant references on table "public"."pricing_migrations" to "authenticated";

grant select on table "public"."pricing_migrations" to "authenticated";

grant trigger on table "public"."pricing_migrations" to "authenticated";

grant truncate on table "public"."pricing_migrations" to "authenticated";

grant update on table "public"."pricing_migrations" to "authenticated";

grant delete on table "public"."pricing_migrations" to "service_role";

grant insert on table "public"."pricing_migrations" to "service_role";

grant references on table "public"."pricing_migrations" to "service_role";

grant select on table "public"."pricing_migrations" to "service_role";

grant trigger on table "public"."pricing_migrations" to "service_role";

grant truncate on table "public"."pricing_migrations" to "service_role";

grant update on table "public"."pricing_migrations" to "service_role";

grant delete on table "public"."spatial_ref_sys" to "anon";

grant insert on table "public"."spatial_ref_sys" to "anon";

grant references on table "public"."spatial_ref_sys" to "anon";

grant select on table "public"."spatial_ref_sys" to "anon";

grant trigger on table "public"."spatial_ref_sys" to "anon";

grant truncate on table "public"."spatial_ref_sys" to "anon";

grant update on table "public"."spatial_ref_sys" to "anon";

grant delete on table "public"."spatial_ref_sys" to "authenticated";

grant insert on table "public"."spatial_ref_sys" to "authenticated";

grant references on table "public"."spatial_ref_sys" to "authenticated";

grant select on table "public"."spatial_ref_sys" to "authenticated";

grant trigger on table "public"."spatial_ref_sys" to "authenticated";

grant truncate on table "public"."spatial_ref_sys" to "authenticated";

grant update on table "public"."spatial_ref_sys" to "authenticated";

grant delete on table "public"."spatial_ref_sys" to "postgres";

grant insert on table "public"."spatial_ref_sys" to "postgres";

grant references on table "public"."spatial_ref_sys" to "postgres";

grant select on table "public"."spatial_ref_sys" to "postgres";

grant trigger on table "public"."spatial_ref_sys" to "postgres";

grant truncate on table "public"."spatial_ref_sys" to "postgres";

grant update on table "public"."spatial_ref_sys" to "postgres";

grant delete on table "public"."spatial_ref_sys" to "service_role";

grant insert on table "public"."spatial_ref_sys" to "service_role";

grant references on table "public"."spatial_ref_sys" to "service_role";

grant select on table "public"."spatial_ref_sys" to "service_role";

grant trigger on table "public"."spatial_ref_sys" to "service_role";

grant truncate on table "public"."spatial_ref_sys" to "service_role";

grant update on table "public"."spatial_ref_sys" to "service_role";

grant delete on table "public"."stripe_prices" to "anon";

grant insert on table "public"."stripe_prices" to "anon";

grant references on table "public"."stripe_prices" to "anon";

grant select on table "public"."stripe_prices" to "anon";

grant trigger on table "public"."stripe_prices" to "anon";

grant truncate on table "public"."stripe_prices" to "anon";

grant update on table "public"."stripe_prices" to "anon";

grant delete on table "public"."stripe_prices" to "authenticated";

grant insert on table "public"."stripe_prices" to "authenticated";

grant references on table "public"."stripe_prices" to "authenticated";

grant select on table "public"."stripe_prices" to "authenticated";

grant trigger on table "public"."stripe_prices" to "authenticated";

grant truncate on table "public"."stripe_prices" to "authenticated";

grant update on table "public"."stripe_prices" to "authenticated";

grant delete on table "public"."stripe_prices" to "service_role";

grant insert on table "public"."stripe_prices" to "service_role";

grant references on table "public"."stripe_prices" to "service_role";

grant select on table "public"."stripe_prices" to "service_role";

grant trigger on table "public"."stripe_prices" to "service_role";

grant truncate on table "public"."stripe_prices" to "service_role";

grant update on table "public"."stripe_prices" to "service_role";

grant delete on table "public"."subscription_history" to "anon";

grant insert on table "public"."subscription_history" to "anon";

grant references on table "public"."subscription_history" to "anon";

grant select on table "public"."subscription_history" to "anon";

grant trigger on table "public"."subscription_history" to "anon";

grant truncate on table "public"."subscription_history" to "anon";

grant update on table "public"."subscription_history" to "anon";

grant delete on table "public"."subscription_history" to "authenticated";

grant insert on table "public"."subscription_history" to "authenticated";

grant references on table "public"."subscription_history" to "authenticated";

grant select on table "public"."subscription_history" to "authenticated";

grant trigger on table "public"."subscription_history" to "authenticated";

grant truncate on table "public"."subscription_history" to "authenticated";

grant update on table "public"."subscription_history" to "authenticated";

grant delete on table "public"."subscription_history" to "service_role";

grant insert on table "public"."subscription_history" to "service_role";

grant references on table "public"."subscription_history" to "service_role";

grant select on table "public"."subscription_history" to "service_role";

grant trigger on table "public"."subscription_history" to "service_role";

grant truncate on table "public"."subscription_history" to "service_role";

grant update on table "public"."subscription_history" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."vendor_locations" to "anon";

grant insert on table "public"."vendor_locations" to "anon";

grant references on table "public"."vendor_locations" to "anon";

grant select on table "public"."vendor_locations" to "anon";

grant trigger on table "public"."vendor_locations" to "anon";

grant truncate on table "public"."vendor_locations" to "anon";

grant update on table "public"."vendor_locations" to "anon";

grant delete on table "public"."vendor_locations" to "authenticated";

grant insert on table "public"."vendor_locations" to "authenticated";

grant references on table "public"."vendor_locations" to "authenticated";

grant select on table "public"."vendor_locations" to "authenticated";

grant trigger on table "public"."vendor_locations" to "authenticated";

grant truncate on table "public"."vendor_locations" to "authenticated";

grant update on table "public"."vendor_locations" to "authenticated";

grant delete on table "public"."vendor_locations" to "service_role";

grant insert on table "public"."vendor_locations" to "service_role";

grant references on table "public"."vendor_locations" to "service_role";

grant select on table "public"."vendor_locations" to "service_role";

grant trigger on table "public"."vendor_locations" to "service_role";

grant truncate on table "public"."vendor_locations" to "service_role";

grant update on table "public"."vendor_locations" to "service_role";

grant delete on table "public"."vendor_schedules" to "anon";

grant insert on table "public"."vendor_schedules" to "anon";

grant references on table "public"."vendor_schedules" to "anon";

grant select on table "public"."vendor_schedules" to "anon";

grant trigger on table "public"."vendor_schedules" to "anon";

grant truncate on table "public"."vendor_schedules" to "anon";

grant update on table "public"."vendor_schedules" to "anon";

grant delete on table "public"."vendor_schedules" to "authenticated";

grant insert on table "public"."vendor_schedules" to "authenticated";

grant references on table "public"."vendor_schedules" to "authenticated";

grant select on table "public"."vendor_schedules" to "authenticated";

grant trigger on table "public"."vendor_schedules" to "authenticated";

grant truncate on table "public"."vendor_schedules" to "authenticated";

grant update on table "public"."vendor_schedules" to "authenticated";

grant delete on table "public"."vendor_schedules" to "service_role";

grant insert on table "public"."vendor_schedules" to "service_role";

grant references on table "public"."vendor_schedules" to "service_role";

grant select on table "public"."vendor_schedules" to "service_role";

grant trigger on table "public"."vendor_schedules" to "service_role";

grant truncate on table "public"."vendor_schedules" to "service_role";

grant update on table "public"."vendor_schedules" to "service_role";

grant delete on table "public"."vendor_sessions" to "anon";

grant insert on table "public"."vendor_sessions" to "anon";

grant references on table "public"."vendor_sessions" to "anon";

grant select on table "public"."vendor_sessions" to "anon";

grant trigger on table "public"."vendor_sessions" to "anon";

grant truncate on table "public"."vendor_sessions" to "anon";

grant update on table "public"."vendor_sessions" to "anon";

grant delete on table "public"."vendor_sessions" to "authenticated";

grant insert on table "public"."vendor_sessions" to "authenticated";

grant references on table "public"."vendor_sessions" to "authenticated";

grant select on table "public"."vendor_sessions" to "authenticated";

grant trigger on table "public"."vendor_sessions" to "authenticated";

grant truncate on table "public"."vendor_sessions" to "authenticated";

grant update on table "public"."vendor_sessions" to "authenticated";

grant delete on table "public"."vendor_sessions" to "service_role";

grant insert on table "public"."vendor_sessions" to "service_role";

grant references on table "public"."vendor_sessions" to "service_role";

grant select on table "public"."vendor_sessions" to "service_role";

grant trigger on table "public"."vendor_sessions" to "service_role";

grant truncate on table "public"."vendor_sessions" to "service_role";

grant update on table "public"."vendor_sessions" to "service_role";

grant delete on table "public"."vendors" to "anon";

grant insert on table "public"."vendors" to "anon";

grant references on table "public"."vendors" to "anon";

grant select on table "public"."vendors" to "anon";

grant trigger on table "public"."vendors" to "anon";

grant truncate on table "public"."vendors" to "anon";

grant update on table "public"."vendors" to "anon";

grant delete on table "public"."vendors" to "authenticated";

grant insert on table "public"."vendors" to "authenticated";

grant references on table "public"."vendors" to "authenticated";

grant select on table "public"."vendors" to "authenticated";

grant trigger on table "public"."vendors" to "authenticated";

grant truncate on table "public"."vendors" to "authenticated";

grant update on table "public"."vendors" to "authenticated";

grant delete on table "public"."vendors" to "service_role";

grant insert on table "public"."vendors" to "service_role";

grant references on table "public"."vendors" to "service_role";

grant select on table "public"."vendors" to "service_role";

grant trigger on table "public"."vendors" to "service_role";

grant truncate on table "public"."vendors" to "service_role";

grant update on table "public"."vendors" to "service_role";


  create policy "Anyone can view categories"
  on "public"."categories"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Anyone can view active events"
  on "public"."events"
  as permissive
  for select
  to public
using (((status = 'active'::public.listing_status) AND (deleted_at IS NULL)));



  create policy "Creators and admins can create events"
  on "public"."events"
  as permissive
  for insert
  to public
with check (((auth.uid() = organizer_id) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.deleted_at IS NULL) AND (('creator'::text = ANY (users.roles)) OR ('organizer'::text = ANY (users.roles)) OR ('admin'::text = ANY (users.roles))))))));



  create policy "Organizers can delete own events"
  on "public"."events"
  as permissive
  for update
  to public
using ((auth.uid() = organizer_id));



  create policy "Organizers can update own events"
  on "public"."events"
  as permissive
  for update
  to public
using ((auth.uid() = organizer_id));



  create policy "Anyone can view menu items"
  on "public"."menu_items"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = menu_items.vendor_id) AND (vendors.status = 'active'::public.listing_status) AND (vendors.deleted_at IS NULL)))) AND (deleted_at IS NULL)));



  create policy "Vendor owners can manage menu items"
  on "public"."menu_items"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = menu_items.vendor_id) AND (vendors.owner_id = auth.uid())))));



  create policy "Anyone can view plan limits"
  on "public"."plan_limits"
  as permissive
  for select
  to public
using (true);



  create policy "Only service_role can insert pricing migrations"
  on "public"."pricing_migrations"
  as permissive
  for insert
  to public
with check (false);



  create policy "Only service_role can view pricing migrations"
  on "public"."pricing_migrations"
  as permissive
  for select
  to public
using (false);



  create policy "Anyone can view active stripe prices"
  on "public"."stripe_prices"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Users can view own subscription history"
  on "public"."subscription_history"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own profile"
  on "public"."users"
  as permissive
  for update
  to public
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."users"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Anyone can view location history"
  on "public"."vendor_locations"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = vendor_locations.vendor_id) AND (vendors.status = 'active'::public.listing_status) AND (vendors.deleted_at IS NULL)))));



  create policy "Vendor owners can manage locations"
  on "public"."vendor_locations"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = vendor_locations.vendor_id) AND (vendors.owner_id = auth.uid())))));



  create policy "Anyone can view vendor schedules"
  on "public"."vendor_schedules"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = vendor_schedules.vendor_id) AND (vendors.status = 'active'::public.listing_status) AND (vendors.deleted_at IS NULL)))));



  create policy "Vendor owners can manage schedules"
  on "public"."vendor_schedules"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = vendor_schedules.vendor_id) AND (vendors.owner_id = auth.uid())))));



  create policy "Anyone can view active sessions"
  on "public"."vendor_sessions"
  as permissive
  for select
  to public
using (((is_active = true) AND (EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = vendor_sessions.vendor_id) AND (vendors.status = 'active'::public.listing_status) AND (vendors.deleted_at IS NULL))))));



  create policy "Vendor owners can manage sessions"
  on "public"."vendor_sessions"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.vendors
  WHERE ((vendors.id = vendor_sessions.vendor_id) AND (vendors.owner_id = auth.uid())))));



  create policy "Anyone can view active vendors"
  on "public"."vendors"
  as permissive
  for select
  to public
using (((status = 'active'::public.listing_status) AND (deleted_at IS NULL)));



  create policy "Creators and admins can create vendors"
  on "public"."vendors"
  as permissive
  for insert
  to public
with check (((auth.uid() = owner_id) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.deleted_at IS NULL) AND (('creator'::text = ANY (users.roles)) OR ('vendor'::text = ANY (users.roles)) OR ('admin'::text = ANY (users.roles))))))));



  create policy "Owners can delete own vendors"
  on "public"."vendors"
  as permissive
  for update
  to public
using ((auth.uid() = owner_id));



  create policy "Owners can update own vendors"
  on "public"."vendors"
  as permissive
  for update
  to public
using ((auth.uid() = owner_id));


CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER auto_grant_organizer_role AFTER INSERT ON public.events FOR EACH ROW EXECUTE FUNCTION public.grant_organizer_role();

CREATE TRIGGER set_event_active_status BEFORE INSERT OR UPDATE OF start_time, end_time ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_event_active_status();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER enforce_menu_item_limit BEFORE INSERT ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.check_menu_item_limit();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_limits_updated_at BEFORE UPDATE ON public.plan_limits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_prices_updated_at BEFORE UPDATE ON public.stripe_prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER log_user_subscription_change AFTER UPDATE OF subscription_tier, subscription_status ON public.users FOR EACH ROW EXECUTE FUNCTION public.log_subscription_change();

CREATE TRIGGER prevent_protected_field_updates_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.prevent_protected_field_updates();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_schedules_updated_at BEFORE UPDATE ON public.vendor_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_location_from_session AFTER INSERT ON public.vendor_sessions FOR EACH ROW EXECUTE FUNCTION public.update_vendor_current_location();

CREATE TRIGGER auto_grant_vendor_role AFTER INSERT ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.grant_vendor_role();

CREATE TRIGGER enforce_vendor_limit BEFORE INSERT ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.check_vendor_limit();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


