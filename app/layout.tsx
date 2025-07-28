// app/layout.tsx
import '../styles/style.css';
import Script from 'next/script';

export const metadata = {
  title: 'REVAMPING DESALTER CDU V | Project Portal',
  description:
    'Monitoring utama proyek, menampilkan overview performa dan status terkini seluruh aspek proyek.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Required headers for COOP/COEP if needed elsewhere */}
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />

        {/* Load global script.js before React hydrates */}
        <Script src="/script.js" strategy="beforeInteractive" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}