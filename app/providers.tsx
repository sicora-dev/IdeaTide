'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  )
}
