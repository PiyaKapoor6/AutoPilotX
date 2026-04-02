import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoPilotX | Enterprise AI Suite',
  description: 'Agentic AI Suite for Enterprise Automation & Knowledge Clarity, built for Indian MSMEs.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.className} data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] antialiased">
        {children}
      </body>
    </html>
  );
}
