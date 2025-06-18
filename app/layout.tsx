import './globals.css';

import { Analytics } from "@vercel/analytics/next"
import Providers from './providers';

export const metadata = {
  title: 'IdeaTide - Gestor de Ideas Inteligente',
  description:
    'Organiza, desarrolla y da vida a tus ideas con IdeaTide.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen w-full flex-col">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
