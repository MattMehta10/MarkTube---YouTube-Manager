import React, { useContext } from 'react';
import { MTContext } from '../Wrapper';

const VideoCont = () => {
  const context = useContext(MTContext) || {};
  const { important = [], toWatch = [] } = context;

  return (
    <div className="flex font-extrabold font-[gilroy] flex-col gap-5 w-117 h-90 py-5 items-center rounded-2xl border border-gray-50/12 bg-radial from-gray-700/30 from-10% to-gray-950/30">
      {/* 📺 Want to Watch Next */}
      <div>
        <h1 className="pl-2 text-white">Want to Watch Next</h1>
        <div className="mt-2 w-110 h-30 border border-gray-50/12 rounded-3xl overflow-hidden">
          <div className="flex flex-nowrap overflow-x-auto gap-4 p-3 scroll-smooth">
            {toWatch.length > 0 ? (
              toWatch.map((video) => (
                <a
                  key={video._id || video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[120px] h-24 rounded-lg flex-shrink-0 bg-yellow-400/30 text-white overflow-hidden p-1 hover:scale-[1.03] transition-transform"
                >
                  <img
                    src={video.thumbnail || 'https://via.placeholder.com/120x68'}
                    alt={video.title}
                    className="w-full h-3/5 object-cover rounded-md"
                  />
                  <p
                    className="text-[12px] mt-1 leading-snug text-white overflow-hidden break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '2.6em',
                    }}
                  >
                    {video.title}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-sm text-white/50">No videos in watchlist</p>
            )}
          </div>
        </div>
      </div>

      {/* 🧠 Important */}
      <div>
        <h1 className="pl-2 text-white">Revisiting the Important Videos</h1>
        <div className="mt-2 w-110 h-30 border border-gray-50/12 rounded-3xl overflow-hidden">
          <div className="flex flex-nowrap overflow-x-auto gap-4 p-3 scroll-smooth">
            {important.length > 0 ? (
              important.map((video) => (
                <a
                  key={video._id || video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[120px] h-24 rounded-lg flex-shrink-0 bg-red-800/30 text-white overflow-hidden p-1 hover:scale-[1.03] transition-transform"
                >
                  <img
                    src={video.thumbnail || 'https://via.placeholder.com/120x68'}
                    alt={video.title}
                    className="w-full h-3/5 object-cover rounded-md"
                  />
                  <p
                    className="text-[12px] mt-1 leading-snug text-white overflow-hidden break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      maxHeight: '2.6em',
                    }}
                  >
                    {video.title}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-sm text-white/50">No important videos yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCont;
