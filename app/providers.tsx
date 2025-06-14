'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Toaster position="top-center" />
      {children}
    </TooltipProvider>
  )
}
