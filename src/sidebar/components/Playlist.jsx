import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';

const Playlist = ({ data, type, onDelete }) => {
  const getBadgeStyle = (t) => {
    if (t === 'watched') return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60';
    if (t === 'important') return 'bg-amber-950/80 text-amber-400 border-amber-700/60';
    return 'bg-sky-950/80 text-sky-400 border-sky-700/60';
  };

  const getTypeLabel = (t) => {
    if (t === 'watched') return 'Watched';
    if (t === 'important') return 'Important';
    return 'To Watch';
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between gap-3 group transition-all">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={data.thumbnail || 'https://via.placeholder.com/110x62'}
          alt={data.title}
          className="w-24 h-14 object-cover rounded-lg bg-slate-800 flex-shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(type)}`}>
              {getTypeLabel(type)}
            </span>
            <span className="text-[11px] text-slate-400 truncate">{data.channel || 'YouTube'}</span>
          </div>

          <h3 className="text-xs font-semibold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
            {data.title || 'Untitled Video'}
          </h3>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(data);
          }}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
          title="Delete video from library"
        >
          <MdDeleteOutline className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default Playlist;
