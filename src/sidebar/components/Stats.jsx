import React, { useContext, useEffect } from 'react';
import './stats.css';
import animationdata from '../../assets/Streak Fire.json';
import { toast } from 'react-toastify';
import { MTContext } from '../Wrapper';
import { db } from '../utils/pouch';
import Lottie from 'lottie-react';
import { getExtURL } from '../utils/asset';

const LottieComponent = typeof Lottie === 'function' ? Lottie : (Lottie?.default || Lottie);

const Stats = () => {
  const graphImg = getExtURL('graph.png');
  const gridImg = getExtURL('grid.png');

  const context = useContext(MTContext) || {};
  const { watchCount = 0, impCount = 0, pendingCount = 0, fetchStats } = context;

  useEffect(() => {
    if (fetchStats) fetchStats();

    let changes;
    try {
      changes = db
        .changes({
          since: 'now',
          live: true,
          include_docs: true,
        })
        .on('change', (change) => {
          if (change.deleted || change.doc?.type) {
            toast.info(`🔄 DB Updated: ${change.doc?.type || 'item updated'}`);
            if (fetchStats) fetchStats();
          }
        })
        .on('error', (err) => {
          console.error('❌ DB Change Listener Error:', err);
        });
    } catch (e) {
      console.warn(e);
    }

    return () => {
      if (changes) changes.cancel();
    };
  }, [fetchStats]);

  return (
    <div className="flex gap-2 flex-wrap items-center justify-between text-black w-full px-4 shrink-0 font-[gilroy]">
      {/* Greeting Box */}
      <div className="text-white font-bold w-[220px] h-20 text-[22px] items-center flex leading-tight">
        <h1 id="greeting">Hey Yash! how are you today</h1>
      </div>

      {/* Graph Box */}
      <div className="border-gray-700/50 bg-gradient-to-br from-gray-800/60 to-gray-950/80 border relative rounded-2xl w-[210px] h-24 flex items-center justify-center overflow-hidden p-2">
        <svg className="w-full h-full text-green-500/40" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M 0 40 Q 25 10 50 25 T 100 5" stroke="url(#gradient)" strokeWidth="3" fill="none" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <img
          className="absolute inset-0 w-full h-full opacity-60 object-contain"
          src={graphImg}
          onError={(e) => { e.target.style.display = 'none'; }}
          alt="Graph"
        />
      </div>

      {/* Streak Box */}
      <div className="w-[220px] h-20 rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-950/90 flex items-center border border-gray-700/50 relative justify-center overflow-hidden">
        <p className="text-xs absolute text-white/80 top-1.5 left-3 font-semibold">Streak</p>
        <div className="flex items-center gap-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-7 h-7 flex items-center justify-center">
              {typeof LottieComponent === 'function' ? (
                <LottieComponent animationData={animationdata} loop={true} />
              ) : (
                <span className="text-purple-400 text-lg">🔥</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counters */}
      <div className="vidsec bg-transparent text-white flex justify-between items-center gap-2 rounded-2xl w-[210px] h-20">
        <div className="font-[gilroy] relative border border-gray-700/50 bg-gray-900/60 hover:bg-green-600/25 transition ease-in-out duration-300 flex flex-col active:scale-95 justify-center items-center font-extrabold rounded-xl text-xl w-[64px] h-20">
          <h1 className="text-green-400">{watchCount}</h1>
          <p className="text-[11px] font-medium text-gray-300">Watched</p>
        </div>
        <div className="font-[gilroy] relative border border-gray-700/50 bg-gray-900/60 hover:bg-red-600/25 transition ease-in-out duration-300 flex flex-col active:scale-95 justify-center items-center font-extrabold rounded-xl text-xl w-[64px] h-20">
          <h1 className="text-red-400">{impCount}</h1>
          <p className="text-[11px] font-medium text-gray-300">Important</p>
        </div>
        <div className="font-[gilroy] relative border border-gray-700/50 bg-gray-900/60 hover:bg-yellow-400/25 transition ease-in-out duration-300 flex flex-col active:scale-95 justify-center items-center font-extrabold rounded-xl text-xl w-[64px] h-20">
          <h1 className="text-yellow-400">{pendingCount}</h1>
          <p className="text-[11px] font-medium text-gray-300">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
