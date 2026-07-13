import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Palakkad Marketplace - Find Jobs, Fix Tasks',
  description: 'Connect drivers and customers in Palakkad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          background: '#1a1a1a',
          color: '#fff',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #333'
        }}>
          <a href="/" style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', color: '#fff' }}>
            Palakkad Marketplace
          </a>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/auth?type=driver" style={{ color: '#aaa', textDecoration: 'none' }}>Driver Login</a>
            <a href="/auth?type=customer" style={{ color: '#aaa', textDecoration: 'none' }}>Customer Login</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
