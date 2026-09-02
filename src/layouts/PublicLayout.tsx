import React from 'react';
import { Outlet } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
