'use client'

import { createClient } from 'libs/supabase/client/client';
import { deleteCookie } from 'libs/supabase/server/cookies';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await deleteCookie("sb-user");
      await deleteCookie("sb-token");
      toast.success('Signed out successfully!');
      router.replace('/signin');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <button onClick={handleSignOut} className="w-full text-left">
      Sign Out
    </button>
  );
}