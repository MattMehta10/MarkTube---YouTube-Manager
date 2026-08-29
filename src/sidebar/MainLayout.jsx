import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

const MainLayout = () => {
  return (
    <div className="bg-[#030712] border-r-2 border-gray-600 relative overflow-hidden text-white min-w-[500px] max-w-[500px] h-screen">
      <Nav />
      <div className="h-[calc(100vh-90px)] overflow-y-auto pb-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
