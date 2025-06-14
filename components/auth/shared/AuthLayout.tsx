import Link from 'next/link';
import { Logo } from '@/components/ui/shared/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center p-8">
      <div className="w-full max-w-md space-y-1">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo variant='horizontal' width={140} />
          </Link>
        </div>

        {children}

        {/* Footer link */}
        <div className="text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}