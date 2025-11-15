import { supabase } from '@/lib/supabase';
import type { RestaurantLayout } from '@/lib/types';

export async function createLayout(layout: {
  restaurant_id: string;
  name?: string;
  width?: number;
  height?: number;
  tables?: Array<Record<string, unknown>>;
  obstacles?: Array<Record<string, unknown>>;
}) {
  const { data, error } = await supabase
    .from('restaurant_layouts')
    .insert(layout)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLayoutByRestaurantId(restaurantId: string) {
  const { data, error } = await supabase
    .from('restaurant_layouts')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateLayout(
  restaurantId: string,
  updates: {
    name?: string;
    width?: number;
    height?: number;
    tables?: Array<Record<string, unknown>>;
    obstacles?: Array<Record<string, unknown>>;
  }
) {
  const { data, error } = await supabase
    .from('restaurant_layouts')
    .update(updates)
    .eq('restaurant_id', restaurantId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLayout(restaurantId: string) {
  const { error } = await supabase
    .from('restaurant_layouts')
    .delete()
    .eq('restaurant_id', restaurantId);

  if (error) throw error;
}

export async function updateTableStatus(
  restaurantId: string,
  tableId: string,
  status: 'available' | 'occupied' | 'reserved'
) {
  const { data: layout, error: fetchError } = await supabase
    .from('restaurant_layouts')
    .select('tables')
    .eq('restaurant_id', restaurantId)
    .single();

  if (fetchError) throw fetchError;

  const tables = layout.tables as Array<Record<string, unknown>>;
  const updatedTables = tables.map((table: Record<string, unknown>) => {
    if (table.id === tableId) {
      return { ...table, status, lastUpdated: new Date().toISOString() };
    }
    return table;
  });

  const { data, error } = await supabase
    .from('restaurant_layouts')
    .update({ tables: updatedTables })
    .eq('restaurant_id', restaurantId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
