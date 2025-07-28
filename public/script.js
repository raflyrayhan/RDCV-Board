// --- GOOGLE CONFIG ---
const CLIENT_ID = '415024272495-aj7r5hsucotnvjmft71maqoevcugq8r2.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCPHPQ7wC6B-GjBodrIQgsFfq23NTZcx1c';
const FOLDER_ID = '1RhUknY7hxcOGNzjADk02mxy9W0M2ScHo';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// --- SECTION CONTROL ---
const iframeSrc = {
  dashboard: "https://lookerstudio.google.com/embed/reporting/6eeec8b8-2588-4eb2-bcdb-e65cb694c099/page/Gv9RF",
  pm: "#",
  eng: "https://lookerstudio.google.com/embed/reporting/5e76502a-6be8-4101-88ed-4969c4fe601d/page/p_bgo2oj7mud",
  proc: "#",
  fab: "#",
  const: "#"
};

const sectionTitle = {
  dashboard: "General",
  pm: "Project Management",
  eng: "Engineering",
  proc: "Procurement",
  fab: "Fabrication",
  const: "Construction",
  upload: "Upload Progress Report"
};

const sectionDesc = {
  dashboard: "Monitoring utama proyek, menampilkan overview performa dan status terkini seluruh aspek proyek.",
  pm: "Modul manajemen proyek, tim, tugas, dan milestone.",
  eng: "Modul engineering, drawing, perhitungan, dan approval desain.",
  proc: "Modul pengadaan barang/jasa, status PO, dan vendor.",
  fab: "Modul fabrikasi dan status pengerjaan peralatan.",
  const: "Modul konstruksi di lapangan, progres harian, dan isu.",
  upload: "Upload laporan progress harian/mingguan/bulanan proyek, semua format file didukung (maks 100MB per file)."
};

// --- SECTION RENDER ---
function showSection(section) {
  document.getElementById('main-title').innerText = sectionTitle[section];
  document.getElementById('main-desc').innerText = sectionDesc[section];

  document.getElementById('iframe-container').style.display = "none";
  document.getElementById('upload-drive-wrapper').style.display = "none";

  if (['dashboard', 'pm', 'eng', 'proc', 'fab', 'const'].includes(section)) {
    document.getElementById('iframe-container').style.display = "";
    document.getElementById('main-iframe').src = iframeSrc[section] || "#";
  } else if (section === 'upload') {
    document.getElementById('upload-drive-wrapper').style.display = "flex";
    loadGalleryDrive();
  }
}

// --- Google Sign-In Callback ---
window.onGoogleSignIn = function (response) {
  const userInfo = parseJwt(response.credential);
  document.getElementById('user').innerHTML =
    `Halo, <b>${userInfo.name}</b> (<span style="font-size:0.92em">${userInfo.email}</span>)<hr>`;
  document.getElementById('authorize_button').style.display = '';
  document.getElementById('uploadForm').style.display = '';
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}

// --- GAPI & GIS LOADING ---
window.gapiLoaded = function () {
  gapi.load('client', async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
    });
    gapiInited = true;
    enableDriveButtonIfReady();
  });
};

window.gisLoaded = function () {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
      if (tokenResponse.error) {
        alert("Gagal login Google: " + JSON.stringify(tokenResponse));
        return;
      }

      // Simpan token
      storeToken(tokenResponse);
      gapi.client.setToken(tokenResponse);

      document.getElementById('user').innerHTML += '<br>✅ Google Drive Authorized.<hr>';
      document.getElementById('uploadForm').style.display = '';
      loadGalleryDrive();
    }
  });

  // ⏺️ Auto re-auth jika token tersedia
  const existingToken = loadToken();
  if (existingToken && existingToken.access_token) {
    gapi.client.setToken(existingToken);
    document.getElementById('user').innerHTML += '<br>✅ Token loaded from storage.<hr>';
    document.getElementById('uploadForm').style.display = '';
    loadGalleryDrive();
  }

  gisInited = true;
  enableDriveButtonIfReady();
};

function enableDriveButtonIfReady() {
  if (gapiInited && gisInited) {
    const savedToken = loadToken();
    if (savedToken) {
      // ✅ Gunakan token lama jika masih valid
      gapi.client.setToken({ access_token: savedToken.access_token });

      document.getElementById('user').innerHTML = '✅ Google Drive Authorized.<hr>';
      document.getElementById('uploadForm').style.display = '';
      loadGalleryDrive();
    } else {
      const btn = document.getElementById('authorize_button');
      if (btn) btn.disabled = false;
    }
  }
}

// --- Authorize Button ---
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'authorize_button') {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }
});

// --- Upload Form Submit ---
document.addEventListener('submit', function (e) {
  if (e.target && e.target.id === 'uploadForm') {
    e.preventDefault();
    const files = document.getElementById('fileInput').files;
    if (!files.length) return;

    for (let file of files) {
      if (file.size > 100 * 1024 * 1024) {
        document.getElementById('uploadStatus').innerText = "Max 100MB per file!";
        continue;
      }
      uploadFile(file);
    }
  }
});

function uploadFile(file) {
  const metadata = {
    name: file.name,
    mimeType: file.type,
    parents: [FOLDER_ID]
  };

  const accessToken = gapi.client.getToken()?.access_token;
  if (!accessToken) {
    document.getElementById('uploadStatus').innerText = "Belum login ke Google Drive.";
    return;
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form,
  })
  .then(res => res.json())
  .then(file => {
    console.log("Upload success:", file);
    document.getElementById('uploadStatus').innerHTML =
      '✅ Upload sukses: <a href="' + file.webViewLink + '" target="_blank">' + file.name + '</a>';
    loadGalleryDrive();
  })
  .catch(err => {
    console.error("Upload error:", err);
    document.getElementById('uploadStatus').innerText = "❌ Upload gagal.";
  });
}

function loadGalleryDrive() {
  gapi.client.drive.files.list({
    pageSize: 20,
    q: `'${FOLDER_ID}' in parents and trashed=false`,
    fields: "files(id,name,webViewLink,iconLink,thumbnailLink,mimeType)"
  }).then(function (response) {
    const files = response.result.files || [];
    let gallery = files.map(f =>
      `<div style="margin-bottom:10px;display:flex;align-items:center;">
        <img src="${f.iconLink}" style="width:22px;margin-right:10px;">
        <a href="${f.webViewLink}" target="_blank">${f.name}</a>
      </div>`
    ).join('');
    document.getElementById('galleryDrive').innerHTML = gallery ||
      "<span style='color:#aaa;'>Belum ada file di Google Drive Folder ini.</span>";
  });
}

// --- Persist token di localStorage agar tidak perlu login ulang
function storeToken(token) {
  localStorage.setItem("gdrive_token", JSON.stringify(token));
}

function loadToken() {
  const tokenStr = localStorage.getItem("gdrive_token");
  if (!tokenStr) return null;
  try {
    return JSON.parse(tokenStr);
  } catch (e) {
    return null;
  }
}

function logout() {
  localStorage.removeItem('gdrive_token');
  location.reload();
}

// --- INIT: Navigation ---
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const section = link.getAttribute('data-section');
      showSection(section);
    });
  });

  showSection('dashboard');
});