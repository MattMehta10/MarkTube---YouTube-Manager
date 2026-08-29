import React, { useEffect, useState } from 'react';
import { db } from '../utils/pouch';
import Playlist from './Playlist';
import { GoSortAsc, GoSortDesc } from 'react-icons/go';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Library = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [vidType, setVidType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const itemsPerPage = 5;

  const fetchVideos = async () => {
    try {
      const res = await db.allDocs({ include_docs: true });
      const valid = res.rows
        .map((r) => r.doc)
        .filter((doc) => doc && doc._id && !doc._id.startsWith('_design/'));

      setAllVideos(valid);

      // Auto-repair any documents with 'Untitled' or 'Unknown' using oEmbed
      valid.forEach(async (doc) => {
        if (doc.videoId && (doc.title === 'Untitled' || doc.channel === 'Unknown')) {
          try {
            const oembedRes = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${doc.videoId}&format=json`
            );
            if (oembedRes.ok) {
              const data = await oembedRes.json();
              if (data.title && data.title !== 'Untitled') {
                const updated = {
                  ...doc,
                  title: data.title,
                  channel: data.author_name || doc.channel,
                  thumbnail: data.thumbnail_url || doc.thumbnail,
                };
                await db.put(updated);
                setAllVideos((prev) => prev.map((v) => (v._id === doc._id ? updated : v)));
              }
            }
          } catch (e) {
            // silent ignore background fetch
          }
        }
      });
    } catch (err) {
      toast.error('❌ Failed to load videos');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();

    let changes;
    try {
      changes = db
        .changes({
          since: 'now',
          live: true,
          include_docs: true,
        })
        .on('change', () => {
          fetchVideos();
        });
    } catch (e) {
      console.warn(e);
    }

    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local') {
        fetchVideos();
      }
    };

    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    const interval = setInterval(fetchVideos, 1500);

    return () => {
      if (changes) changes.cancel();
      if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let result = [...allVideos];

    if (vidType) result = result.filter((v) => v.type === vidType);
    if (searchQuery) {
      result = result.filter(
        (v) =>
          v.title?.toLowerCase().includes(searchQuery) ||
          v.channel?.toLowerCase().includes(searchQuery)
      );
    }

    result = result
      .filter((v) => typeof v.addedAt === 'number')
      .sort((a, b) => (sortOrder === 'asc' ? a.addedAt - b.addedAt : b.addedAt - a.addedAt));

    setFilteredVideos(result);
    setCurrentPage(1);
  }, [vidType, sortOrder, allVideos, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((p) => {
      const clamped = Math.min(Math.max(1, p), totalPages);
      return clamped;
    });
  }, [totalPages]);

  const paginated = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-5 py-3 flex flex-col h-[calc(100vh-70px)] justify-between overflow-hidden">
      {/* Top Header & Filter Options */}
      <div className="flex flex-col gap-3 shrink-0">
        <h1 className="font-extrabold text-2xl text-white font-[gilroy]">All Videos</h1>

        <div className="options flex justify-between items-center">
          <div className="flex gap-2.5">
            {[
              { label: 'ToWatch', value: 'toWatch' },
              { label: 'Important', value: 'important' },
              { label: 'Watched', value: 'watched' },
              { label: 'All', value: '' },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setVidType(btn.value)}
                className={`h-8 px-3.5 text-xs font-[gilroy] font-semibold rounded-lg border transition cursor-pointer ${
                  vidType === btn.value
                    ? 'bg-gray-700/80 border-gray-500 text-white'
                    : 'border-gray-700/80 bg-gray-900/40 text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
            className="h-8 w-9 text-base flex items-center justify-center border border-gray-700/80 rounded-lg bg-gray-900/40 hover:bg-gray-800 text-white cursor-pointer"
            title="Sort order"
          >
            {sortOrder === 'asc' ? <GoSortAsc /> : <GoSortDesc />}
          </button>
        </div>

        <hr className="border-gray-800/80 w-full" />
      </div>

      {/* Video List (5 cards max) */}
      <div className="flex-1 flex flex-col gap-2.5 justify-start overflow-hidden py-1">
        {paginated.length ? (
          paginated.map((v) => (
            <a
              key={v._id || v.videoId}
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full shrink-0"
            >
              <Playlist data={v} type={v.type} />
            </a>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No videos found.</p>
          </div>
        )}
      </div>

      {/* Page Navigator (Matches Image 2 reference layout exactly) */}
      <div className="py-2 flex items-center justify-center gap-1.5 shrink-0">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          «
        </button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`px-2.5 py-0.5 text-xs font-[gilroy] rounded-md transition cursor-pointer ${
              currentPage === p
                ? 'bg-white text-black font-extrabold'
                : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Library;
