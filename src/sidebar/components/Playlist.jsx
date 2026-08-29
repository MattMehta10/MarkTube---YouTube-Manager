import React, { useEffect, useState } from 'react';

const Playlist = ({ data, type, size }) => {
  const [CardSize, setCardSize] = useState(size);

  const bg = (t) => {
    if (t === 'watched') return 'to-green-500/15 hover:to-green-500/25';
    else if (t === 'toWatch') return 'to-yellow-500/15 hover:to-yellow-500/25';
    else if (t === 'important') return 'to-red-500/15 hover:to-red-500/25';
    return 'to-gray-500/15';
  };

  useEffect(() => {
    setCardSize(size);
  }, [size]);

  return (
    <div
      key={data._id || data.videoId}
      className={`bg-gradient-to-tr transition-all duration-300 ease-in-out from-70% from-transparent to-85% ${bg(
        type
      )} group relative w-[452px] hover:w-[460px] border-2 border-gray-500/30 whitespace-pre-wrap aspect-video flex items-center rounded-2xl h-[78px] text-white cursor-pointer overflow-hidden shrink-0 origin-left`}
    >
      {/* Thumbnail fixed with image tag for proper rendering */}
      <div className="shrink-0 pl-2">
        <img
          src={data.thumbnail || `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`}
          alt={data.title}
          className="w-[110px] h-[60px] bg-cover bg-center rounded-xl overflow-hidden bg-gray-200 object-cover"
        />
      </div>

      {/* Text & Info Block */}
      <div className="flex-1 min-w-0 pl-3 pr-3 flex flex-col justify-center">
        <h1
          className="text-[13.5px] font-[gilroy] font-extrabold leading-snug text-white overflow-hidden break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '2.5em',
          }}
        >
          {data.title || 'Untitled'}
        </h1>

        <div>
          <p className="text-[12px] mt-0.5 flex items-center gap-2 text-gray-300 font-[gilroy]">
            {data.channel || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
