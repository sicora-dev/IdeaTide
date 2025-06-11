import './globals.css';

import { Analytics } from '@vercel/analytics/react';

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
    <html lang="es">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
