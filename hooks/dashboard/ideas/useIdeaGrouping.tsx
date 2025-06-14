import { useMemo } from 'react';
import { SelectIdea } from '@/lib/db/schema';

export function useIdeaGrouping(ideas: SelectIdea[]) {
  const groupedIdeas = useMemo(() => {
    return ideas.reduce((acc, idea) => {
      const category = idea.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(idea);
      return acc;
    }, {} as Record<string, SelectIdea[]>);
  }, [ideas]);

  const totalGroups = Object.keys(groupedIdeas).length;

  return { groupedIdeas, totalGroups };
}