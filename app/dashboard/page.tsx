import { Suspense } from 'react';
import StatsClient from '@/components/dashboard/StatsClient';
import { getDashboardStats } from '@/lib/actions/ideas';

export default async function DashboardPage() {

  const dashboardData = await getDashboardStats();

  return (
    <Suspense fallback={<></>}>
      <StatsClient dashboardData={dashboardData} />
    </Suspense>
  );
}