import Link from 'next/link';
import { Logo } from '@/components/ui/shared/Logo';

export function Footer() {
  const footerLinks = [
    { href: '#', label: 'Privacy' },
    { href: '#', label: 'Terms' },
    { href: '#', label: 'Support' }
  ];

  return (
    <footer className="bg-slate-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="flex items-center justify-center">
              <Logo variant='horizontal' width={100} />
            </div>
          </div>
          <div className="flex space-x-8 text-sm text-slate-400">
            {footerLinks.map((link, index) => (
              <Link 
                key={index} 
                href={link.href} 
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          © 2025 IdeaTide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}