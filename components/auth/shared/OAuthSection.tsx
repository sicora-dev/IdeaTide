import { Button } from '@/components/ui/button';
import { GoogleIcon } from './GoogleIcon';

interface OAuthSectionProps {
  onGoogleClick: (e: React.MouseEvent) => void;
  isLoading: boolean;
}

export function OAuthSection({ onGoogleClick, isLoading }: OAuthSectionProps) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-white px-4 text-slate-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
        onClick={onGoogleClick}
        disabled={isLoading}
      >
        <GoogleIcon className="w-5 h-5 mr-3" />
        {isLoading ? "Loading..." : "Continue with Google"}
      </Button>
    </>
  );
}