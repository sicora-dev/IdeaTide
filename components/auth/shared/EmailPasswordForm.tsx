import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface EmailPasswordFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  buttonText: string;
  loadingText: string;
  // New props for signup
  fullName?: string;
  onFullNameChange?: (fullName: string) => void;
  confirmPassword?: string;
  onConfirmPasswordChange?: (confirmPassword: string) => void;
  mode?: 'signin' | 'signup';
  forgotPassword?: boolean;
}

export function EmailPasswordForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
  buttonText,
  loadingText,
  fullName,
  onFullNameChange,
  confirmPassword,
  onConfirmPasswordChange,
  mode = 'signin',
  forgotPassword = false
}: EmailPasswordFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700 font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName || ''}
              onChange={(e) => onFullNameChange?.(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={mode === 'signup' ? "6 characters minimum" : "••••••••"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            minLength={mode === 'signup' ? 6 : undefined}
            disabled={isLoading}
            className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base" 
          disabled={isLoading}
          >
          {isLoading ? loadingText : buttonText}
        </Button>
      </form>
      {forgotPassword && (
        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-primary underline"
          >
            Forgot password?
          </Link>
        </div>
      )}
    </>

  );
}