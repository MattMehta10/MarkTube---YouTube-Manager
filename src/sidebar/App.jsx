import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Wrapper from './Wrapper.jsx';

// Ported components land here as they're migrated — see docs/MIGRATION.md
// import Nav from './components/Nav.jsx';
// import Footer from './components/Footer.jsx';
// import Stats from './components/Stats.jsx';
// import VideoCont from './components/VideoCont.jsx';
// import Library from './components/Library.jsx';
// import Settings from './components/Settings.jsx';
// import Login from './components/Login.jsx';
// import Notify from './components/Notify.jsx';

import { useContext } from 'react';
import { MTContext } from './Wrapper.jsx';

import MainLayout from './MainLayout';

function OverviewPlaceholder() {
  const context = useContext(MTContext) || {};
  const { watchCount = 0, impCount = 0, pendingCount = 0 } = context;

  return (
    <div style={{ padding: '20px', color: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></div>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>MarkTube Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4ade80' }}>{watchCount}</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Watched</div>
        </div>
        <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#facc15' }}>{impCount}</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Important</div>
        </div>
        <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>{pendingCount}</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>To Watch</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Wrapper>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<OverviewPlaceholder />} />
            <Route path="/library" element={<div className="p-4 text-slate-300">Library view...</div>} />
            <Route path="/setting" element={<div className="p-4 text-slate-300">Settings view...</div>} />
            <Route path="/login" element={<div className="p-4 text-slate-300">Login view...</div>} />
          </Route>
        </Routes>
      </HashRouter>
      <ToastContainer position="bottom-right" theme="dark" />
    </Wrapper>
  );
}
