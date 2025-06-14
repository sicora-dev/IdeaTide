'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createClient } from 'libs/supabase/client/client';
import { AuthCard } from '../shared/AuthCard';
import { EmailPasswordForm } from '../shared/EmailPasswordForm';
import { OAuthSection } from '../shared/OAuthSection';
import { AuthFooter } from '../shared/AuthFooter';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (
    e: any,
    options: {
      type: string;
      provider?: 'google';
    }
  ) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const { type, provider } = options;
      const redirectURL = window.location.origin + "/api/auth/signin/callback";

      if (type === "oauth") {
        if (!provider) throw new Error("OAuth provider is required");
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: redirectURL,
          },
        });
      } else if (type === "password") {
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (error) {
          toast.error(error.message || "Failed to login.");
        } else {
          toast.success("Logged in successfully!");
          router.replace("/dashboard");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Sign In"
      description="Log in to your account to continue"
    >
      <EmailPasswordForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={(e) => handleLogin(e, { type: "password" })}
        isLoading={isLoading}
        buttonText="Sign In"
        loadingText="Signing In..."
        forgotPassword={true}
      />
      
      <OAuthSection
        onGoogleClick={(e) => handleLogin(e, { type: "oauth", provider: "google" })}
        isLoading={isLoading}
      />
      
      <AuthFooter
        text="Don't have an account?"
        linkText="Sign Up"
        linkHref="/signup"
      />
    </AuthCard>
  );
}