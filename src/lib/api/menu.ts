import { supabase } from '@/lib/supabase';

export async function createMenuItem(menuItem: {
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features?: string[];
  preparation_time?: number;
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(menuItem)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMenuItems(restaurantId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAllMenuItems(restaurantId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getMenuItem(id: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateMenuItem(
  id: string,
  updates: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    features?: string[];
    preparation_time?: number;
    is_available?: boolean;
    image_url?: string;
  }
) {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  return updateMenuItem(id, { is_available: isAvailable });
}

export async function getMenuItemsByCategory(restaurantId: string, category: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('category', category)
    .eq('is_available', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}
