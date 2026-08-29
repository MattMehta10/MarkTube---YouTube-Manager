import React, { useContext } from 'react';
import { VscFeedback } from 'react-icons/vsc';
import { MdSettings, MdHome } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { FiSun } from 'react-icons/fi';
import { AiOutlineMoon } from 'react-icons/ai';
import { getExtURL } from '../utils/asset';
import { MTContext } from '../Wrapper';

const Footer = () => {
  const loc = useLocation();
  const context = useContext(MTContext) || {};
  const { theme, settheme } = context;

  const logo = getExtURL('logo.png');

  return (
    <div className="flex w-full flex-col shrink-0 z-50">
      <div className="pb-1 h-9 w-full flex justify-between items-center px-3 bg-green-950/80 border-t border-gray-800">
        <div className="options flex items-center gap-3">
          <Link to="/">
            <div
              className={`${
                loc.pathname === '/' ? 'bg-green-700/50' : 'bg-transparent'
              } w-7 h-7 text-2xl flex justify-center items-center rounded-full hover:bg-green-700 cursor-pointer`}
            >
              <MdHome />
            </div>
          </Link>

          <Link to="/setting">
            <div
              className={`${
                loc.pathname === '/setting' ? 'bg-green-700/50' : 'bg-transparent'
              } w-7 h-7 text-2xl flex justify-center items-center rounded-full hover:bg-green-700 cursor-pointer`}
            >
              <MdSettings />
            </div>
          </Link>

          <div
            className="w-6 h-6 p-[2px] rounded-full flex items-center justify-center text-2xl hover:bg-gray-800 cursor-pointer"
            onClick={() => settheme && settheme(!theme)}
          >
            {theme ? <FiSun /> : <AiOutlineMoon />}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div
            title="Feedback"
            className="w-7 h-7 text-sm flex justify-center items-center rounded-full p-[1px] hover:bg-green-700 cursor-pointer"
          >
            <VscFeedback />
          </div>

          <div title="Website" className="w-7 h-7 text-xl flex justify-center items-center rounded-full">
            <a href="https://marktube.netlify.app/" target="_blank" rel="noopener noreferrer">
              <img
                src="https://res.cloudinary.com/ymatt/image/upload/v1763563209/logo_n4glcq.png"
                onError={(e) => {
                  e.target.src = logo;
                }}
                alt="MarkTube Logo"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
