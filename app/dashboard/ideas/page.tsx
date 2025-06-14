import { Suspense } from 'react';
import { getIdeas } from '@/lib/db/queries';
import { Loader2 } from 'lucide-react';
import IdeasClient from '@/components/dashboard/ideas/IdeasClient';
import { getAuthenticatedUser } from 'libs/supabase/server/auth';

export const dynamic = 'force-dynamic'

function IdeasLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Cargando ideas...</span>
    </div>
  );
}

export default async function IdeasPage() {
  const { user } = await getAuthenticatedUser();
  const ideas = await getIdeas(user.id);
  return (
    <Suspense fallback={<IdeasLoading />}>
      <IdeasClient initialIdeas={ideas} />
    </Suspense>
  );
}