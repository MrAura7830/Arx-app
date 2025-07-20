"use client";
import { useState, useEffect } from 'react';
import { getFavorites, removeFromFavorites } from '../../lib/favorites';
import { useAuth } from '../../components/AuthProvider';
import { Button } from '../../components/ui/button';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadFavorites();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId) => {
    try {
      await removeFromFavorites(itemId);
      setFavorites(favorites.filter(item => item.item_id !== itemId));
    } catch (err) {
      setError('Failed to remove favorite');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-3xl font-bold mb-4">Sign in to view favorites</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to save and view your favorite deals.</p>
        <a href="/auth">
          <Button>Sign In</Button>
        </a>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center w-full px-4 min-h-[80vh]">
      <div className="w-full max-w-5xl mt-12">
        <h1 className="text-4xl font-bold mb-8">Your Favorites</h1>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No favorites yet!</p>
            <p className="text-gray-500 mb-6">Start searching for deals and save your favorites.</p>
            <a href="/">
              <Button>Start Shopping</Button>
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(item => (
              <div key={item.id} className="border rounded-xl p-6 shadow-md bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg line-clamp-2">{item.item_title}</span>
                  <button
                    onClick={() => handleRemoveFavorite(item.item_id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{item.item_currency} {item.item_price}</span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-700 font-medium">Seller: {item.seller}</span>
                </div>
                <a href={item.item_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">Visit Store</Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
