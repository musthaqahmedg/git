import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'NearHand: help from someone nearby',
  description:
    'Book drivers, plumbers and electricians near you in Palakkad, or find work close to home.',
};

export const viewport: Viewport = {
  themeColor: '#1e4d2b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anek+Latin:wdth,wght@75..125,400..800&display=swap"
        />
      </head>
      <body>
        <header className="border-b border-line bg-ground">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="type-board text-2xl text-paddy">
              NearHand
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium sm:gap-4 sm:text-base">
              <Link href="/auth?type=customer" className="rounded px-2 py-1 text-muted hover:text-ink">
                Book help
              </Link>
              <Link href="/auth?type=driver" className="rounded px-2 py-1 text-muted hover:text-ink">
                Find work
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
