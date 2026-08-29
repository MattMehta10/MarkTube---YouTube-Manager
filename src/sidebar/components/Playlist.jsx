import React from 'react';

const Playlist = ({ data, type }) => {
  const getGradient = (t) => {
    if (t === 'watched') return 'to-green-950/50 border-green-800/40 hover:border-green-500/60';
    if (t === 'toWatch') return 'to-yellow-950/50 border-yellow-800/40 hover:border-yellow-500/60';
    if (t === 'important') return 'to-red-950/50 border-red-800/40 hover:border-red-500/60';
    return 'to-gray-900/50 border-gray-800/40';
  };

  return (
    <div
      className={`w-full max-w-[460px] h-[68px] bg-gradient-to-r from-gray-950/90 via-gray-900/90 ${getGradient(
        type
      )} border rounded-2xl p-1.5 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] cursor-pointer shadow-md overflow-hidden shrink-0`}
    >
      {/* Thumbnail */}
      <div className="w-[100px] h-[54px] rounded-xl overflow-hidden shrink-0 bg-gray-800 flex items-center justify-center">
        <img
          src={data?.thumbnail || `https://i.ytimg.com/vi/${data?.videoId}/hqdefault.jpg`}
          alt={data?.title || 'Video'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://i.ytimg.com/vi/${data?.videoId}/hqdefault.jpg`;
          }}
        />
      </div>

      {/* Text Info */}
      <div className="flex flex-col justify-center overflow-hidden flex-1 pr-2">
        <h1
          className="text-[13px] font-[gilroy] font-bold text-white leading-tight overflow-hidden break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {data?.title || 'Untitled'}
        </h1>
        <p className="text-[11.5px] font-[gilroy] font-medium text-gray-300 truncate mt-0.5">
          {data?.channel || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default Playlist;
