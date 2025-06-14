import { memo, useCallback } from 'react';
import { SelectIdea } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Target } from 'lucide-react';
import { useIdeaStatus } from '@/hooks/dashboard/ideas/useIdeaStatus';

interface IdeaMapCardProps {
  idea: SelectIdea;
  isSelected: boolean;
  onSelect: (idea: SelectIdea) => void;
}

export const IdeaMapCard = memo(function IdeaMapCard({
  idea,
  isSelected,
  onSelect
}: IdeaMapCardProps) {
  const { getStatusIcon, getStatusColor, getPriorityColor } = useIdeaStatus();

  const handleClick = useCallback(() => {
    onSelect(idea);
  }, [idea, onSelect]);

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${getPriorityColor(idea.priority)} ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm line-clamp-1">{idea.title}</h4>
          <div className="flex items-center gap-1 ml-2">
            {idea.is_favorite && (
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            )}
            <div className={`p-1 rounded-full ${getStatusColor(idea.status)}`}>
              {getStatusIcon(idea.status)}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {idea.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{idea.potential_impact}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>{idea.estimated_effort}</span>
            </div>
          </div>
          
          {idea.tags && idea.tags.length > 0 && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              +{idea.tags.length}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
});