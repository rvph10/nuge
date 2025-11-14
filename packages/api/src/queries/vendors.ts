// Vendor-related queries
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Vendor,
  VendorWithDetails,
  Coordinates,
  NearbyVendorResult,
  CreateVendorInput,
  UpdateVendorInput,
  StartVendorSessionRequest,
} from "@nuge/types";
import { getSupabaseClient } from "../supabase";

// Query keys factory
export const vendorKeys = {
  all: ["vendors"] as const,
  lists: () => [...vendorKeys.all, "list"] as const,
  list: (filters: string) => [...vendorKeys.lists(), { filters }] as const,
  nearby: (lat: number, lng: number, radius: number) =>
    [...vendorKeys.all, "nearby", lat, lng, radius] as const,
  details: () => [...vendorKeys.all, "detail"] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
  sessions: (vendorId: string) =>
    [...vendorKeys.detail(vendorId), "sessions"] as const,
};

// ===================================
// Fetch Nearby Vendors (using database function)
// ===================================
export async function getNearbyVendors(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<NearbyVendorResult[]> {
  const supabase = getSupabaseClient();

  // Use the database function with PostGIS for efficient geospatial queries
  const { data, error } = await supabase.rpc("find_vendors_near_me", {
    lat: latitude,
    lng: longitude,
    radius_meters: radiusMeters,
  });

  if (error) throw error;
  return data || [];
}

// React Query hook for nearby vendors
export function useNearbyVendors(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: vendorKeys.nearby(latitude, longitude, radiusMeters),
    queryFn: () => getNearbyVendors(latitude, longitude, radiusMeters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: (options?.enabled ?? true) && !!latitude && !!longitude,
  });
}

// ===================================
// Fetch Vendor by ID (with relationships)
// ===================================
export async function getVendor(id: string): Promise<VendorWithDetails | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("vendors")
    .select(
      `
      *,
      category:categories(*),
      menu_items(*),
      schedules:vendor_schedules(*),
      owner:users(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  return data as unknown as VendorWithDetails;
}

// React Query hook for vendor detail
export function useVendor(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => getVendor(id),
    enabled: (options?.enabled ?? true) && !!id,
  });
}

// ===================================
// Get All Vendors (with optional filters)
// ===================================
export async function getVendors(filters?: {
  status?: "active" | "inactive" | "pending" | "suspended";
  category_id?: string;
}): Promise<Vendor[]> {
  const supabase = getSupabaseClient();

  let query = supabase.from("vendors").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export function useVendors(filters?: {
  status?: "active" | "inactive" | "pending" | "suspended";
  category_id?: string;
}) {
  return useQuery({
    queryKey: vendorKeys.list(JSON.stringify(filters)),
    queryFn: () => getVendors(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ===================================
// Create Vendor
// ===================================
export async function createVendor(input: CreateVendorInput): Promise<Vendor> {
  const supabase = getSupabaseClient();

  // Get the current user to set as owner
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to create a vendor");
  }

  const { data, error } = await supabase
    .from("vendors")
    .insert({
      ...input,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

// ===================================
// Update Vendor
// ===================================
export async function updateVendor(
  id: string,
  input: UpdateVendorInput
): Promise<Vendor> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("vendors")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVendorInput }) =>
      updateVendor(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });
}

// ===================================
// Delete Vendor (soft delete)
// ===================================
export async function deleteVendor(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("vendors")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });
}

// ===================================
// Vendor Sessions (start/end/get active)
// ===================================
export async function startVendorSession(
  input: StartVendorSessionRequest
): Promise<void> {
  const supabase = getSupabaseClient();

  // Create location point in PostGIS format (GeoJSON)
  const location = {
    type: "Point",
    coordinates: [input.longitude, input.latitude],
  };

  const { error } = await supabase.from("vendor_sessions").insert({
    vendor_id: input.vendor_id,
    location,
    address: input.address,
    notes: input.notes,
    is_active: true,
    started_at: new Date().toISOString(),
    last_ping_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export function useStartVendorSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startVendorSession,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vendorKeys.sessions(variables.vendor_id),
      });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });
}

export async function endVendorSession(sessionId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("vendor_sessions")
    .update({
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) throw error;
}

export function useEndVendorSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endVendorSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });
}

// Get active session for a vendor
export async function getActiveSession(vendorId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc("get_vendor_active_session", {
    p_vendor_id: vendorId,
  });

  if (error) throw error;
  return data;
}

export function useActiveSession(vendorId: string) {
  return useQuery({
    queryKey: vendorKeys.sessions(vendorId),
    queryFn: () => getActiveSession(vendorId),
    enabled: !!vendorId,
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}
