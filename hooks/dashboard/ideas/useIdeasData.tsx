import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SelectIdea } from '@/lib/db/schema';
import { createIdeaAction } from '@/lib/actions/ideas';

export function useIdeasData(initialIdeas: SelectIdea[]) {
  const [ideas, setIdeas] = useState<SelectIdea[]>(initialIdeas || []);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleViewIdea = useCallback((id: number) => {
    router.push(`/dashboard/ideas/${id}`);
  }, [router]);

  const handleUpdateIdea = useCallback((updatedIdea: SelectIdea) => {
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === updatedIdea.id ? updatedIdea : idea
      )
    );
  }, []);

  const handleDeleteIdea = useCallback((id: number) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  }, []);

  const handleCreateIdea = useCallback(async (ideaData: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(ideaData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, String(value));
        }
      });

      await createIdeaAction(formData);
      router.refresh();
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    ideas,
    isLoading,
    handleViewIdea,
    handleUpdateIdea,
    handleDeleteIdea,
    handleCreateIdea
  };
}