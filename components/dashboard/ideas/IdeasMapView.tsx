import { memo, useState, useCallback, useMemo } from 'react';
import { SelectIdea } from '@/lib/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map } from 'lucide-react';
import { useIdeaGrouping } from '@/hooks/dashboard/ideas/useIdeaGrouping';
import { IdeaMapCard } from './IdeaMapcard';
import { IdeaDetailsPanel } from './IdeaDetailsPanel';

interface IdeasMapViewProps {
  ideas: SelectIdea[];
  onViewIdea: (id: number) => void;
  onUpdateIdea: (idea: SelectIdea) => void;
  onDeleteIdea: (id: number) => void;
  isLoading: boolean;
}

export const IdeasMapView = memo(function IdeasMapView({ 
  ideas, 
  onViewIdea, 
  onUpdateIdea, 
  onDeleteIdea,
  isLoading 
}: IdeasMapViewProps) {
  const [selectedIdea, setSelectedIdea] = useState<SelectIdea | null>(null);
  
  const { groupedIdeas, totalGroups } = useIdeaGrouping(ideas);

  const handleIdeaSelect = useCallback((idea: SelectIdea) => {
    setSelectedIdea(idea);
  }, []);

  const handleToggleFavorite = useCallback((idea: SelectIdea) => {
    const updated = { ...idea, is_favorite: !idea.is_favorite };
    onUpdateIdea(updated);
    setSelectedIdea(updated);
  }, [onUpdateIdea]);

  if (ideas.length === 0 && !isLoading) {
    return (
      <Card className="h-96">
        <CardContent className="pt-6 text-center h-full flex flex-col justify-center">
          <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No ideas to map</h3>
          <p className="text-muted-foreground">
            Create some ideas to see them visualized on the map
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-3">
      <div className="lg:col-span-3 ">
        <Card className='max-h-[70dvh] overflow-y-auto'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Ideas Map
            </CardTitle>
            <CardDescription>
              Visual organization of your ideas by category ({totalGroups} categories)
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            <div className="space-y-8">
              {Object.entries(groupedIdeas).map(([category, categoryIdeas]) => {
                const ideasInCategory = categoryIdeas as SelectIdea[];
                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <Badge variant="secondary">{ideasInCategory.length}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ideasInCategory.map((idea) => (
                        <IdeaMapCard
                          key={idea.id}
                          idea={idea}
                          isSelected={selectedIdea?.id === idea.id}
                          onSelect={handleIdeaSelect}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-[70dvh]">
        <IdeaDetailsPanel 
          selectedIdea={selectedIdea}
          onViewIdea={onViewIdea}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
});