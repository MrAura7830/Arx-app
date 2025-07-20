"use client";
import { useState, useEffect } from 'react';
import { getSearchHistory, clearSearchHistory } from '../../lib/searchHistory';
import { useAuth } from '../../components/AuthProvider';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadHistory();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadHistory = async () => {
    try {
      const data = await getSearchHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear your search history?')) {
      try {
        await clearSearchHistory();
        setHistory([]);
      } catch (err) {
        setError('Failed to clear history');
      }
    }
  };

  const handleSearchAgain = (query) => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
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
        <h1 className="text-3xl font-bold mb-4">Sign in to view search history</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to save and view your search history.</p>
        <a href="/auth">
          <Button>Sign In</Button>
        </a>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center w-full px-4 min-h-[80vh]">
      <div className="w-full max-w-4xl mt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Search History</h1>
          {history.length > 0 && (
            <Button 
              onClick={handleClearHistory}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear History
            </Button>
          )}
        </div>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No search history yet!</p>
            <p className="text-gray-500 mb-6">Your past searches will appear here.</p>
            <a href="/">
              <Button>Start Searching</Button>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-900">{item.search_query}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{item.results_count} results found</span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSearchAgain(item.search_query)}
                    className="ml-4"
                  >
                    Search Again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
