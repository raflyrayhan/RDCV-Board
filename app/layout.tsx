// app/layout.tsx
import '../styles/style.css';

export const metadata = {
  title: 'REVAMPING DESALTER CDU V | Project Portal',
  description: 'Monitoring utama proyek, menampilkan overview performa dan status terkini seluruh aspek proyek.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
