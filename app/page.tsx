'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TabNavigation, { SectionKey } from '@/components/TabNavigation';
import DashboardContent from '@/components/DashboardContent';
import DrivePortal from '@/components/DrivePortal';
import LogoutButton from '@/components/LogoutButton';

const iframeSrc: Record<SectionKey, string | null> = {
  dashboard: "https://lookerstudio.google.com/embed/reporting/6eeec8b8-2588-4eb2-bcdb-e65cb694c099/page/Gv9RF",
  pm:        "#",
  eng:       "https://lookerstudio.google.com/embed/reporting/5e76502a-6be8-4101-88ed-4969c4fe601d/page/p_bgo2oj7mud",
  proc:      "#",
  fab:       "#",
  const:     "#",
  upload:    null,
};

const sectionTitle: Record<SectionKey, string> = {
  dashboard: "General Dashboard",
  pm:        "PMT Dashboard",
  eng:       "Engineering Dashboard",
  proc:      "Procurement Dashboard",
  fab:       "Fabrication Dashboard",
  const:     "Construction Dashboard",
  upload:    "Upload Progress Report",
};

const sectionDesc: Record<SectionKey, string> = {
  dashboard: "Monitoring utama proyek, menampilkan overview performa dan status terkini seluruh aspek proyek.",
  pm:        "Modul manajemen proyek, tim, tugas, dan milestone.",
  eng:       "Modul engineering, drawing, perhitungan, dan approval desain.",
  proc:      "Modul pengadaan barang/jasa, status PO, dan vendor.",
  fab:       "Modul fabrikasi dan status pengerjaan peralatan.",
  const:     "Modul konstruksi di lapangan, progres harian, dan isu.",
  upload:    "Upload laporan progress harian/mingguan/bulanan proyek, semua format file didukung (maks 100MB per file).",
};

export default function HomePage() {
  const [section, setSection] = useState<SectionKey>('dashboard');

  return (
    <>
      <Navbar />

      {/* Tab bar */}
      <TabNavigation activeSection={section} onSectionChange={setSection} />

      {/* Judul & deskripsi */}
      <div className="main-header">
        <h1 className="project-title">{sectionTitle[section]}</h1>
        <p>{sectionDesc[section]}</p>
      </div>

      {/* Konten utama */}
      <div className="main-content">
        {/* Dashboard */}
        {section === 'dashboard' && (
          <DashboardContent
            title={sectionTitle.dashboard}
            desc={sectionDesc.dashboard}
          />
        )}

        {/* Looker iframe untuk semua kecuali dashboard & upload */}
        {section !== 'dashboard' && section !== 'upload' && iframeSrc[section] && (
          <div className="iframe-container">
            <iframe
              src={iframeSrc[section]!}
              allowFullScreen
            />
          </div>
        )}

        {/* Upload section */}
        {section === 'upload' && (
          <section className="upload-section">
            <DrivePortal />
          </section>
        )}
      </div>

      <LogoutButton />
    </>
  );
}
