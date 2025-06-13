import { NextRequest, NextResponse } from 'next/server';
import { getIdeas, createIdea } from '@/lib/db/queries';
import { createIdeaSchema } from '@/lib/schemas/ideas';
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const ideas = await getIdeas(user.id, search);
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createIdeaSchema.parse(body);
    
    const idea = await createIdea({
      ...validatedData,
      status: 'new',
      priority: (validatedData.priority as "low" | "medium" | "high"),
      estimated_effort: validatedData.estimated_effort as "low" | "medium" | "high",
      potential_impact: validatedData.potential_impact as "low" | "medium" | "high",
      is_favorite: false,
      user_id: user.id,
    });

    return NextResponse.json({ idea }, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json({ error: 'Error al crear la idea' }, { status: 400 });
  }
}