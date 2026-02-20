import './globals.css';
import { Crimson_Pro, Inter } from 'next/font/google';
import Link from 'next/link';
import { ViewerInit } from '@/components/viewer-init';

const serif = Crimson_Pro({ subsets: ['latin'], variable: '--font-serif' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} min-h-screen font-sans`}>
        <ViewerInit />
        <header className="border-b border-sepia/30 bg-paper/95">
          <nav className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-3 text-sm">
            <Link href="/" className="font-semibold text-park">Lawndale Park Pet Registry</Link>
            <Link href="/sightings">Sightings</Link>
            <Link href="/missing">Missing Pets</Link>
            <Link href="/regulars">Regulars</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
