'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = () => {
  
    // Rutas específicas que requieren coincidencia exacta
    const exactMatchRoutes = ['/', '/dashboard'];
    
    if (exactMatchRoutes.includes(href)) {
      return pathname === href;
    }
    
    // Para otras rutas, verificar si la ruta actual comienza con href
    return pathname === href || 
           pathname.startsWith(href + '/');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
            {
              'bg-accent text-foreground': isActive()
            }
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
