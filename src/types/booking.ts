import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";

export interface Booking {
  id: string;
  expertId: string;
  expertName: string;
  specialty: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  type: "online" | "chat";
  price: string;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
}

export const BOOKINGS_STORAGE_KEY = "dobro-bookings";

// ---- localStorage fallback (used if bookings table doesn't exist yet) ----

function getBookingsLocal(): Booking[] {
  try {
    const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveBookingLocal(booking: Booking): void {
  const bookings = getBookingsLocal();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

function updateBookingStatusLocal(bookingId: string, status: Booking["status"]): void {
  const bookings = getBookingsLocal();
  const updated = bookings.map(b =>
    b.id === bookingId ? { ...b, status } : b
  );
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
}

// ---- Supabase + fallback ----

/**
 * Save a booking. Tries Supabase first, falls back to localStorage.
 */
export async function saveBooking(booking: Booking): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = getSessionId();

    const { error } = await supabase.from("bookings" as any).insert({
      id: booking.id,
      user_id: user?.id ?? null,
      session_id: user ? null : sessionId,
      expert_id: booking.expertId,
      expert_name: booking.expertName,
      specialty: booking.specialty,
      service_id: booking.serviceId,
      service_name: booking.serviceName,
      slot_date: booking.date,
      slot_time: booking.time,
      consultation_type: booking.type,
      price: booking.price,
      status: booking.status,
      tenant_id: "default",
    });

    if (error) {
      console.warn("Supabase bookings insert failed, using localStorage:", error.message);
      saveBookingLocal(booking);
    }
  } catch {
    saveBookingLocal(booking);
  }
}

/**
 * Get all bookings. Tries Supabase first, falls back to localStorage.
 */
export async function getBookings(): Promise<Booking[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = getSessionId();

    // Build query — RLS handles filtering, but we need session_id header
    const { data, error } = await supabase
      .from("bookings" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase bookings query failed, using localStorage:", error.message);
      return getBookingsLocal();
    }

    if (!data || data.length === 0) {
      // Table might exist but be empty, or RLS might block — check localStorage too
      const local = getBookingsLocal();
      if (local.length > 0) return local;
      return [];
    }

    // Map Supabase rows to Booking interface
    return (data as any[]).map((row: any) => ({
      id: row.id,
      expertId: row.expert_id,
      expertName: row.expert_name,
      specialty: row.specialty || "",
      serviceId: row.service_id,
      serviceName: row.service_name || "",
      date: row.slot_date,
      time: row.slot_time,
      type: row.consultation_type as "online" | "chat",
      price: row.price || "",
      status: row.status as "upcoming" | "completed" | "cancelled",
      createdAt: row.created_at,
    }));
  } catch {
    return getBookingsLocal();
  }
}

/**
 * Update booking status. Tries Supabase first, falls back to localStorage.
 */
export async function updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<void> {
  try {
    const { error } = await supabase
      .from("bookings" as any)
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq("id", bookingId);

    if (error) {
      console.warn("Supabase bookings update failed, using localStorage:", error.message);
      updateBookingStatusLocal(bookingId, status);
    }
  } catch {
    updateBookingStatusLocal(bookingId, status);
  }
}

// Sync: keep old sync API for compatibility during migration
export function getBookingsSync(): Booking[] {
  return getBookingsLocal();
}
