import React, { useEffect, useState } from 'react';
import { db } from '../utils/pouch';
import Playlist from './Playlist';
import { GoSortAsc, GoSortDesc } from 'react-icons/go';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Library = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [vidType, setVidType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const itemsPerPage = 6;

  const fetchVideos = async () => {
    try {
      const res = await db.allDocs({ include_docs: true });
      const valid = res.rows
        .map((r) => r.doc)
        .filter((doc) => doc && doc._id && !doc._id.startsWith('_design/'));
      setAllVideos(valid);
    } catch (err) {
      toast.error('❌ Failed to load library videos');
      console.error('[MarkTube] PouchDB load error:', err);
    }
  };

  const handleDeleteDoc = async (video) => {
    try {
      await db.remove(video);
      toast.success('🗑️ Video removed from library');
      fetchVideos();
    } catch (err) {
      toast.error('❌ Could not remove video');
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
      console.warn('[MarkTube] DB listener init error:', e);
    }

    return () => {
      if (changes) changes.cancel();
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

    result.sort((a, b) => {
      const timeA = a.addedAt || 0;
      const timeB = b.addedAt || 0;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    setFilteredVideos(result);
    setCurrentPage(1);
  }, [vidType, sortOrder, allVideos, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginated = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="font-extrabold text-lg text-slate-100">Library Manager</h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {filteredVideos.length} Saved
          </span>
        </div>

        {/* Filter Tabs & Sort Button */}
        <div className="mt-4 flex justify-between items-center gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {[
              { label: 'All', value: '' },
              { label: 'To Watch', value: 'toWatch' },
              { label: 'Important', value: 'important' },
              { label: 'Watched', value: 'watched' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setVidType(tab.value)}
                className={`h-7 px-3 text-xs font-medium rounded-lg border transition ${
                  vidType === tab.value
                    ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
            className="h-7 w-8 text-base flex items-center justify-center border border-slate-800 bg-slate-900/60 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title={`Sort ${sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}`}
          >
            {sortOrder === 'asc' ? <GoSortAsc /> : <GoSortDesc />}
          </button>
        </div>

        <hr className="my-4 border-slate-800" />

        {/* Video List */}
        <div className="flex flex-col gap-2.5 min-h-[50vh] w-full">
          {paginated.length ? (
            paginated.map((v) => (
              <a
                key={v._id || v.videoId}
                href={`https://www.youtube.com/watch?v=${v.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Playlist data={v} type={v.type} onDelete={handleDeleteDoc} />
              </a>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
              <span>No videos found</span>
              {searchQuery && (
                <span className="text-xs text-slate-600 mt-1">Matching query "{searchQuery}"</span>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
              aria-label="Previous Page"
            >
              <MdOutlineKeyboardDoubleArrowLeft className="text-base" />
            </button>

            <span className="text-xs text-slate-400 font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
              aria-label="Next Page"
            >
              <MdOutlineKeyboardDoubleArrowRight className="text-base" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
