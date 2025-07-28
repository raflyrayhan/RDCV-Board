// components/TabNavigation.tsx
'use client';

import React from 'react';

// Tipe untuk key tiap tab
export type SectionKey =
  | 'dashboard'
  | 'pm'
  | 'eng'
  | 'proc'
  | 'fab'
  | 'const'
  | 'upload';

interface TabNavigationProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}

// Daftar tab dan label-nya
const tabs: { key: SectionKey; label: string }[] = [
  { key: 'dashboard', label: 'General' },
  { key: 'pm',        label: 'PMT' },
  { key: 'eng',       label: 'Engineering' },
  { key: 'proc',      label: 'Procurement' },
  { key: 'fab',       label: 'Fabrication' },
  { key: 'const',     label: 'Construction' },
  { key: 'upload',    label: 'Upload' },
];

export default function TabNavigation({
  activeSection,
  onSectionChange,
}: TabNavigationProps) {
  return (
    <div className="nav-tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`nav-link ${activeSection === tab.key ? 'active' : ''}`}
          onClick={() => onSectionChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
