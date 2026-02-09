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

export function getBookings(): Booking[] {
  try {
    const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export function updateBookingStatus(bookingId: string, status: Booking["status"]): void {
  const bookings = getBookings();
  const updated = bookings.map(b => 
    b.id === bookingId ? { ...b, status } : b
  );
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
}
