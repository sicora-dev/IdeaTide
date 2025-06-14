import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/shared/Logo';

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center">
          <Logo variant='horizontal' width={100} />
        </div>
      </div>
      <Link href="/dashboard">
        <Button variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </nav>
  );
}