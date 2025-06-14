'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createClient } from 'libs/supabase/client/client';
import { AuthCard } from '../shared/AuthCard';
import { EmailPasswordForm } from '../shared/EmailPasswordForm';
import { OAuthSection } from '../shared/OAuthSection';
import { AuthFooter } from '../shared/AuthFooter';
export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (
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
        if (error) throw error;
      } else if (type === "password") {

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
        router.replace("/signin");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error creating account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create an Account"
      description="Join IdeaTide and start organizing your ideas today!"
    >
      <EmailPasswordForm
        mode="signup"
        email={email}
        password={password}
        fullName={fullName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onFullNameChange={setFullName}
        onSubmit={(e) => handleSignup(e, { type: "password" })}
        isLoading={isLoading}
        buttonText="Create Account"
        loadingText="Creating account..."
      />
      
      <OAuthSection
        onGoogleClick={(e) => handleSignup(e, { type: "oauth", provider: "google" })}
        isLoading={isLoading}
      />
      
      <AuthFooter
        text="Already have an account?"
        linkText="Sign In"
        linkHref="/signin"
      />
    </AuthCard>
  );
}