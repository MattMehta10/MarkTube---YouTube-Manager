import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { MTContext } from '../Wrapper';

const Search = ({ showSearch, setShowSearch, wrapperRef }) => {
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const context = useContext(MTContext) || {};
  const { watched = [], important = [], toWatch = [] } = context;
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const allVideos = [...watched, ...important, ...toWatch];
  const allSearchable = allVideos.filter((v) => v && (v.title || v.channel));

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

  const filterSuggestions = debounce((value) => {
    const q = value.toLowerCase();
    const filtered = allSearchable.filter(
      (v) => v.title?.toLowerCase().includes(q) || v.channel?.toLowerCase().includes(q)
    );
    setSuggestions(filtered.slice(0, 5));
  }, 200);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      filterSuggestions(value);
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

  return (
    showSearch && (
      <form onSubmit={handleSubmit} className="absolute top-0 left-10 w-72 z-50">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search by title or channel name..."
            className="w-full px-3 py-1 pr-8 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-[0.5px] ring-green-400"
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
              className="absolute top-2 right-2 text-white opacity-60 hover:opacity-100 cursor-pointer"
            >
              <MdClose />
            </button>
          )}
        </div>

        {suggestions.length > 0 && query && (
          <div className="max-h-60 mt-2 overflow-y-auto rounded-lg border border-gray-700 bg-[#111] shadow-lg text-sm">
            {suggestions.map((video) => (
              <a
                key={video._id || video.videoId}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 hover:bg-gray-800 rounded-md text-white"
              >
                <div className="font-semibold truncate">{video.title}</div>
                <div className="text-xs text-gray-400 truncate">{video.channel}</div>
              </a>
            ))}
          </div>
        )}
      </form>
    )
  );
};

export default Search;
