import { supabase } from './supabaseClient';

// Add search query to user's history
export async function addToSearchHistory(query, resultsCount = 0) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // Don't throw error, just skip for guest users

  const { data, error } = await supabase
    .from('user_search_history')
    .insert([
      {
        user_id: user.id,
        search_query: query,
        results_count: resultsCount,
      }
    ]);

  if (error) console.error('Error adding to search history:', error);
  return data;
}

// Get user's search history
export async function getSearchHistory(limit = 10) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_search_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Clear user's search history
export async function clearSearchHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_search_history')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;
}
