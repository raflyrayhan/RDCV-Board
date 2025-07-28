// app/components/DashboardContent.tsx
'use client';

import React from 'react';

export type DashboardContentProps = {
  title: string;
  desc: string;
};

export default function DashboardContent({ title, desc }: DashboardContentProps) {
  return (
    <div className="main-content">
      <div className="main-header">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{desc}</p>
      </div>

      {/* Contoh grid card untuk ringkasan KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-medium">Project Progress</h2>
          <p className="text-sm text-gray-500">75% complete</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-medium">Budget Utilization</h2>
          <p className="text-sm text-gray-500">$120,000 / $150,000</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-medium">Upcoming Milestones</h2>
          <p className="text-sm text-gray-500">Kick-off Review on 2025-08-01</p>
        </div>
      </div>
    </div>
);
}
