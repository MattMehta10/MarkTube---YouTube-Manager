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

function Overview() {
  return (
    <div className="p-6 text-white">
      <p>Overview placeholder — port Stats.jsx and VideoCont.jsx here (see docs/MIGRATION.md).</p>
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
