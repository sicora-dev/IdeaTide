import { memo, useCallback } from 'react';
import { SelectIdea } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Map } from 'lucide-react';
import { useIdeaStatus } from '@/hooks/dashboard/ideas/useIdeaStatus';

interface IdeaDetailsPanelProps {
  selectedIdea: SelectIdea | null;
  onViewIdea: (id: number) => void;
  onToggleFavorite: (idea: SelectIdea) => void;
}

export const IdeaDetailsPanel = memo(function IdeaDetailsPanel({
  selectedIdea,
  onViewIdea,
  onToggleFavorite
}: IdeaDetailsPanelProps) {
  const { getStatusColor } = useIdeaStatus();

  const handleViewDetails = useCallback(() => {
    if (selectedIdea) {
      onViewIdea(selectedIdea.id);
    }
  }, [selectedIdea, onViewIdea]);

  const handleToggleFavorite = useCallback(() => {
    if (selectedIdea) {
      onToggleFavorite(selectedIdea);
    }
  }, [selectedIdea, onToggleFavorite]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedIdea ? (
          <IdeaDetails 
            idea={selectedIdea}
            onViewDetails={handleViewDetails}
            onToggleFavorite={handleToggleFavorite}
            getStatusColor={getStatusColor}
          />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
});

const IdeaDetails = memo(function IdeaDetails({
  idea,
  onViewDetails,
  onToggleFavorite,
  getStatusColor
}: {
  idea: SelectIdea;
  onViewDetails: () => void;
  onToggleFavorite: () => void;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="space-y-4 max-h-full">
      <div>
        <h4 className="font-semibold mb-1">{idea.title}</h4>
        <p className="text-sm text-muted-foreground max-h-44 overflow-auto">
          {idea.description}
        </p>
      </div>

      <div className="space-y-2">
        <DetailRow label="Status">
          <Badge className={getStatusColor(idea.status)}>
            {idea.status}
          </Badge>
        </DetailRow>
        
        <DetailRow label="Priority">
          <span className="capitalize">{idea.priority}</span>
        </DetailRow>
        
        <DetailRow label="Category">
          <span className="capitalize">{idea.category}</span>
        </DetailRow>

        {idea.subcategory && (
          <DetailRow label="Subcategory">
            <span className="capitalize">{idea.subcategory}</span>
          </DetailRow>
        )}
        
        <DetailRow label="Impact">
          <span className="capitalize">{idea.potential_impact}</span>
        </DetailRow>
        
        <DetailRow label="Effort">
          <span className="capitalize">{idea.estimated_effort}</span>
        </DetailRow>
      </div>

      {idea.tags && idea.tags.length > 0 && (
        <div>
          <span className="text-sm text-muted-foreground mb-2 block">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button 
          size="sm" 
          className="flex-1"
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleFavorite}
        >
          {idea.is_favorite ? (
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});

const DetailRow = memo(function DetailRow({ 
  label, 
  children 
}: { 
  label: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}:</span>
      {children}
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center text-muted-foreground">
      <Map className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">Select an idea to view details</p>
    </div>
  );
});