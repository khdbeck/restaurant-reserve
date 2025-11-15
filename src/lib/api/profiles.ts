import { supabase } from '@/lib/supabase';

export async function createProfile(profile: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role?: 'user' | 'owner' | 'admin';
}) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  id: string,
  updates: {
    name?: string;
    phone?: string;
    avatar_url?: string;
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileByEmail(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data;
}
