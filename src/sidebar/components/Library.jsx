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
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginated = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full h-full px-5 py-3 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Title & Filter Options */}
        <h1 className="font-extrabold font-[gilroy] text-3xl text-white tracking-tight">
          All Videos
        </h1>

        <div className="options mt-3 flex justify-between items-center gap-2">
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'ToWatch', key: 'toWatch' },
              { label: 'Important', key: 'important' },
              { label: 'Watched', key: 'watched' },
              { label: 'All', key: '' },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setVidType(key)}
                className={`h-8 px-4 text-xs font-[gilroy] font-bold rounded-lg border border-gray-600/70 transition cursor-pointer ${
                  vidType === key
                    ? 'bg-gray-700/80 text-white border-white/40'
                    : 'bg-transparent text-white/90 hover:bg-gray-800/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
            className="h-8 w-9 text-base flex items-center justify-center border border-gray-600/70 rounded-lg hover:bg-gray-800 text-white cursor-pointer"
            title="Sort Order"
          >
            {sortOrder === 'asc' ? <GoSortAsc /> : <GoSortDesc />}
          </button>
        </div>

        <hr className="my-3 w-full border-gray-700/40" />

        {/* Video Cards Container */}
        <div className="flex flex-col gap-2.5 items-center justify-start min-h-[360px]">
          {paginated.length ? (
            paginated.map((v) => (
              <a
                key={v._id || v.videoId}
                href={`https://www.youtube.com/watch?v=${v.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center"
              >
                <Playlist data={v} type={v.type} />
              </a>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 font-[gilroy]">
              <p className="text-sm">No videos found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Page Navigator (Pagination Bar) */}
      <div className="pb-12 pt-2 flex justify-center items-center">
        {totalPages > 1 ? (
          <div className="flex items-center gap-1.5 font-[gilroy]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs rounded-md bg-transparent text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 text-xs font-bold rounded-md flex items-center justify-center transition cursor-pointer ${
                  currentPage === p
                    ? 'bg-white text-black'
                    : 'bg-gray-800/80 text-white hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-xs rounded-md bg-transparent text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              »
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Library;
