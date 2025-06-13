import { NextRequest, NextResponse } from 'next/server';
import { getIdeaById, updateIdea, deleteIdea } from '@/lib/db/queries';
import { updateIdeaSchema } from '@/lib/schemas/ideas';
import { createClient } from 'libs/supabase/server/server';
import { getAuthenticatedUser } from '@/libs/supabase/server/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const idea = await getIdeaById(id, user.id);
    
    if (!idea) {
      return NextResponse.json({ error: 'Idea no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ idea });
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const validatedData = updateIdeaSchema.parse(body);

    // Convertir campos a inglés para BD
    const dataToUpdate: any = { ...validatedData };
    if (validatedData.priority) {
      dataToUpdate.priority = validatedData.priority;
    }
    if (validatedData.estimated_effort) {
      dataToUpdate.estimatedEffort = validatedData.estimated_effort;
    }
    if (validatedData.potential_impact) {
      dataToUpdate.potentialImpact = validatedData.potential_impact;
    }
    
    const idea = await updateIdea(id, user.id, dataToUpdate);
    
    if (!idea) {
      return NextResponse.json({ error: 'Idea no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ idea });
  } catch (error) {
    console.error('Error updating idea:', error);
    return NextResponse.json({ error: 'Error al actualizar la idea' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const success = await deleteIdea(id, user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Idea no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Idea eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json({ error: 'Error al eliminar la idea' }, { status: 500 });
  }
}