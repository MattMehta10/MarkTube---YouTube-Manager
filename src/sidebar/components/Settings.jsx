import React, { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { db } from '../utils/pouch';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [openSection, setOpenSection] = useState(null);

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  async function exportData() {
    let finalData = {
      watched: [],
      important: [],
      toWatch: [],
    };

    const allDocs = await db.allDocs({ include_docs: true });

    allDocs.rows.forEach((row) => {
      const doc = row.doc;
      if (doc.type === 'watched') finalData.watched.push(doc);
      else if (doc.type === 'important') finalData.important.push(doc);
      else if (doc.type === 'toWatch') finalData.toWatch.push(doc);
    });

    const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marktube_backup_${Date.now()}.json`;
    a.click();
  }

  return (
    <div className="p-6 flex flex-col gap-3 items-center">
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

      {/* Data Control */}
      <div
        className={`${
          openSection === 'DC' ? 'h-45 items-start' : 'h-15'
        } transition-all duration-300 datacontrol relative border-2 border-gray-500/30 w-112 overflow-hidden whitespace-pre-wrap aspect-video flex gap-5 py-5 rounded-2xl`}
      >
        <div
          onClick={() => handleToggle('DC')}
          className="flex h-15 absolute top-0 left-0 justify-between w-112 p-5 items-center hover:bg-gray-400/10 rounded-t-2xl cursor-pointer"
        >
          <h1>Data Control</h1>
          <IoIosArrowForward
            className={`${openSection === 'DC' ? 'rotate-90' : ''} transition-transform duration-300 origin-center`}
          />
        </div>
        {openSection === 'DC' && (
          <div className="pt-10">
            <div className="flex h-15 p-5 justify-between w-112 items-center hover:bg-gray-400/10 rounded-2xl">
              <h1>Download Data</h1>
              <button onClick={exportData} className="px-3 py-1 cursor-pointer border active:scale-95 rounded-lg">
                Download
              </button>
            </div>
            <div className="flex h-15 p-5 justify-between w-112 items-center hover:bg-gray-400/10 rounded-2xl">
              <span>Delete Account</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Look Control */}
      <div
        className={`${
          openSection === 'Look' ? 'h-45 items-start' : 'h-15'
        } transition-all duration-300 datacontrol relative border-2 border-gray-500/30 overflow-hidden w-112 whitespace-pre-wrap aspect-video flex gap-5 p-5 rounded-2xl`}
      >
        <div
          onClick={() => handleToggle('Look')}
          className="flex h-15 absolute top-0 left-0 justify-between w-112 p-5 items-center hover:bg-gray-400/10 rounded-t-2xl cursor-pointer"
        >
          <h1>Look Control</h1>
          <IoIosArrowForward
            className={`${openSection === 'Look' ? 'rotate-90' : ''} transition-transform duration-300 origin-center`}
          />
        </div>
        {openSection === 'Look' && (
          <div className="pt-10">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span>Sidebar Width</span>
                <input type="range" min="200" max="500" className="w-32" />
              </div>
              <div className="flex justify-between items-center">
                <span>Font Size</span>
                <input type="range" min="12" max="24" className="w-32" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theme Control */}
      <div
        className={`${
          openSection === 'Theme' ? 'h-45 items-start' : 'h-15'
        } transition-all duration-300 datacontrol relative border-2 border-gray-500/30 overflow-hidden w-112 whitespace-pre-wrap aspect-video flex gap-5 p-5 rounded-2xl`}
      >
        <div
          onClick={() => handleToggle('Theme')}
          className="flex h-15 absolute top-0 left-0 justify-between w-112 p-5 items-center hover:bg-gray-400/10 rounded-t-2xl cursor-pointer"
        >
          <h1>Theme Control</h1>
          <IoIosArrowForward
            className={`${openSection === 'Theme' ? 'rotate-90' : ''} transition-transform duration-300 origin-center`}
          />
        </div>
        {openSection === 'Theme' && (
          <div className="pt-10">
            <div className="flex gap-5">
              <button className="bg-gray-800 text-white p-2 rounded-2xl cursor-pointer">Dark</button>
              <button className="bg-white text-black p-2 rounded-2xl border cursor-pointer">Light</button>
              <button className="bg-blue-200 text-blue-900 p-2 rounded-2xl cursor-pointer">System</button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Control */}
      <div
        className={`${
          openSection === 'Notif' ? 'h-45 items-start' : 'h-15'
        } transition-all duration-300 datacontrol relative border-2 border-gray-500/30 overflow-hidden w-112 whitespace-pre-wrap aspect-video flex gap-5 p-5 rounded-2xl`}
      >
        <div
          onClick={() => handleToggle('Notif')}
          className="flex h-15 absolute top-0 left-0 justify-between w-112 p-5 items-center hover:bg-gray-400/10 rounded-t-2xl cursor-pointer"
        >
          <h1>Notification Control</h1>
          <IoIosArrowForward
            className={`${openSection === 'Notif' ? 'rotate-90' : ''} transition-transform duration-300 origin-center`}
          />
        </div>
        {openSection === 'Notif' && (
          <div className="pt-10">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span>Email Alerts</span>
                <input type="checkbox" />
              </div>
              <div className="flex justify-between items-center">
                <span>Push Notifications</span>
                <input type="checkbox" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
