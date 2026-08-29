import React, { useContext } from 'react';
import { MTContext } from '../Wrapper';

const VideoCont = () => {
  const context = useContext(MTContext) || {};
  const { important = [], toWatch = [] } = context;

  return (
    <div className="flex flex-col gap-4 w-full px-3 py-2">
      {/* 📺 Want to Watch Next */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5">
        <h2 className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
          <span>📺</span> Want to Watch Next
        </h2>
        <div className="flex overflow-x-auto gap-3 pb-1 scroll-smooth">
          {toWatch.length > 0 ? (
            toWatch.map((video) => (
              <a
                key={video._id || video.videoId}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 flex-shrink-0 bg-slate-800/70 border border-slate-700/60 rounded-xl overflow-hidden p-1.5 hover:scale-[1.03] hover:border-amber-400/50 transition-all group"
              >
                <img
                  src={video.thumbnail || 'https://via.placeholder.com/120x68'}
                  alt={video.title}
                  className="w-full h-16 object-cover rounded-lg"
                />
                <p className="text-[11px] mt-1.5 font-medium leading-tight text-slate-200 line-clamp-2 group-hover:text-amber-300 transition-colors">
                  {video.title}
                </p>
              </a>
            ))
          ) : (
            <div className="py-4 px-2 text-xs text-slate-500 italic">No videos in your watchlist yet</div>
          )}
        </div>
      </div>

      {/* 🧠 Revisiting Important Videos */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5">
        <h2 className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
          <span>🧠</span> Revisiting Important Videos
        </h2>
        <div className="flex overflow-x-auto gap-3 pb-1 scroll-smooth">
          {important.length > 0 ? (
            important.map((video) => (
              <a
                key={video._id || video.videoId}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 flex-shrink-0 bg-slate-800/70 border border-slate-700/60 rounded-xl overflow-hidden p-1.5 hover:scale-[1.03] hover:border-emerald-400/50 transition-all group"
              >
                <img
                  src={video.thumbnail || 'https://via.placeholder.com/120x68'}
                  alt={video.title}
                  className="w-full h-16 object-cover rounded-lg"
                />
                <p className="text-[11px] mt-1.5 font-medium leading-tight text-slate-200 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                  {video.title}
                </p>
              </a>
            ))
          ) : (
            <div className="py-4 px-2 text-xs text-slate-500 italic">No important videos marked yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCont;
