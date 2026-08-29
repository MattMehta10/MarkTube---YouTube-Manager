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

function Overview() {
  const context = useContext(MTContext) || {};
  const { watchCount = 0, impCount = 0, pendingCount = 0 } = context;

  return (
    <div style={{ padding: '24px', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></div>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>MarkTube Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80' }}>{watchCount}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Watched</div>
        </div>
        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#facc15' }}>{impCount}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Important</div>
        </div>
        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>{pendingCount}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>To Watch</div>
        </div>
      </div>

      <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', marginTop: 0, marginBottom: '8px' }}>🚀 How to use MarkTube:</h3>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
          <li>Hover over any video thumbnail on YouTube feed or search.</li>
          <li>Click <strong>Watched</strong>, <strong>Important</strong>, or <strong>Want to Watch</strong>.</li>
          <li>Your saved videos and stats will automatically sync here!</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Wrapper>
      <HashRouter>
        <div className="w-full h-screen bg-[#0b0f14] relative overflow-y-auto">
          {/* <Nav /> */}
          {/* <Notify /> */}
          <Routes>
            <Route path="/" element={<Overview />} />
            {/* <Route path="/library" element={<Library />} /> */}
            {/* <Route path="/setting" element={<Settings />} /> */}
            {/* <Route path="/login" element={<Login />} /> */}
          </Routes>
          {/* <Footer /> */}
        </div>
      </HashRouter>
      <ToastContainer position="bottom-right" theme="dark" />
    </Wrapper>
  );
}
