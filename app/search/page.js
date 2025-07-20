"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { aiSearch } from '../../lib/ai-search';
import { addToSearchHistory } from '../../lib/searchHistory';
import { addToFavorites, removeFromFavorites, isFavorited } from '../../lib/favorites';
import { useAuth } from '../../components/AuthProvider';
import { Button } from '../../components/ui/button';
import React from 'react';

export default function SearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteStates, setFavoriteStates] = useState({});

  // Load query from URL params on mount
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(null, urlQuery);
    }
  }, [searchParams]);

  const handleSearch = async (e, searchQuery = null) => {
    if (e) e.preventDefault();
    const currentQuery = searchQuery || query;
    if (!currentQuery.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await aiSearch(currentQuery);
      setResults(data);
      
      // Add to search history if user is logged in
      if (user) {
        await addToSearchHistory(currentQuery, data.length);
      }
      
      // Check favorite status for each result
      if (user) {
        const favoriteChecks = {};
        for (const item of data) {
          favoriteChecks[item.id] = await isFavorited(item.id);
        }
        setFavoriteStates(favoriteChecks);
      }
    } catch (err) {
      setError('Failed to fetch deals.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (item) => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    
    try {
      const isFav = favoriteStates[item.id];
      if (isFav) {
        await removeFromFavorites(item.id);
      } else {
        await addToFavorites(item);
      }
      setFavoriteStates(prev => ({ ...prev, [item.id]: !isFav }));
    } catch (err) {
      setError('Failed to update favorites');
    }
  };

  return (
    <main className="flex flex-col items-center w-full px-4 min-h-[80vh]">
      <form className="flex flex-col sm:flex-row items-center w-full max-w-2xl mt-12" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a product..."
          className="flex-1 rounded-l-md border border-gray-300 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button type="submit">Search Deals</Button>
      </form>
      {loading && (
        <div className="mt-12 grid gap-6 w-full max-w-5xl md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse border rounded-xl p-6 shadow-md bg-gray-50 flex flex-col gap-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-2"></div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="mt-8 text-red-500">{error}</div>}
      {!loading && results.length > 0 && (
        <div className="mt-12 grid gap-6 w-full max-w-5xl md:grid-cols-2 lg:grid-cols-3">
          {results.map(item => (
            <div
              key={item.id}
              className={`border rounded-xl p-6 shadow-md flex flex-col transition-transform duration-200 hover:scale-[1.025] hover:shadow-lg bg-white ${item.bestDeal ? 'border-green-400' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg line-clamp-2">{item.title}</span>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleFavorite(item)}
                    className={`p-2 rounded-full transition-colors ${
                      favoriteStates[item.id] 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={favoriteStates[item.id] ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg className="w-5 h-5" fill={favoriteStates[item.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-2xl font-bold ${item.bestDeal ? 'text-green-600' : 'text-gray-900'}`}>{item.currency} {item.price}</span>
                {item.bestDeal && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs ml-2 font-bold shadow-sm">
                    Best Deal
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-gray-700 font-medium">Seller: {item.seller}</span>
                <span className="text-yellow-500 font-semibold">★ {item.rating}</span>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full mt-4 flex items-center justify-center gap-2 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9v9m-6-9v9m3-9v9" /></svg>
                  Visit Store
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
