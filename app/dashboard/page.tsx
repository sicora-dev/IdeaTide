import { Suspense } from 'react';
import StatsClient from '@/components/dashboard/StatsClient';
import { getDashboardStats } from '@/lib/actions/ideas';
import { getAuthenticatedUser } from '@/libs/supabase/server/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {

  const { user } = await getAuthenticatedUser();
  if (!user) {
    redirect('/signin');
  }
  const dashboardData = await getDashboardStats(user?.id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatsClient dashboardData={dashboardData} />
    </Suspense>
  );
}