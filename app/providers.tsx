'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes'


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <TooltipProvider>
        <Toaster position="top-center" />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  )
}
