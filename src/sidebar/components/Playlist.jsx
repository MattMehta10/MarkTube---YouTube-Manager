import React from 'react';

const Playlist = ({ data, type }) => {
  const getGlowColor = (t) => {
    if (t === 'watched') {
      return 'to-green-500/25 hover:to-green-500/35 border-green-500/40 hover:border-green-400/70';
    }
    if (t === 'toWatch') {
      return 'to-yellow-500/25 hover:to-yellow-500/35 border-yellow-500/40 hover:border-yellow-400/70';
    }
    if (t === 'important') {
      return 'to-red-500/25 hover:to-red-500/35 border-red-500/40 hover:border-red-400/70';
    }
    return 'to-gray-500/25 border-gray-700/50 hover:border-gray-500/70';
  };

  return (
    <div
      className={`bg-gradient-to-tr from-65% from-transparent to-90% ${getGlowColor(
        type
      )} relative border w-full rounded-2xl h-[72px] px-2.5 py-1.5 flex gap-3 items-center text-white cursor-pointer hover:scale-[1.01] transition-all duration-300 overflow-hidden shrink-0 bg-[#090d16]/80`}
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
