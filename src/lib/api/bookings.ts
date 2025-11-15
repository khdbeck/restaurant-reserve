import { supabase } from '@/lib/supabase';
import type { Booking, PreOrder } from '@/lib/types';

export async function createBooking(booking: {
  restaurant_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  selected_table_id?: string;
  special_requests?: string;
  payment_amount?: number;
  payment_intent_id?: string;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createBookingWithPreOrders(
  booking: Parameters<typeof createBooking>[0],
  preOrders: PreOrder[]
) {
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (bookingError) throw bookingError;

  if (preOrders.length > 0) {
    const preOrderInserts = preOrders.map(order => ({
      booking_id: bookingData.id,
      menu_item_id: order.menuItemId,
      quantity: order.quantity,
      special_instructions: order.specialInstructions,
    }));

    const { error: preOrderError } = await supabase
      .from('booking_pre_orders')
      .insert(preOrderInserts);

    if (preOrderError) throw preOrderError;
  }

  return bookingData;
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      restaurants(*),
      booking_pre_orders(
        *,
        menu_items(*)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      restaurants(*)
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRestaurantBookings(restaurantId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      booking_pre_orders(
        *,
        menu_items(*)
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('booking_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingPaymentStatus(
  id: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  paymentIntentId?: string
) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      payment_status: paymentStatus,
      ...(paymentIntentId && { payment_intent_id: paymentIntentId })
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelBooking(id: string) {
  return updateBookingStatus(id, 'cancelled');
}

export async function getUpcomingBookings(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      restaurants(*)
    `)
    .eq('user_id', userId)
    .gte('booking_date', today)
    .in('status', ['pending', 'confirmed'])
    .order('booking_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPastBookings(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      restaurants(*)
    `)
    .eq('user_id', userId)
    .lt('booking_date', today)
    .order('booking_date', { ascending: false });

  if (error) throw error;
  return data;
}
