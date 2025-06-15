"use server"
import { getAuthenticatedUser } from 'libs/supabase/server/auth';
import { SupportForm } from '@/components/support/SupportForm';
import { BackButton } from '@/components/shared/BackButtton';

export default async function SupportPage() {
  const { user } = await getAuthenticatedUser();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <BackButton />
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground mt-2">
            Need help? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <SupportForm user={user} />
      </div>
    </div>
  );
}