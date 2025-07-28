'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TabNavigation from '@/components/TabNavigation';
import DashboardContent from '@/components/DashboardContent';
import LogoutButton from '@/components/LogoutButton';

declare global {
  interface Window {
    gisLoaded?: () => void;
    gapiLoaded?: () => void;
  }
}

export default function HomePage() {
  useEffect(() => {
    // Inject Google Identity Services
    const gis = document.createElement('script');
    gis.src = 'https://accounts.google.com/gsi/client';
    gis.async = true;
    gis.defer = true;
    gis.onload = () => window.gisLoaded?.();
    document.body.appendChild(gis);

    // Inject Google API JS
    const gapi = document.createElement('script');
    gapi.src = 'https://apis.google.com/js/api.js';
    gapi.async = true;
    gapi.defer = true;
    gapi.onload = () => window.gapiLoaded?.();
    document.body.appendChild(gapi);

    // Inject your original logic
    const local = document.createElement('script');
    local.src = '/script.js';
    local.async = true;
    document.body.appendChild(local);
  }, []);

  return (
    <>
      <Navbar />
      <TabNavigation />
      <DashboardContent />
      <LogoutButton/>
    </>
  );
}
