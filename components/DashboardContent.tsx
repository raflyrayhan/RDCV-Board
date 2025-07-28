// app/components/DashboardContent.tsx
import React from 'react';

export default function DashboardContent() {
  return (
    <div className="main-content">
      <div className="main-header">
        <h1 id="main-title">General Dashboard</h1>
        <p id="main-desc">
          Monitoring utama proyek, menampilkan overview performa dan status terkini seluruh aspek proyek.
        </p>
      </div>

      <section id="section-content" className="content-section">
        <div
          className="upload-drive-wrapper"
          id="upload-drive-wrapper"
          style={{ display: 'none' }}
        >
          <div id="google-auth-box" className="upload-box">
            <div
              id="g_id_onload"
              data-client_id="415024272495-aj7r5hsucotnvjmft71maqoevcugq8r2.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-callback="onGoogleSignIn"
              data-auto_prompt="false"
            ></div>
            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
            ></div>

            <button id="authorize_button" className="upload-btn" style={{ display: 'none' }}>
              Authorize Google Drive
            </button>
            <span id="user"></span>

            <form id="uploadForm" style={{ display: 'none' }}>
              <input type="file" id="fileInput" multiple />
              <button className="upload-btn" type="submit">
                <i className="bi bi-cloud-arrow-up-fill"></i> Upload
              </button>
            </form>
            <div id="uploadStatus"></div>
          </div>

          <div className="gallery-box" id="gallery-section">
            <h3>Folder Content</h3>
            <div id="galleryDrive"></div>
          </div>
        </div>

        <div className="iframe-container" id="iframe-container" style={{ display: 'none' }}>
          <iframe
            id="main-iframe"
            src=""
            allowFullScreen
            style={{ display: 'block' }}
          ></iframe>
        </div>
      </section>
    </div>
  );
}
