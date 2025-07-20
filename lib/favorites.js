import { supabase } from './supabaseClient';

// Add item to user's favorites
export async function addToFavorites(item) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_favorites')
    .insert([
      {
        user_id: user.id,
        item_id: item.id,
        item_title: item.title,
        item_price: item.price,
        item_currency: item.currency,
        seller: item.seller,
        item_url: item.url,
      }
    ]);

  if (error) throw error;
  return data;
}

// Remove item from user's favorites
export async function removeFromFavorites(itemId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('item_id', itemId);

  if (error) throw error;
}

// Get user's favorites
export async function getFavorites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Check if item is favorited
export async function isFavorited(itemId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}
