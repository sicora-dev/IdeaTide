import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db/queries';
import { createClient } from 'libs/supabase/server/server';

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const stats = await getDashboardStats(user.id);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}