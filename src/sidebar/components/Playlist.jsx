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
      className={`bg-gradient-to-tr transition-all duration-500 ease-in-out from-70% from-transparent to-85% ${bg(
        type
      )} relative hover:w-114 border-2 border-gray-500/30 w-112 whitespace-pre-wrap aspect-video flex gap-4 items-center rounded-2xl h-[65px] text-white cursor-pointer overflow-hidden shrink-0`}
    >
      {/* Thumbnail fixed with image tag for proper rendering */}
      <div className="w-[30%] shrink-0">
        <img
          src={data.thumbnail || `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`}
          alt={data.title}
          className="ml-2 w-[100px] h-[52px] bg-cover bg-center rounded-xl overflow-hidden bg-gray-200 object-cover"
        />
      </div>

      {/* Text & Info Block */}
      <div className="w-[65%] shrink-0">
        <div className="flex flex-col justify-start">
          <h1
            className="text-[13px] font-[gilroy] font-extrabold leading-snug text-white overflow-hidden break-words"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxHeight: '2.4em',
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
    </div>
  );
};

export default Playlist;
