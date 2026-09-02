import React, { useContext, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { FiDatabase } from 'react-icons/fi';
import { GoArrowLeft } from 'react-icons/go';
import { MTContext } from '../Wrapper';
import Search from './Search';
import { getExtURL } from '../utils/asset';

const Nav = () => {
  const context = useContext(MTContext) || {};
  const { Notifshow, setNotifshow } = context;
  const [showSearch, setShowSearch] = useState(false);
  const wrapperRef = useRef(null);
  const location = useLocation();

  const isLibrary = location.pathname === '/library';
  const isLogin = location.pathname === '/login';
  const isSetting = location.pathname === '/setting';

  const avatar = getExtURL('Designer.jpeg');

  return (
    <div className="px-3 py-3 relative flex items-center justify-between">
      <div className="flex gap-1 relative" ref={wrapperRef}>
        {isLogin || isSetting ? (
          <Link to={isSetting ? '/' : '/setting'}>
            <div className="w-8 h-8 p-[5px] rounded-full flex items-center justify-center text-3xl hover:bg-gray-800 cursor-pointer" title="Back">
              <GoArrowLeft />
            </div>
          </Link>
        ) : (
          <>
            <Link to={isLibrary ? '/' : '/library'}>
              <div className="w-8 h-8 p-[5px] rounded-full flex items-center justify-center text-3xl hover:bg-gray-800 cursor-pointer" title={isLibrary ? 'Back' : 'Library'}>
                {isLibrary ? <GoArrowLeft /> : <MdOutlineCollectionsBookmark />}
              </div>
            </Link>

            <div
              className="w-8 h-8 p-[5px] rounded-full flex items-center justify-center text-3xl hover:bg-gray-800 cursor-pointer"
              onClick={() => setShowSearch(true)}
              title="Search"
            >
              <IoIosSearch />
            </div>

            <Search showSearch={showSearch} setShowSearch={setShowSearch} wrapperRef={wrapperRef} />
          </>
        )}
      </div>

      {/* Right Icons */}
      <div className="flex gap-3 items-center">
        <Link to="/setting">
          <div
            title="Local DB Storage"
            className={`w-6 h-6 p-[2px] rounded-full flex items-center justify-center text-xl transition-colors cursor-pointer ${
              isSetting
                ? 'text-emerald-400 bg-gray-800'
                : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
            }`}
          >
            <FiDatabase />
          </div>
        </Link>
        <div
          title="Notification"
          className="w-6 h-6 p-[2px] rounded-full flex items-center justify-center text-xl hover:bg-gray-800 cursor-pointer"
          onClick={() => setNotifshow && setNotifshow(!Notifshow)}
        >
          <FaRegBell />
        </div>
        <Link to="/login">
          <img
            src="https://res.cloudinary.com/ymatt/image/upload/v1763563264/Designer_uptxpr.jpg"
            onError={(e) => { e.target.src = avatar; }}
            alt="profile"
            title="Profile"
            className="w-6 h-6 p-[2px] rounded-full flex items-center justify-center text-2xl hover:bg-gray-800 cursor-pointer object-cover"
          />
        </Link>
      </div>
    </div>
  );
};

export default Nav;
