// types/googleapis.d.ts
export {};

declare global {
  //////////////////////////////////////
  // 1) Google One‑Tap / Sign‑In        //
  //////////////////////////////////////
  namespace google.accounts.id {
    interface CredentialResponse {
      credential: string;
      clientId?: string;
      select_by?: string;
    }
    function initialize(opts: {
      client_id: string;
      callback: (resp: CredentialResponse) => void;
    }): void;
    function renderButton(
      parent: HTMLElement,
      opts: { theme: 'outline' | 'filled_blue'; size: 'large' | 'medium' | 'small' }
    ): void;
    function prompt(): void;
  }

  //////////////////////////////////////
  // 2) OAuth2 Token Client             //
  //////////////////////////////////////
  namespace google.accounts.oauth2 {
    interface TokenResponse {
      access_token: string;
      error?: string;
    }
    interface TokenClientConfig {
      client_id: string;
      scope: string;
      callback: (resp: TokenResponse) => void;
    }
    interface TokenClient {
      requestAccessToken(opts: { prompt?: '' | 'consent' }): void;
    }
    function initTokenClient(config: TokenClientConfig): TokenClient;
  }

  //////////////////////////////////////
  // 3) GAPI Client & Drive API         //
  //////////////////////////////////////
  namespace gapi {
    function load(lib: 'client', cb: () => void): void;
    namespace client {
      function init(opts: {
        apiKey: string;
        discoveryDocs: string[];
      }): Promise<void>;
      function setToken(token: { access_token: string }): void;
      function getToken(): { access_token: string } | null;
      namespace drive {
        interface File {
          id: string;
          name: string;
          webViewLink: string;
          iconLink: string;
        }
        namespace files {
          function list(params: {
            pageSize: number;
            q: string;
            fields: string;
          }): Promise<{ result: { files: File[] } }>;
        }
      }
    }
  }
}
