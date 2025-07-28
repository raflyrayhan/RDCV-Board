'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import Image from 'next/image';

//
// 1) Tell TS about our global GoogleDrive API
//
declare global {
  interface Window {
    GoogleDrive?: {
      isReady: boolean;
      isAuthorized: boolean;
      user: { name: string; email: string } | null;
      requestAuth: () => void;
      onSignIn: (cb: (user: { name: string; email: string }) => void) => void;
      onAuthorize: (cb: () => void) => void;
      uploadFile: (file: File) => Promise<{
        id: string;
        name: string;
        webViewLink: string;
      }>;
      listFiles: () => Promise<
        Array<{
          id: string;
          name: string;
          webViewLink: string;
          iconLink: string;
        }>
      >;
    };
  }
}

type DriveFile = {
  id: string;
  name: string;
  webViewLink: string;
  iconLink: string;
};

export default function DrivePortal() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 2) Wire up One‑Tap sign‑in + Drive‑authorize callbacks
  useEffect(() => {
    const GD = window.GoogleDrive;
    if (!GD) {
      console.warn('GoogleDrive script not loaded yet');
      return;
    }

    // When the user successfully signs in via One‑Tap:
    GD.onSignIn((u) => {
      setUser({ name: u.name, email: u.email });
    });

    // When OAuth2 Drive consent is granted:
    GD.onAuthorize(() => {
      setAuthorized(true);
      // Immediately fetch and display any existing files:
      GD.listFiles().then(setFiles).catch(console.error);
    });
  }, []);

  // 3) File‑upload handler
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const GD = window.GoogleDrive;
    if (!GD) {
      setStatus('❌ GoogleDrive belum siap.');
      return;
    }

    const fileList = inputRef.current?.files;
    if (!fileList) return;

    Array.from(fileList).forEach((file) => {
      if (file.size > 100 * 1024 * 1024) {
        setStatus('❌ Maks 100MB per file');
        return;
      }
      GD.uploadFile(file)
        .then((f) => {
          setStatus(`✅ Upload sukses: ${f.name}`);
          return GD.listFiles();
        })
        .then(setFiles)
        .catch(() => setStatus('❌ Upload gagal'));
    });
  }

  return (
    <section className="upload-section">
      {/* THIS DIV is auto‑rendered by script.js’s MutationObserver */}
      <div id="g_id_onload" />

      {/* Show the “Authorize Drive” button once One‑Tap sign‑in has happened */}
      {user && !authorized && (
        <>
          <button
            className="upload-btn"
            onClick={() => window.GoogleDrive?.requestAuth()}
          >
            Authorize Google Drive
          </button>
          <p style={{ margin: '8px 0', color: '#555' }}>
            Halo, <strong>{user.name}</strong>
          </p>
        </>
      )}

      {/* Once authorized, show the file‑picker form */}
      {authorized && (
        <form className="upload-form" onSubmit={handleSubmit}>
          <input type="file" ref={inputRef} className="upload-input" multiple />
          <button type="submit" className="upload-btn">
            Upload
          </button>
        </form>
      )}

      {/* Display status messages */}
      {status && <p className="upload-status">{status}</p>}

      {/* And finally the gallery */}
      {authorized && (
        <div className="gallery-grid">
          {files.length > 0 ? (
            files.map((f) => (
              <div key={f.id} className="gallery-card">
                <Image src={f.iconLink} alt={f.name} width={120} height={80} />
                <div className="filename">{f.name}</div>
                <a
                  href={f.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <p className="empty">Folder masih kosong</p>
          )}
        </div>
      )}
    </section>
  );
}
