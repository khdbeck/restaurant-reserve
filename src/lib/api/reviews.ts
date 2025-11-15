import { supabase } from '@/lib/supabase';

export async function createReview(review: {
  restaurant_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRestaurantReviews(restaurantId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles(name, avatar_url)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      restaurants(name, slug, images)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateReview(
  id: string,
  updates: {
    rating?: number;
    title?: string;
    comment?: string;
    photos?: string[];
  }
) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function incrementHelpfulCount(id: string) {
  const { data, error } = await supabase
    .rpc('increment_helpful_count', { review_id: id });

  if (error) throw error;
  return data;
}

export async function getReviewByUserAndRestaurant(userId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
