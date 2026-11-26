export type UserRole = "CLIENT" | "ADMIN";

export type HotelCategoryType =
  | "ALL_INCLUSIVE"
  | "BOUTIQUE"
  | "BUDGET"
  | "BEACHFRONT"
  | "PET_FRIENDLY";

export type BookingStatusType = "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED";

export type PaymentStatusType = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: string | null;
}

export interface HotelData {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  address: string;
  category: HotelCategoryType;
  pricePerNight: number;
  rating: number;
  imageUrl: string;
  amenities: string;
}

export interface DestinationData {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  basePrice: number;
  imageUrl: string;
  featured: boolean;
  rating: number;
  hotels?: HotelData[];
  _count?: {
    hotels: number;
    bookings: number;
  };
}

export interface BookingData {
  id: string;
  bookingCode: string;
  userId: string;
  destinationId: string;
  hotelId: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  preferences: string | null;
  totalPrice: number;
  status: BookingStatusType;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  destination?: DestinationData;
  hotel?: HotelData | null;
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatusType;
    paymentMethod: string;
  } | null;
}
