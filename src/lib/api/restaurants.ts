import { supabase } from '@/lib/supabase';
import type { Restaurant } from '@/lib/types';

export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRestaurantBySlug(slug: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      restaurant_layouts(*),
      menu_items(*),
      reviews(*)
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRestaurantById(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      restaurant_layouts(*),
      menu_items(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function searchRestaurants(filters: {
  city?: string;
  cuisine?: string[];
  priceRange?: string[];
  minRating?: number;
  searchQuery?: string;
}) {
  let query = supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false });

  if (filters.city) {
    query = query.eq('city', filters.city);
  }

  if (filters.cuisine && filters.cuisine.length > 0) {
    query = query.overlaps('cuisine', filters.cuisine);
  }

  if (filters.priceRange && filters.priceRange.length > 0) {
    query = query.in('price_range', filters.priceRange);
  }

  if (filters.minRating) {
    query = query.gte('rating', filters.minRating);
  }

  if (filters.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function createRestaurant(restaurant: {
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  country: string;
  cuisine: string[];
  features: string[];
  price_range: '$' | '$$' | '$$$';
  opening_hours: Record<string, unknown>;
  images: string[];
  owner_id: string;
}) {
  const { data, error } = await supabase
    .from('restaurants')
    .insert(restaurant)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRestaurant(id: string, updates: Partial<Restaurant>) {
  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRestaurant(id: string) {
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getOwnerRestaurants(ownerId: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
