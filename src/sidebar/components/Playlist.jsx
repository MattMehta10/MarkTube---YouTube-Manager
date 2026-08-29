import React from 'react';

const Playlist = ({ data, type }) => {
  const bg = (t) => {
    if (t === 'watched') return 'to-green-500/15 hover:to-green-500/25 border-green-500/30';
    if (t === 'toWatch') return 'to-yellow-500/15 hover:to-yellow-500/25 border-yellow-500/30';
    if (t === 'important') return 'to-red-500/15 hover:to-red-500/25 border-red-500/30';
    return 'to-gray-500/15 border-gray-500/30';
  };

  return (
    <div
      className={`bg-gradient-to-tr transition-all duration-300 ease-in-out from-70% from-transparent to-85% ${bg(
        type
      )} relative border border-gray-500/30 w-full rounded-xl h-[62px] px-2 py-1 flex gap-3 items-center text-white cursor-pointer hover:scale-[1.01] shrink-0 overflow-hidden`}
    >
      <div className="w-[90px] h-[50px] shrink-0 rounded-lg overflow-hidden bg-gray-900">
        <img
          src={data.thumbnail || `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`}
          alt={data.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
        <h1
          className="text-[12px] font-[gilroy] font-bold leading-tight text-white overflow-hidden break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '2.4em',
          }}
        >
          {data.title || 'Untitled'}
        </h1>

        <p className="text-[10px] font-[gilroy] text-gray-400 truncate mt-0.5">
          {data.channel || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default Playlist;
