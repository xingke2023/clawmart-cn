export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar_url: string | null;
  website_url: string | null;
  bio: string | null;
  is_seller: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar_url?: string | null;
  website_url?: string | null;
  bio?: string | null;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  name?: string;
  email?: string;
  password: string;
  password_confirmation: string;
}

export interface DemoMessage {
  type: 'ai' | 'user';
  text: string;
}

export interface DemoPersona {
  label: string;
  messages: DemoMessage[];
}

export interface Listing {
  id: number;
  user_id: number | null;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  image_url: string | null;
  status: string;
  category: string;
  demo_messages: DemoMessage[] | null;
  demo_personas: DemoPersona[] | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    avatar_url: string | null;
    bio: string | null;
    website_url: string | null;
  };
}

export interface Purchase {
  id: number;
  user_id: number;
  listing_id: number;
  price_paid: string;
  created_at: string;
  updated_at: string;
  listing: Listing;
}

export interface ListingFormData {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category: string;
  status?: 'available' | 'draft' | 'sold';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PostFormData {
  title: string;
  content: string;
  published?: boolean;
}

export type NoteType = 'discount' | 'announcement' | 'inventory' | 'event' | 'other';
export type StoreType = 'restaurant' | 'retail' | 'hotel';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type StorePhotoCategory = 'environment' | 'menu' | 'products' | 'video';

export interface StorePhoto {
  id: number;
  store_profile_id: number;
  url: string;
  caption: string | null;
  category: StorePhotoCategory;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StoreProductPhoto {
  id: number;
  store_product_id: number;
  url: string;
  caption: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreProfile {
  id: number;
  user_id: number;
  shop_name: string;
  shop_description: string | null;
  logo_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
  business_hours: string | null;
  tags: string[] | null;
  is_public: boolean;
  slug: string | null;
  store_type: StoreType;
  notes_count?: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    avatar_url: string | null;
    bio: string | null;
    website_url: string | null;
  };
  notes?: StoreNote[];
  products?: StoreProduct[];
  photos?: StorePhoto[];
}

export interface StoreNote {
  id: number;
  store_profile_id: number;
  type: NoteType;
  title: string | null;
  content: string;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  store_profile?: Pick<StoreProfile, 'id' | 'shop_name' | 'slug' | 'logo_url'>;
}

export interface StoreProduct {
  id: number;
  store_profile_id: number;
  name: string;
  price: string;
  stock: number | null;
  unit: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  photos?: StoreProductPhoto[];
}

export interface StoreProfileFormData {
  shop_name: string;
  shop_description?: string | null;
  logo_url?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  address?: string | null;
  business_hours?: string | null;
  tags?: string[];
  is_public?: boolean;
  store_type?: StoreType;
}

export interface StoreNoteFormData {
  type: NoteType;
  title?: string | null;
  content: string;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

export interface StoreProductFormData {
  name: string;
  price: number;
  stock?: number | null;
  unit?: string | null;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface BookingItem {
  name: string;
  qty: number;
  unit?: string;
  price?: string;
  product_id?: number;
  staff?: string;
}

export interface StoreBooking {
  id: number;
  store_profile_id: number;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  customer_note: string | null;
  booking_at: string | null;
  table_area: string | null;
  party_size: number | null;
  items: BookingItem[] | null;
  extra: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  customer_name: string;
  customer_phone: string;
  customer_note?: string | null;
  booking_at?: string | null;
  table_area?: string | null;
  party_size?: number | null;
  items?: BookingItem[];
  extra?: Record<string, unknown>;
}
