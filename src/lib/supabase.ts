import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'user' | 'owner' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'owner' | 'admin';
        };
        Update: {
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'owner' | 'admin';
        };
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          address: string;
          city: string;
          country: string;
          cuisine: string[];
          features: string[];
          price_range: '$' | '$$' | '$$$';
          rating: number;
          review_count: number;
          opening_hours: Record<string, unknown>;
          images: string[];
          owner_id: string | null;
          is_newly_joined: boolean;
          is_michelin_guide: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description: string;
          address: string;
          city?: string;
          country?: string;
          cuisine?: string[];
          features?: string[];
          price_range?: '$' | '$$' | '$$$';
          opening_hours: Record<string, unknown>;
          images?: string[];
          owner_id?: string | null;
          is_newly_joined?: boolean;
          is_michelin_guide?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          address?: string;
          city?: string;
          country?: string;
          cuisine?: string[];
          features?: string[];
          price_range?: '$' | '$$' | '$$$';
          opening_hours?: Record<string, unknown>;
          images?: string[];
          is_newly_joined?: boolean;
          is_michelin_guide?: boolean;
        };
      };
      restaurant_layouts: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          width: number;
          height: number;
          tables: Array<Record<string, unknown>>;
          obstacles: Array<Record<string, unknown>>;
          is_template: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          restaurant_id: string;
          name?: string;
          width?: number;
          height?: number;
          tables?: Array<Record<string, unknown>>;
          obstacles?: Array<Record<string, unknown>>;
          is_template?: boolean;
        };
        Update: {
          name?: string;
          width?: number;
          height?: number;
          tables?: Array<Record<string, unknown>>;
          obstacles?: Array<Record<string, unknown>>;
          is_template?: boolean;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          features: string[];
          preparation_time: number | null;
          is_available: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          restaurant_id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          features?: string[];
          preparation_time?: number | null;
          is_available?: boolean;
          image_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          features?: string[];
          preparation_time?: number | null;
          is_available?: boolean;
          image_url?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          booking_date: string;
          booking_time: string;
          guests: number;
          selected_table_id: string | null;
          special_requests: string | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_amount: number | null;
          payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          restaurant_id: string;
          user_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          booking_date: string;
          booking_time: string;
          guests: number;
          selected_table_id?: string | null;
          special_requests?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_amount?: number | null;
          payment_intent_id?: string | null;
        };
        Update: {
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          booking_date?: string;
          booking_time?: string;
          guests?: number;
          selected_table_id?: string | null;
          special_requests?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_amount?: number | null;
          payment_intent_id?: string | null;
        };
      };
      booking_pre_orders: {
        Row: {
          id: string;
          booking_id: string;
          menu_item_id: string;
          quantity: number;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          booking_id: string;
          menu_item_id: string;
          quantity: number;
          special_instructions?: string | null;
        };
        Update: {
          quantity?: number;
          special_instructions?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string;
          rating: number;
          title: string;
          comment: string;
          verified: boolean;
          helpful_count: number;
          photos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          restaurant_id: string;
          user_id: string;
          rating: number;
          title: string;
          comment: string;
          photos?: string[];
        };
        Update: {
          rating?: number;
          title?: string;
          comment?: string;
          photos?: string[];
        };
      };
    };
  };
};
