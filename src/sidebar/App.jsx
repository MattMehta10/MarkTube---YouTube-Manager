import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Wrapper from './Wrapper.jsx';
import MainLayout from './MainLayout';
import Stats from './components/Stats';
import VideoCont from './components/VideoCont';
import Library from './components/Library';
import Settings from './components/Settings';
import Login from './components/Login';
import Notification from './components/Notify';

function DashboardHome() {
  return (
    <div className="p-3 flex flex-col gap-3 items-center justify-start h-full overflow-hidden">
      <Stats />
      <VideoCont />
    </div>
  );
}

const SafeToastContainer = typeof ToastContainer === 'function' ? ToastContainer : (ToastContainer?.default || ToastContainer);

export default function App() {
  return (
    <HashRouter>
      <Wrapper>
        <Notification />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/library" element={<Library />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Wrapper>
      {typeof SafeToastContainer === 'function' && <SafeToastContainer position="bottom-right" theme="dark" />}
    </HashRouter>
  );
}
