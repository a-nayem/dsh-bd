"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // Opens in a new tab instead of navigating away from the dashboard
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank", "noopener,noreferrer");
    setQuery("");
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
