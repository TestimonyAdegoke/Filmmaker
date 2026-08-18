import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NOIRFRAME — Film, Score & Sound',
  description: 'Filmmaker, film composer, score engineer and music producer portfolio.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
