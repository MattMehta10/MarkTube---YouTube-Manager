import React from 'react';

const Playlist = ({ data, type }) => {
  const getCardStyle = (t) => {
    if (t === 'watched') {
      return 'bg-gradient-to-r from-[#071912] via-[#0d261c] to-[#16382a] border border-green-500/40 hover:border-green-400/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';
    }
    if (t === 'toWatch') {
      return 'bg-gradient-to-r from-[#1c1808] via-[#29220c] to-[#3a3011] border border-yellow-500/40 hover:border-yellow-400/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';
    }
    if (t === 'important') {
      return 'bg-gradient-to-r from-[#1c0808] via-[#2b0c0c] to-[#3d1212] border border-red-500/40 hover:border-red-400/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';
    }
    return 'bg-gradient-to-r from-[#0c101d] via-[#111728] to-[#1a233a] border border-gray-700/50 hover:border-gray-500/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';
  };

  return (
    <div
      className={`${getCardStyle(
        type
      )} relative w-full h-[72px] px-2.5 py-1.5 flex gap-3 items-center rounded-2xl text-white cursor-pointer hover:scale-[1.01] transition-all duration-200 overflow-hidden shrink-0`}
    >
      <div className="w-[106px] h-[56px] shrink-0 rounded-xl overflow-hidden bg-gray-900 shadow-md">
        <img
          src={data.thumbnail || `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`}
          alt={data.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
        <h1
          className="text-[13px] font-[typold] font-bold leading-snug text-white overflow-hidden break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '2.4em',
          }}
        >
          {data.title || 'Untitled'}
        </h1>

        <p className="text-[11px] font-[typold] text-gray-400 truncate mt-0.5 font-normal">
          {data.channel || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default Playlist;
