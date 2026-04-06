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
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
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
