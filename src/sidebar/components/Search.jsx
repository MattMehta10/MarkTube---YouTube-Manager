import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { MTContext } from '../Wrapper';

const Search = ({ showSearch, setShowSearch, wrapperRef }) => {
  const context = useContext(MTContext) || {};
  const { watched = [], important = [], toWatch = [] } = context;
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const allVideos = [...watched, ...important, ...toWatch];
  const allSearchable = allVideos.filter((v) => v && (v.title || v.channel));

  // Detect click outside search component
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
        if (location.pathname !== '/library') {
          setShowSearch(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef, location.pathname, setShowSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      const q = value.toLowerCase();
      const filtered = allSearchable.filter(
        (v) => v.title?.toLowerCase().includes(q) || v.channel?.toLowerCase().includes(q)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/library?search=${encodeURIComponent(query.trim())}`);
    setSuggestions([]);
    if (location.pathname !== '/library') setShowSearch(false);
  };

  if (!showSearch) return null;

  return (
    <form onSubmit={handleSubmit} className="absolute top-0 left-10 w-72 z-50">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search title or channel..."
          className="w-full px-3 py-1.5 pr-8 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-1 ring-emerald-500 text-sm"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setSearchParams({});
            }}
            aria-label="Clear search query"
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
          >
            <MdClose />
          </button>
        )}
      </div>

      {suggestions.length > 0 && query && (
        <div className="max-h-60 mt-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl text-sm divide-y divide-slate-800">
          {suggestions.map((video) => (
            <a
              key={video._id || video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 hover:bg-slate-800 transition"
            >
              <div className="font-medium text-slate-200 truncate">{video.title || 'Untitled Video'}</div>
              <div className="text-xs text-slate-400 truncate">{video.channel || 'Unknown Channel'}</div>
            </a>
          ))}
        </div>
      )}
    </form>
  );
};

export default Search;
