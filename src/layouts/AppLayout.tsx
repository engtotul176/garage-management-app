import React, { useState } from 'react';
import { HeaderShell } from '../components/common/HeaderShell';
import { SidebarShell } from '../components/common/SidebarShell';
import { FooterShell } from '../components/common/FooterShell';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <HeaderShell />
      
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <SidebarShell activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <FooterShell />
    </div>
  );
};
