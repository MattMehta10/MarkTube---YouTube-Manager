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

  return (
    <div className="absolute bottom-0 w-full z-40">
      <div className="h-10 w-full flex justify-between items-center px-4 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/">
            <div
              className={`w-7 h-7 text-lg flex justify-center items-center rounded-full transition ${
                loc.pathname === '/'
                  ? 'bg-emerald-600/30 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Home"
            >
              <MdHome />
            </div>
          </Link>

          <Link to="/setting">
            <div
              className={`w-7 h-7 text-lg flex justify-center items-center rounded-full transition ${
                loc.pathname === '/setting'
                  ? 'bg-emerald-600/30 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Settings"
            >
              <MdSettings />
            </div>
          </Link>

          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            onClick={() => settheme && settheme(!theme)}
            title="Toggle Theme"
          >
            {theme ? <FiSun className="text-amber-400" /> : <AiOutlineMoon className="text-sky-400" />}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/MattMehta10/MarkTube---YouTube-Manager/issues"
            target="_blank"
            rel="noopener noreferrer"
            title="Feedback & Issues"
            className="w-7 h-7 text-slate-400 hover:text-white hover:bg-slate-800 flex justify-center items-center rounded-full transition"
          >
            <VscFeedback className="text-base" />
          </a>

          <a
            href="https://marktube.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            title="MarkTube Website"
            className="w-6 h-6 flex justify-center items-center rounded-full overflow-hidden hover:opacity-80 transition"
          >
            <img src={getExtURL('logo.png')} alt="MarkTube Logo" className="w-full h-full object-contain" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
