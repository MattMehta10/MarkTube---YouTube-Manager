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

import Stats from './components/Stats';
import VideoCont from './components/VideoCont';
import Library from './components/Library';
import Settings from './components/Settings';
import Login from './components/Login';

function DashboardHome() {
  return (
    <div className="w-full flex flex-col gap-2 pb-6">
      <Stats />
      <VideoCont />
    </div>
  );
}

export default function App() {
  return (
    <Wrapper>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/library" element={<Library />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </HashRouter>
      <ToastContainer position="bottom-right" theme="dark" />
    </Wrapper>
  );
}
