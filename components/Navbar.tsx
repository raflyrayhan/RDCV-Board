// app/components/Navbar.tsx
import React from 'react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="left">
        <Image className="logo-img" src="/KPI.png" alt="Pertamina Logo" width={120} height={150} />
      </div>
      <div className="project-title">
        REVAMPING KAPASITAS DESALTER SYSTEM CDU V
        <span>Refinery Unit V Balikpapan</span>
      </div>
        <div className="right">
        <Image className="logo-img" src="/timas.png" alt="Timas Logo" width={80} height={80} />
      </div>
    </div>
  );
}
