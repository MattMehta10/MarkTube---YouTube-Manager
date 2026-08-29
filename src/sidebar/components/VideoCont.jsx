import React, { useContext } from 'react';
import { MTContext } from '../Wrapper';

const VideoCont = () => {
  const context = useContext(MTContext) || {};
  const { important = [], toWatch = [] } = context;

  return (
    <div className="flex font-extrabold font-[gilroy] flex-col justify-around gap-1 w-117 h-[270px] py-1.5 items-center rounded-2xl border border-gray-50/12 bg-radial from-gray-700/30 from-10% to-gray-950/30 shrink-0">
      {/* 📺 Want to Watch Next */}
      <div className="w-110">
        <h1 className="pl-2 text-white text-sm">Want to Watch Next</h1>
        <div className="mt-0.5 w-full h-[98px] border border-gray-50/12 rounded-2xl overflow-hidden">
          <div className="flex flex-nowrap overflow-x-auto gap-3 p-1.5 scroll-smooth">
            {toWatch.length > 0 ? (
              toWatch.map((video) => (
                <a
                  key={video._id || video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[115px] h-[84px] rounded-lg flex-shrink-0 bg-yellow-400/30 text-white overflow-hidden p-1 hover:scale-[1.03] transition-transform"
                >
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-[46px] object-cover rounded-md"
                  />
                  <p
                    className="text-[10px] mt-0.5 leading-tight text-white overflow-hidden break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '2.4em',
                    }}
                  >
                    {video.title}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-xs text-white/50 py-2 pl-2">No videos in watchlist</p>
            )}
          </div>
        </div>
      </div>

      {/* 🧠 Important */}
      <div className="w-110">
        <h1 className="pl-2 text-white text-sm">Revisiting the Important Videos</h1>
        <div className="mt-0.5 w-full h-[98px] border border-gray-50/12 rounded-2xl overflow-hidden">
          <div className="flex flex-nowrap overflow-x-auto gap-3 p-1.5 scroll-smooth">
            {important.length > 0 ? (
              important.map((video) => (
                <a
                  key={video._id || video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[115px] h-[84px] rounded-lg flex-shrink-0 bg-red-800/30 text-white overflow-hidden p-1 hover:scale-[1.03] transition-transform"
                >
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-[46px] object-cover rounded-md"
                  />
                  <p
                    className="text-[10px] mt-0.5 leading-tight text-white overflow-hidden break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '2.4em',
                    }}
                  >
                    {video.title}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-xs text-white/50 py-2 pl-2">No important videos yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCont;
