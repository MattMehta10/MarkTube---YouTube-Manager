import React, { createContext, useCallback, useEffect, useState } from 'react';
import { db } from './utils/pouch.js';

import Notification from './components/Notify';

export const MTContext = createContext(null);

export default function Wrapper({ children }) {
  const [theme, settheme] = useState(true);
  const [watched, setWatched] = useState([]);
  const [important, setImportant] = useState([]);
  const [toWatch, setToWatch] = useState([]);
  const [watchCount, setWatchCount] = useState(0);
  const [impCount, setImpCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [Notifshow, setNotifshow] = useState(false);
  const [Libstatus, setLibstatus] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await db.allDocs({ include_docs: true });
      const docs = res.rows
        .map((r) => r.doc)
        .filter((d) => d && d._id && !d._id.startsWith('_design/'));

      const w = docs.filter((d) => d.type === 'watched');
      const i = docs.filter((d) => d.type === 'important');
      const t = docs.filter((d) => d.type === 'toWatch');

      setWatched(w);
      setImportant(i);
      setToWatch(t);
      setWatchCount(w.length);
      setImpCount(i.length);
      setPendingCount(t.length);
    } catch (err) {
      console.error('[MarkTube] Failed to fetch stats from PouchDB:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <MTContext.Provider
      value={{
        theme,
        settheme,
        watched,
        important,
        toWatch,
        watchCount,
        impCount,
        pendingCount,
        fetchStats,
        Notifshow,
        setNotifshow,
        Libstatus,
        setLibstatus,
      }}
    >
      <Notification />
      {children}
    </MTContext.Provider>
  );
}
