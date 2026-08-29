import React, { useContext, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationdata from '../../assets/Streak Fire.json';
import { toast } from 'react-toastify';
import { MTContext } from '../Wrapper';
import { db } from '../utils/pouch';
import { getExtURL } from '../utils/asset';
import './stats.css';

const LottieComponent = typeof Lottie === 'function' ? Lottie : (Lottie?.default || Lottie);

const Stats = () => {
  const context = useContext(MTContext) || {};
  const { watchCount = 0, impCount = 0, pendingCount = 0, fetchStats } = context;

  const gridImage = getExtURL('graph.png');
  const gridPattern = getExtURL('grid.png');

  // Fetch stats on mount + listen to live DB changes
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
          console.error('[MarkTube] Live DB listener error:', err);
        });
    } catch (e) {
      console.warn('[MarkTube] DB changes listener initialization failed:', e);
    }

    return () => {
      if (changes) changes.cancel();
    };
  }, [fetchStats]);

  return (
    <div className="flex flex-col gap-3.5 p-3.5 items-center justify-center text-white w-full">
      {/* Header Greeting */}
      <div className="w-full flex items-center justify-between px-1">
        <h1 className="font-typold text-xl font-bold text-slate-100 leading-snug">
          Hey Yash! 👋 <br />
          <span className="text-xs font-normal text-slate-400">Ready to expand your library today?</span>
        </h1>
      </div>

      {/* Graph Card & Streak Container */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {/* Graph Overview Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-950/90 border border-slate-700/60 h-28 flex items-center justify-center overflow-hidden p-2">
          <img src={gridImage} alt="Stats Graph" className="absolute h-20 w-44 opacity-80 object-contain" />
          <img src={gridPattern} alt="Grid Overlay" className="absolute inset-0 w-full h-full opacity-20 object-cover" />
        </div>

        {/* Streak Animation Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-950/90 border border-slate-700/60 h-28 flex flex-col items-center justify-center overflow-hidden p-2">
          <span className="text-xs font-medium text-slate-300 absolute top-2 left-3">Learning Streak</span>
          <div className="flex items-center gap-1 mt-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-10 h-10 scale-120">
                {typeof LottieComponent === 'function' ? (
                  <LottieComponent animationData={animationdata} loop={true} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Count Cards */}
      <div className="grid grid-cols-3 gap-2.5 w-full">
        <div className="relative bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all rounded-xl p-3 text-center cursor-pointer group">
          <div className="text-xl font-extrabold text-emerald-400 group-hover:scale-105 transition-transform">{watchCount}</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Watched</div>
        </div>
        <div className="relative bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 transition-all rounded-xl p-3 text-center cursor-pointer group">
          <div className="text-xl font-extrabold text-amber-400 group-hover:scale-105 transition-transform">{impCount}</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Important</div>
        </div>
        <div className="relative bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-sky-950/20 transition-all rounded-xl p-3 text-center cursor-pointer group">
          <div className="text-xl font-extrabold text-sky-400 group-hover:scale-105 transition-transform">{pendingCount}</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">To Watch</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
