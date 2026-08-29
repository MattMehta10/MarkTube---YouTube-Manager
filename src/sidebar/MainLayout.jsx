import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

const MainLayout = () => {
  return (
    <div className="bg-[#030712] border-r border-slate-800/80 relative overflow-hidden text-white w-full h-screen flex flex-col justify-between">
      <Nav />
      <div className="flex-1 overflow-y-auto pb-12">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
