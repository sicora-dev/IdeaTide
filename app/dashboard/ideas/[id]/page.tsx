import { notFound } from 'next/navigation';
import { fetchIdeaById } from '@/lib/actions/ideas';
import IdeaDetailClient from '@/components/dashboard/ideas/IdeasDetailsClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function IdeaDetailPage({ params }: PageProps) {
  const ideaId = parseInt(params.id);
  
  if (isNaN(ideaId)) {
    notFound();
  }

  try {
    const idea = await fetchIdeaById(ideaId);
    
    if (!idea) {
      notFound();
    }

    return <IdeaDetailClient idea={idea} />;
  } catch (error) {
    console.error('Error loading idea:', error);
    notFound();
  }
}