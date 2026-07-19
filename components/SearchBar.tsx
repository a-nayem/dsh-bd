"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // Direct Google search route
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Search Google..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <button className="search-btn" type="submit">Search</button>
    </form>
  );
}
