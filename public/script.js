// public/script.js

// ————————— CONFIG —————————
const CLIENT_ID = '415024272495-aj7r5hsucotnvjmft71maqoevcugq8r2.apps.googleusercontent.com';
const API_KEY   = 'AIzaSyCPHPQ7wC6B-GjBodrIQgsFfq23NTZcx1c';
const FOLDER_ID = '1RhUknY7hxcOGNzjADk02mxy9W0M2ScHo';
const SCOPES    = 'https://www.googleapis.com/auth/drive.file';

// ———————— HELPERS ————————
function loadScript(src) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src   = src;
    s.async = true;
    s.defer = true;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

// —————– GLOBAL API STUB —————–
window.GoogleDrive = {
  isReady: false,
  isAuthorized: false,
  user: null,
  _tokenClient: null,
  _onSignIn: [],    // callbacks when One‑Tap signs in
  _onAuthorize: [], // callbacks when Drive is authorized

  /** Queue a One‑Tap sign‑in callback */
  onSignIn(cb) { this._onSignIn.push(cb); },
  /** Queue an OAuth2‑authorized callback */
  onAuthorize(cb) { this._onAuthorize.push(cb); },

  /** Pops the OAuth2 consent screen */
  requestAuth() { this._tokenClient.requestAccessToken({ prompt: '' }); },

  /** Upload a file, returns Promise<{id,name,webViewLink}> */
  uploadFile(file) {
    const meta = { name: file.name, mimeType: file.type, parents: [FOLDER_ID] };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(meta)], { type:'application/json' }));
    form.append('file', file);

    const token = gapi.client.getToken().access_token;
    return fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body: form }
    ).then(r => r.json());
  },

  /** List files in the folder, Promise<array> */
  listFiles() {
    return gapi.client.drive.files
      .list({
        pageSize: 20,
        q: `'${FOLDER_ID}' in parents and trashed=false`,
        fields: 'files(id,name,webViewLink,iconLink)'
      })
      .then(res => res.result.files || []);
  },
};

// ——————— INITIALIZATION ———————
;(async function initGoogle() {
  // 1) Load GSI (One‑Tap)
  await loadScript('https://accounts.google.com/gsi/client');

  // 2) Init OAuth2 client
  window.GoogleDrive._tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: tok => {
      if (tok.error) return console.error('Drive auth error', tok.error);
      gapi.client.setToken({ access_token: tok.access_token });
      window.GoogleDrive.isAuthorized = true;
      window.GoogleDrive._onAuthorize.forEach(cb => cb());
    }
  });

  // 3) Initialize One‑Tap (no rendering yet)
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: resp => {
      const payload = JSON.parse(
        decodeURIComponent(
          atob(resp.credential.split('.')[1])
            .split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2,'0'))
            .join('')
        )
      );
      window.GoogleDrive.user = payload;
      window.GoogleDrive._onSignIn.forEach(cb => cb(payload));
    }
  });

  // 4) Load GAPI & Drive API
  await loadScript('https://apis.google.com/js/api.js');
  await new Promise(r => gapi.load('client', r));
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  });
  window.GoogleDrive.isReady = true;

  // 5) Watch for any new <div id="g_id_onload"> in the document.
  //    When it appears (or re‑appears), render the button and prompt.
  const observer = new MutationObserver(() => {
    if (!window.GoogleDrive.isReady) return;
    const el = document.getElementById('g_id_onload');
    if (el && !el.hasAttribute('data-gsi-rendered')) {
      google.accounts.id.renderButton(el, {
        theme: 'outline',
        size:  'large',
        text:  'signin_with',
      });
      google.accounts.id.prompt();
      el.setAttribute('data-gsi-rendered', 'true');
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree:   true,
  });
})();
