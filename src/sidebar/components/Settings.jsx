import React, { useState, useRef } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { MdOutlineSdStorage, MdPalette, MdOutlineNotifications, MdOutlineColorLens } from 'react-icons/md';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { importLibrary, exportLibrary } from '../utils/exportImport';

const Settings = () => {
  const [openSection, setOpenSection] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('Processing backup...');
    try {
      const res = await importLibrary(file, (progress) => {
        setImportStatus(`Importing... ${Math.round(progress)}%`);
      });
      setImportStatus(`✅ Synced ${res.syncedVideoCount} videos!`);
      setTimeout(() => setImportStatus(''), 8000);
    } catch (err) {
      console.error('Import failed:', err);
      setImportStatus('❌ Import failed');
      setTimeout(() => setImportStatus(''), 8000);
    }
    e.target.value = '';
  };

  return (
    <div className="p-4 w-full flex flex-col gap-3 items-center myScrollArea overflow-y-auto">
      {/* Profile Section - Untouched as requested */}
      <div id="profile" className="bg-emerald-700/50 w-full h-25 flex items-center justify-between px-8 rounded-2xl">
        <div className="flex gap-4 items-center">
          <img
            className="bg-white rounded-full h-18 w-18 object-cover"
            src="https://res.cloudinary.com/ymatt/image/upload/v1763563264/Designer_uptxpr.jpg"
            alt="User Avatar"
          />
          <div>
            <div className="font-semibold text-lg mt-1">Yash Mehta</div>
            <div className="text-gray-400 text-sm mb-2">user@email.com</div>
          </div>
        </div>
        <Link to="/login">
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium shadow hover:bg-emerald-100/90 transition cursor-pointer">
            Login
          </button>
        </Link>
      </div>

      {/* Accordion Controls Container */}
      <div className="w-full flex flex-col gap-3">
        {/* Data Control Accordion */}
        <div className="w-full bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-300">
          <div
            onClick={() => handleToggle('DC')}
            className="flex h-14 w-full px-5 items-center justify-between hover:bg-gray-800/40 cursor-pointer select-none transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
                <MdOutlineSdStorage className="text-xl" />
              </div>
              <h1 className="font-semibold text-sm tracking-wide text-gray-200">Data Control</h1>
            </div>
            <IoIosArrowForward
              className={`text-gray-400 transition-transform duration-300 text-lg ${
                openSection === 'DC' ? 'rotate-90 text-emerald-400' : ''
              }`}
            />
          </div>

          {openSection === 'DC' && (
            <div className="p-4 pt-2 border-t border-gray-800/50 flex flex-col gap-2 bg-gray-950/40">
              <div className="flex h-12 px-3 justify-between items-center hover:bg-gray-800/30 rounded-xl transition-colors">
                <div className="flex items-center gap-2">
                  <FiDownload className="text-emerald-400 text-sm" />
                  <span className="text-xs font-medium text-gray-300">Download Data Backup</span>
                </div>
                <button
                  onClick={exportLibrary}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-700/50 rounded-xl text-xs font-medium cursor-pointer active:scale-95 transition-all"
                >
                  Download
                </button>
              </div>

              <div className="flex h-12 px-3 justify-between items-center hover:bg-gray-800/30 rounded-xl transition-colors">
                <div className="flex items-center gap-2">
                  <FiUpload className="text-emerald-400 text-sm" />
                  <span className="text-xs font-medium text-gray-300">Import Data Backup</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-700/50 rounded-xl text-xs font-medium cursor-pointer active:scale-95 transition-all"
                >
                  Import
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>

              {importStatus && (
                <div className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-xl font-medium animate-pulse flex items-center gap-2">
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="flex h-12 px-3 justify-between items-center hover:bg-red-950/20 rounded-xl transition-colors">
                <span className="text-xs font-medium text-gray-400">Delete Local Storage</span>
                <button className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900/80 text-red-400 border border-red-800/50 rounded-xl text-xs font-medium cursor-pointer active:scale-95 transition-all">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Look Control Accordion */}
        <div className="w-full bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-300">
          <div
            onClick={() => handleToggle('Look')}
            className="flex h-14 w-full px-5 items-center justify-between hover:bg-gray-800/40 cursor-pointer select-none transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
                <MdPalette className="text-xl" />
              </div>
              <h1 className="font-semibold text-sm tracking-wide text-gray-200">Look Control</h1>
            </div>
            <IoIosArrowForward
              className={`text-gray-400 transition-transform duration-300 text-lg ${
                openSection === 'Look' ? 'rotate-90 text-emerald-400' : ''
              }`}
            />
          </div>

          {openSection === 'Look' && (
            <div className="p-4 pt-3 border-t border-gray-800/50 flex flex-col gap-3 bg-gray-950/40">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-gray-300 font-medium">Sidebar Width</span>
                <input
                  type="range"
                  min="200"
                  max="500"
                  className="w-36 accent-emerald-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
                />
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-gray-300 font-medium">Font Size</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  className="w-36 accent-emerald-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Theme Control Accordion */}
        <div className="w-full bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-300">
          <div
            onClick={() => handleToggle('Theme')}
            className="flex h-14 w-full px-5 items-center justify-between hover:bg-gray-800/40 cursor-pointer select-none transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
                <MdOutlineColorLens className="text-xl" />
              </div>
              <h1 className="font-semibold text-sm tracking-wide text-gray-200">Theme Control</h1>
            </div>
            <IoIosArrowForward
              className={`text-gray-400 transition-transform duration-300 text-lg ${
                openSection === 'Theme' ? 'rotate-90 text-emerald-400' : ''
              }`}
            />
          </div>

          {openSection === 'Theme' && (
            <div className="p-4 pt-3 border-t border-gray-800/50 bg-gray-950/40">
              <div className="flex gap-3 justify-center">
                <button className="px-4 py-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                  Dark
                </button>
                <button className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                  Light
                </button>
                <button className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                  System
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Control Accordion */}
        <div className="w-full bg-gray-900/60 border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-300">
          <div
            onClick={() => handleToggle('Notif')}
            className="flex h-14 w-full px-5 items-center justify-between hover:bg-gray-800/40 cursor-pointer select-none transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
                <MdOutlineNotifications className="text-xl" />
              </div>
              <h1 className="font-semibold text-sm tracking-wide text-gray-200">Notification Control</h1>
            </div>
            <IoIosArrowForward
              className={`text-gray-400 transition-transform duration-300 text-lg ${
                openSection === 'Notif' ? 'rotate-90 text-emerald-400' : ''
              }`}
            />
          </div>

          {openSection === 'Notif' && (
            <div className="p-4 pt-3 border-t border-gray-800/50 flex flex-col gap-3 bg-gray-950/40">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-gray-300 font-medium">Email Alerts</span>
                <input type="checkbox" className="w-4 h-4 accent-emerald-500 cursor-pointer rounded" />
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-gray-300 font-medium">Push Notifications</span>
                <input type="checkbox" className="w-4 h-4 accent-emerald-500 cursor-pointer rounded" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
