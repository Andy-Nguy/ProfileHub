import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideNav';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content - Outlet will render the specific page */}
      <Outlet />
    </div>
  );
};
