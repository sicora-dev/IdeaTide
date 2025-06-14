import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <CardFooter className="pt-4">
      <p className="text-center w-full text-slate-600">
        {text}{' '}
        <Link href={linkHref} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
          {linkText}
        </Link>
      </p>
    </CardFooter>
  );
}