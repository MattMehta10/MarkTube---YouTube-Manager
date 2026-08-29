import React, { useContext, useEffect } from 'react';
import './stats.css';
import animationdata from '../../assets/Streak Fire.json';
import { toast } from 'react-toastify';
import { MTContext } from '../Wrapper';
import { db } from '../utils/pouch';
import Lottie from 'lottie-react';
import graphImgAsset from '../../../public/graph.png';
import gridImgAsset from '../../../public/grid.png';

const LottieComponent = typeof Lottie === 'function' ? Lottie : (Lottie?.default || Lottie);

const Stats = () => {
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
    <div className="flex gap-2 flex-wrap items-center justify-center text-black w-117 shrink-0">
      <div className="text-white font-bold w-61 h-20 text-[23px] items-center flex p-2">
        <h1 id="greeting">Hey Yash! how are you today</h1>
      </div>

      <div className="border-gray-50/12 bg-radial from-gray-700/50 from-10% to-gray-950/30 border relative rounded-2xl w-54 h-30 flex items-center justify-center overflow-hidden">
        <img
          className="absolute h-25 w-50 opacity-100 object-contain"
          src={graphImgAsset}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
          alt=""
        />
        <img
          className="absolute h-30 w-80 opacity-30 object-cover"
          src={gridImgAsset}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
          alt=""
        />
      </div>

      <div className="w-60 h-20 rounded-2xl bg-radial from-gray-700/50 from-10% to-gray-950/30 to-85% flex items-center border border-gray-50/12 bg-gray-50/5 overflow-hidden pt-5 p-2 relative justify-center bg-cover">
        <p className="text-sm absolute text-white top-1 left-3">Streak</p>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="scale-120 w-8 h-8 flex items-center justify-center">
            {typeof LottieComponent === 'function' && <LottieComponent animationData={animationdata} loop={true} />}
          </div>
        ))}
      </div>

      <div className="vidsec bg-transparent px-1 cursor-pointer bg-radial from-gray-700/40 from-0% to-gray-950/90 text-white flex justify-between items-center gap-2 rounded-2xl w-55 h-20">
        <div className="font-[gilroy] relative border-l border-b border-gray-50/12 bg-gray-50/5 hover:bg-green-600/25 transition ease-in-out duration-500 flex active:scale-95 justify-center font-extrabold rounded-xl text-2xl w-17 h-20">
          <h1 className="pt-3">{watchCount}</h1>
          <p className="absolute bottom-2 text-[12px]">Watched</p>
        </div>
        <div className="font-[gilroy] relative cursor-pointer border-l border-b border-gray-50/12 bg-gray-50/5 hover:bg-red-600/25 transition ease-in-out duration-500 active:scale-95 flex justify-center font-extrabold rounded-xl text-2xl w-17 h-20">
          <h1 className="pt-3">{impCount}</h1>
          <p className="absolute bottom-2 text-[12px]">Important</p>
        </div>
        <div className="font-[gilroy] relative cursor-pointer border-l border-b border-gray-50/12 bg-gray-50/5 hover:bg-yellow-400/25 flex transition ease-in-out duration-500 active:scale-95 justify-center font-extrabold rounded-xl text-2xl w-17 h-20">
          <h1 className="pt-3">{pendingCount}</h1>
          <p className="absolute bottom-2 text-[12px]">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
