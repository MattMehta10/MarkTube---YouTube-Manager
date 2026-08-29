import React, { useContext, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { IoMdCloudDone } from 'react-icons/io';
import { GoArrowLeft } from 'react-icons/go';
import { MTContext } from '../Wrapper';
import Search from './Search';

const Nav = () => {
  const context = useContext(MTContext) || {};
  const { Notifshow, setNotifshow } = context;
  const [showSearch, setShowSearch] = useState(false);
  const wrapperRef = useRef(null);
  const location = useLocation();

  const isLibrary = location.pathname === '/library';
  const isLogin = location.pathname === '/login';
  const isSetting = location.pathname === '/setting';

  return (
    <div className="px-4 py-3 relative flex items-center justify-between bg-slate-950/80 border-b border-slate-800/60 backdrop-blur">
      <div className="flex items-center gap-1.5 relative" ref={wrapperRef}>
        {isLogin || isSetting ? (
          <Link to={isSetting ? '/' : '/setting'}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Back"
            >
              <GoArrowLeft />
            </div>
          </Link>
        ) : (
          <>
            <Link to={isLibrary ? '/' : '/library'}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={isLibrary ? 'Back' : 'Library'}
              >
                {isLibrary ? <GoArrowLeft /> : <MdOutlineCollectionsBookmark />}
              </div>
            </Link>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              onClick={() => setShowSearch(!showSearch)}
              title="Search"
            >
              <IoIosSearch />
            </div>

            <Search showSearch={showSearch} setShowSearch={setShowSearch} wrapperRef={wrapperRef} />
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div
          title="Database Synced"
          className="w-7 h-7 rounded-full flex items-center justify-center text-emerald-400 hover:bg-slate-800 transition"
        >
          <IoMdCloudDone className="text-lg" />
        </div>
        <div
          title="Notifications"
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          onClick={() => setNotifshow && setNotifshow(!Notifshow)}
        >
          <FaRegBell className="text-base" />
        </div>
        <Link to="/login">
          <div
            title="Profile & Account"
            className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-sky-400 hover:border-sky-400 transition overflow-hidden"
          >
            YM
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
