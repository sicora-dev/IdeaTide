import { memo, useCallback } from 'react';
import { SelectIdea } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Map, Eye, Target, Zap, Calendar, Tag, Layers, Activity } from 'lucide-react';
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
    <Card className="h-full border-2 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Details
        </CardTitle>
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
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': 'bg-blue-100 text-blue-800 border-blue-200',
      'in_progress': 'bg-orange-100 text-orange-800 border-orange-200',
      'under_review': 'bg-purple-100 text-purple-800 border-purple-200',
      'completed': 'bg-green-100 text-green-800 border-green-200'
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={`text-xs font-medium ${config || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    } as const;

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge variant="outline" className={`text-xs font-medium ${config || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 max-h-full">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleFavorite}
            className="hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-0.5"
          >
            <Heart 
              className={`h-5 w-5 ${idea.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'} transition-colors`} 
            />
          </button>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg leading-tight mb-2">{idea.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-h-32 overflow-auto">
              {idea.description}
            </p>
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        <DetailCard icon={<Target className="h-4 w-4" />} label="Status">
          {getStatusBadge(idea.status)}
        </DetailCard>
        
        <DetailCard icon={<Zap className="h-4 w-4" />} label="Priority">
          {getPriorityBadge(idea.priority)}
        </DetailCard>
        
        <DetailCard icon={<Layers className="h-4 w-4" />} label="Category">
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
            {idea.category}
          </Badge>
        </DetailCard>

        <DetailCard icon={<Activity className="h-4 w-4" />} label="Impact">
          <Badge variant="outline" className="text-xs bg-accent/20">
            {idea.potential_impact}
          </Badge>
        </DetailCard>
      </div>

      {/* Additional Info */}
      <div className="space-y-3">
        {idea.subcategory && (
          <DetailRow label="Subcategory">
            <Badge variant="outline" className="text-xs bg-secondary/30">
              {idea.subcategory}
            </Badge>
          </DetailRow>
        )}
        
        <DetailRow label="Effort">
          <Badge variant="outline" className="text-xs bg-muted/50">
            {idea.estimated_effort}
          </Badge>
        </DetailRow>
      </div>

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-secondary/30 hover:bg-secondary/50 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Updated Date */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
        <Calendar className="h-3 w-3" />
        <span>Updated: {new Date(idea.updated_at).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 transition-colors"
          onClick={onViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );
});

const DetailCard = memo(function DetailCard({ 
  icon,
  label, 
  children 
}: { 
  icon: React.ReactNode;
  label: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="p-3 rounded-lg bg-accent/20 border border-border/50 space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex justify-center">
        {children}
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
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}:</span>
      {children}
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center text-muted-foreground py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
        <Map className="h-8 w-8 opacity-50" />
      </div>
      <h3 className="font-medium mb-2">No idea selected</h3>
      <p className="text-sm">Select an idea from the list to view its details and manage it.</p>
    </div>
  );
});