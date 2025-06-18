'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Star, 
  Clock,
  MoreHorizontal,
  Trash,
  Eye,
  Zap,
  Target,
  Calendar,
  Tag,
} from 'lucide-react';
import { toggleFavoriteAction, deleteIdeaAction, updateIdeaAction } from '@/lib/actions/ideas';
import { SelectIdea } from '@/lib/db/schema';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

interface IdeaCardProps {
  idea: SelectIdea;
  onUpdateAction: (updatedIdea: SelectIdea) => void;
  onDeleteAction: (id: number) => void;
  onViewAction: (id: number) => void;
  onHeightChange?: (height: number) => void;
}

export default function IdeaCard({ idea, onUpdateAction, onDeleteAction, onViewAction, onHeightChange }: IdeaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useLayoutEffect(() => {
    if (cardRef.current && onHeightChange) {
      const height = cardRef.current.offsetHeight;
      onHeightChange(height);
    }
  }, [idea.title, idea.description, onHeightChange]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavoriteAction(idea.id, idea.is_favorite);
      onUpdateAction({
        ...idea,
        is_favorite: !idea.is_favorite
      });
      toast.success(idea.is_favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Error updating favorite');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIdeaAction(idea.id);
      onDeleteAction(idea.id);
      toast.success('Idea deleted successfully');
    } catch (error) {
      toast.error('Error deleting idea');
    }
  };

  const handleStartEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveField = async () => {
    if (!editingField) return;

    try {
      const formData = new FormData();
      
      // Add all existing fields to FormData
      formData.append('title', idea.title);
      formData.append('description', idea.description);
      formData.append('category', idea.category);
      formData.append('subcategory', idea.subcategory);
      formData.append('status', idea.status);
      formData.append('priority', idea.priority);
      formData.append('estimated_effort', idea.estimated_effort);
      formData.append('potential_impact', idea.potential_impact);
      formData.append('tags', idea.tags?.join(',') || '');

      // Override the field being edited
      if (editingField === 'tags') {
        formData.set('tags', editValue);
      } else {
        formData.set(editingField, editValue);
      }

      await updateIdeaAction(idea.id, formData);
      
      // Update the idea
      const updatedIdea = {
        ...idea,
        [editingField]: editingField === 'tags' 
          ? editValue.split(',').map(tag => tag.trim()).filter(Boolean)
          : editValue,
        updated_at: new Date(),
      };
      
      onUpdateAction(updatedIdea);
      setEditingField(null);
      setEditValue('');
      toast.success('Updated successfully');
    } catch (error) {
      toast.error('Error updating field');
    }
  };

  const handleSelectChange = async (field: string, value: string) => {
    try {
      const formData = new FormData();
      
      // Add all existing fields to FormData
      formData.append('title', idea.title);
      formData.append('description', idea.description);
      formData.append('category', idea.category);
      formData.append('subcategory', idea.subcategory);
      formData.append('status', idea.status);
      formData.append('priority', idea.priority);
      formData.append('estimated_effort', idea.estimated_effort);
      formData.append('potential_impact', idea.potential_impact);
      formData.append('tags', idea.tags?.join(',') || '');

      // Override the field being changed
      formData.set(field, value);

      await updateIdeaAction(idea.id, formData);
      
      // Update the idea
      const updatedIdea = {
        ...idea,
        [field]: value,
        updated_at: new Date(),
      };
      
      onUpdateAction(updatedIdea);
      toast.success('Updated successfully');
    } catch (error) {
      toast.error('Error updating field');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': { variant: 'default', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'in_progress': { variant: 'destructive', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'under_review': { variant: 'secondary', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'completed': { variant: 'outline', color: 'bg-green-100 text-green-800 border-green-200' }
    } as const;
    
    const statusTranslations: Record<string, string> = {
      'new': 'New',
      'in_progress': 'In Progress',
      'under_review': 'In Review',
      'completed': 'Completed'
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={`text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {statusTranslations[status] || status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    } as const;

    const priorityTranslations: Record<string, string> = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    
    return (
      <Badge variant="outline" className={`text-xs font-medium ${priorityConfig[priority as keyof typeof priorityConfig] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {priorityTranslations[priority] || priority}
      </Badge>
    );
  };

  return (
    <Card 
      ref={cardRef} 
      className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] flex flex-col h-full border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50"
    >
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Editable Title */}
            {editingField === 'title' ? (
              <div className="space-y-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-base font-semibold h-9 border-primary/30 focus:border-primary"
                  onBlur={handleSaveField}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <CardTitle 
                className="text-lg flex items-center gap-3 truncate cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors duration-200"
                onClick={() => handleStartEdit('title', idea.title)}
              >
                <button
                  onClick={handleToggleFavorite}
                  className="hover:scale-110 transition-transform duration-200 flex-shrink-0"
                >
                  <Star 
                    className={`h-5 w-5 ${idea.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} transition-colors`} 
                  />
                </button>
                <span className="truncate group-hover:text-primary transition-colors">{idea.title}</span>
              </CardTitle>
            )}
            
            {/* Categories */}
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                <span className="truncate max-w-20">{idea.category}</span>
              </Badge>
              <Badge variant="outline" className="text-xs bg-secondary/50 text-secondary-foreground border-secondary/30">
                <span className="truncate max-w-20">{idea.subcategory}</span>
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0 hover:bg-accent/50 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => onViewAction(idea.id)} className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmModal
                trigger={
                  <DropdownMenuItem 
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                }
                title="Are you absolutely sure?"
                description={`This action cannot be undone. This will permanently delete the idea "${idea.title}" and all its associated data.`}
                onConfirm={handleDelete}
                confirmText="Yes, delete idea"
                cancelText="Cancel"
                confirmVariant="destructive"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col pt-0">
        <div className="flex-1 flex flex-col">
          {/* Editable Description */}
          {editingField === 'description' ? (
            <div className="flex-1 mb-4">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                className="text-sm resize-none border-primary/30 focus:border-primary"
                onBlur={handleSaveField}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSaveField();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
            </div>
          ) : (
            <CardDescription 
              className="text-sm leading-relaxed flex-1 line-clamp-3 cursor-pointer hover:bg-accent/30 p-2 rounded-lg transition-colors duration-200 mb-4"
              onClick={() => handleStartEdit('description', idea.description)}
            >
              {idea.description}
            </CardDescription>
          )}
          
          {/* Editable Tags */}
          {editingField === 'tags' ? (
            <div className="mb-4">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="text-sm h-8 border-primary/30 focus:border-primary"
                onBlur={handleSaveField}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveField();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
            </div>
          ) : (
            <div 
              className="flex flex-wrap gap-2 mb-4 min-h-[24px] cursor-pointer hover:bg-accent/30 p-2 rounded-lg transition-colors duration-200"
              onClick={() => handleStartEdit('tags', idea.tags?.join(', ') || '')}
            >
              <Tag className="h-3 w-3 text-muted-foreground mt-0.5" />
              {idea.tags?.slice(0, 3).map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary" className="text-xs bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <span className="truncate max-w-20">{tag}</span>
                </Badge>
              ))}
              {idea.tags && idea.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-secondary/30">
                  +{idea.tags.length - 3}
                </Badge>
              )}
              {(!idea.tags || idea.tags.length === 0) && (
                <span className="text-xs text-muted-foreground">Click to add tags</span>
              )}
            </div>
          )}

          {/* Status and Priority Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>Status</span>
              </div>
              <Select 
                value={idea.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="h-auto p-1 border-0 shadow-none hover:bg-accent/30 transition-colors">
                  <SelectValue asChild>
                    {getStatusBadge(idea.status)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="under_review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Priority</span>
              </div>
              <Select 
                value={idea.priority} 
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="h-auto p-1 border-0 shadow-none hover:bg-accent/30 transition-colors">
                  <SelectValue asChild>
                    {getPriorityBadge(idea.priority)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Effort */}
            <div className="space-y-2">
              <span className="text-muted-foreground">Effort</span>
              <Select 
                value={idea.estimated_effort} 
                onValueChange={(value) => handleSelectChange('estimated_effort', value)}
              >
                <SelectTrigger className="h-auto p-1 border-0 shadow-none hover:bg-accent/30 transition-colors">
                  <SelectValue asChild>
                    <Badge variant="outline" className="text-xs bg-accent/20">
                      {idea.estimated_effort}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Impact */}
            <div className="space-y-2">
              <span className="text-muted-foreground">Impact</span>
              <Select 
                value={idea.potential_impact} 
                onValueChange={(value) => handleSelectChange('potential_impact', value)}
              >
                <SelectTrigger className="h-auto p-1 border-0 shadow-none hover:bg-accent/30 transition-colors">
                  <SelectValue asChild>
                    <Badge variant="outline" className="text-xs bg-accent/20">
                      {idea.potential_impact}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Updated: {new Date(idea.updated_at).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}