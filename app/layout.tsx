import type { Metadata } from 'next';
import './globals.css';
import './showcase.css';
import './sound-lens.css';

export const metadata: Metadata = {
  title: 'NOIRFRAME — Composer, Music Producer & Sound Designer',
  description: 'Cinematic portfolio for a composer, music producer and sound designer across film, songs and advertising.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
