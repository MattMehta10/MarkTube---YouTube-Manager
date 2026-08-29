import React, { useContext, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { db } from '../utils/pouch';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getExtURL } from '../utils/asset';
import { MTContext } from '../Wrapper';

const Settings = () => {
  const [openSection, setOpenSection] = useState(null);
  const context = useContext(MTContext) || {};
  const { fetchStats, theme, settheme } = context;

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const exportData = async () => {
    try {
      const finalData = {
        watched: [],
        important: [],
        toWatch: [],
        exportedAt: new Date().toISOString(),
      };

      const allDocs = await db.allDocs({ include_docs: true });

      allDocs.rows.forEach((row) => {
        const doc = row.doc;
        if (!doc || doc._id?.startsWith('_design/')) return;
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
      URL.revokeObjectURL(url);

      toast.success('📥 MarkTube backup downloaded successfully');
    } catch (err) {
      toast.error('❌ Failed to export data');
      console.error('[MarkTube] Export error:', err);
    }
  };

  const handleClearDatabase = async () => {
    if (window.confirm('⚠️ Are you sure you want to clear all saved videos? This cannot be undone.')) {
      try {
        const allDocs = await db.allDocs({ include_docs: true });
        const deleteOps = allDocs.rows
          .map((r) => r.doc)
          .filter((d) => d && d._id && !d._id.startsWith('_design/'))
          .map((d) => ({ ...d, _deleted: true }));

        await db.bulkDocs(deleteOps);
        if (fetchStats) fetchStats();
        toast.success('🗑️ Database cleared successfully');
      } catch (err) {
        toast.error('❌ Failed to clear database');
      }
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3.5 items-center w-full">
      {/* Profile Header */}
      <div className="bg-slate-900/80 border border-slate-800 w-full p-4 flex items-center justify-between rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-base">
            YM
          </div>
          <div>
            <div className="font-semibold text-slate-100 text-sm">Yash Mehta</div>
            <div className="text-slate-400 text-xs">user@marktube.local</div>
          </div>
        </div>
        <Link to="/login">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition">
            Account
          </button>
        </Link>
      </div>

      {/* Data Control */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all">
        <div
          onClick={() => handleToggle('DC')}
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-800/50 transition"
        >
          <span className="text-sm font-medium text-slate-200">💾 Data Control & Backup</span>
          <IoIosArrowForward
            className={`text-slate-400 text-base transition-transform duration-300 ${
              openSection === 'DC' ? 'rotate-90' : ''
            }`}
          />
        </div>
        {openSection === 'DC' && (
          <div className="p-4 pt-0 border-t border-slate-800/60 flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-300">Export Library (JSON)</span>
              <button
                onClick={exportData}
                className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-lg hover:bg-emerald-600/30 transition font-medium"
              >
                Download Backup
              </button>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-300">Reset Local Database</span>
              <button
                onClick={handleClearDatabase}
                className="px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-600/30 transition font-medium"
              >
                Clear Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Look & Preferences */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all">
        <div
          onClick={() => handleToggle('Look')}
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-800/50 transition"
        >
          <span className="text-sm font-medium text-slate-200">🎨 Appearance & Theme</span>
          <IoIosArrowForward
            className={`text-slate-400 text-base transition-transform duration-300 ${
              openSection === 'Look' ? 'rotate-90' : ''
            }`}
          />
        </div>
        {openSection === 'Look' && (
          <div className="p-4 pt-0 border-t border-slate-800/60 flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-300">Theme Preference</span>
              <div className="flex gap-2">
                <button
                  onClick={() => settheme && settheme(true)}
                  className={`px-3 py-1 rounded-lg border text-xs transition ${
                    theme
                      ? 'bg-slate-700 text-white border-slate-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Dark Mode
                </button>
                <button
                  onClick={() => settheme && settheme(false)}
                  className={`px-3 py-1 rounded-lg border text-xs transition ${
                    !theme
                      ? 'bg-slate-700 text-white border-slate-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Light Mode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all">
        <div
          onClick={() => handleToggle('Notif')}
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-800/50 transition"
        >
          <span className="text-sm font-medium text-slate-200">🔔 Notifications & Sync</span>
          <IoIosArrowForward
            className={`text-slate-400 text-base transition-transform duration-300 ${
              openSection === 'Notif' ? 'rotate-90' : ''
            }`}
          />
        </div>
        {openSection === 'Notif' && (
          <div className="p-4 pt-0 border-t border-slate-800/60 flex flex-col gap-2.5 text-xs text-slate-300">
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span>Show Toast Alerts on DB updates</span>
              <input type="checkbox" defaultChecked className="accent-emerald-500 rounded" />
            </label>
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span>Live YouTube SPA Sync</span>
              <input type="checkbox" defaultChecked className="accent-emerald-500 rounded" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
