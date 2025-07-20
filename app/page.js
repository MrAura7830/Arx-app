"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      {/* Header */}
      <header className="w-full flex items-center justify-between py-8 max-w-5xl mx-auto">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-extrabold text-blue-600">Arx</span>
          <span className="text-lg text-gray-600 font-medium">BargainFinder AI</span>
        </div>
        <nav className="flex items-center space-x-8 text-base font-medium">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/favorites" className="text-gray-700 hover:text-blue-600">Favorites</a>
          <a href="/history" className="text-gray-700 hover:text-blue-600">History</a>
          <a href="/auth" className="text-gray-700 hover:text-blue-600">Login / Sign Up</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center mt-12 w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">What are you looking<br />for today?</h1>

<form
  className="flex flex-col sm:flex-row items-center w-full max-w-2xl mt-4"
  onSubmit={e => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?query=${encodeURIComponent(search)}`);
  }}
>
  <input
    type="text"
    placeholder="e.g. Samsung Galaxy A15 smartphone 128GB"
    className="flex-1 rounded-l-md border border-gray-300 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={search}
    onChange={e => setSearch(e.target.value)}
  />
  <button
    type="submit"
    className="bg-blue-600 text-white px-8 py-4 rounded-r-md text-lg font-semibold hover:bg-blue-700 transition-colors"
  >
    Search Deals
  </button>
</form>
        <p className="mt-6 text-gray-500 text-lg">
          Try: iPhone charger, Wireless headphones, Office chair…
        </p>
      </section>
    </main>
  );
}
