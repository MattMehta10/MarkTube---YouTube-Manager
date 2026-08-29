import React from 'react';

const Playlist = ({ data, type }) => {
  const bg = (t) => {
    if (t === 'watched') return 'from-green-950/40 to-green-900/10 border-green-500/30 hover:border-green-500/60';
    if (t === 'toWatch') return 'from-yellow-950/40 to-yellow-900/10 border-yellow-500/30 hover:border-yellow-500/60';
    if (t === 'important') return 'from-red-950/40 to-red-900/10 border-red-500/30 hover:border-red-500/60';
    return 'from-gray-900/40 to-gray-800/10 border-gray-700/30 hover:border-gray-500/60';
  };

  return (
    <div
      className={`bg-gradient-to-r ${bg(
        type
      )} border relative w-full h-[68px] px-2.5 py-1.5 flex gap-3 items-center rounded-2xl text-white cursor-pointer hover:scale-[1.01] transition-all duration-200 overflow-hidden shrink-0`}
    >
      <img
        src={data.thumbnail || `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`}
        alt={data.title}
        className="w-[96px] h-[52px] rounded-xl object-cover shrink-0 bg-gray-900"
      />

      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
        <h1
          className="text-[13px] font-[gilroy] font-bold leading-tight text-white overflow-hidden break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '2.4em',
          }}
        >
          {data.title || 'Untitled'}
        </h1>

        <p className="text-[11px] font-[gilroy] font-normal text-gray-400 truncate mt-0.5">
          {data.channel || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default Playlist;
