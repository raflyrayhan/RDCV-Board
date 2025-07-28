// app/components/TabNavigation.tsx
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    showSection?: (section: string) => void;
  }
}

export default function TabNavigation() {
  useEffect(() => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        const section = (e.currentTarget as HTMLElement).dataset.section!;
        window.showSection?.(section);
      });
    });
  }, []);

  return (
    <div className="nav-tabs">
      <a href="#" className="nav-link active" data-section="dashboard">
        <i className="bi bi-bar-chart-line"></i> General
      </a>
      <a href="#" className="nav-link" data-section="pm">
        <i className="bi bi-diagram-3-fill"></i> PMT
      </a>
      <a href="#" className="nav-link" data-section="eng">
        <i className="bi bi-gear-wide-connected"></i> Engineering
      </a>
      <a href="#" className="nav-link" data-section="proc">
        <i className="bi bi-bag-check"></i> Procurement
      </a>
      <a href="#" className="nav-link" data-section="fab">
        <i className="bi bi-building"></i> Fabrication
      </a>
      <a href="#" className="nav-link" data-section="const">
        <i className="bi bi-tools"></i> Construction
      </a>
      <a href="#" className="nav-link" data-section="upload">
        <i className="bi bi-cloud-arrow-up-fill"></i> Upload
      </a>
    </div>
  );
}
