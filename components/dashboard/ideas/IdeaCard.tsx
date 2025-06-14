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
    const variants = {
      'new': 'default',
      'in_progress': 'destructive',
      'under_review': 'secondary',
      'completed': 'outline'
    } as const;
    
    const statusTranslations: Record<string, string> = {
      'new': 'New',
      'in_progress': 'In Progress',
      'under_review': 'In Review',
      'completed': 'Completed'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {statusTranslations[status] || status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'high': 'destructive',
      'medium': 'secondary',
      'low': 'outline'
    } as const;

    const priorityTranslations: Record<string, string> = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priorityTranslations[priority] || priority}
      </Badge>
    );
  };

  return (
    <Card ref={cardRef} className="hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Editable Title */}
            {editingField === 'title' ? (
              <div className="space-y-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-base font-semibold h-8"
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
                className="text-lg flex items-center gap-2 truncate cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => handleStartEdit('title', idea.title)}
              >
                <button
                  onClick={handleToggleFavorite}
                  className="hover:scale-110 transition-transform flex-shrink-0"
                >
                  <Star 
                    className={`h-4 w-4 ${idea.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`} 
                  />
                </button>
                <span className="truncate">{idea.title}</span>
              </CardTitle>
            )}
            
            {/* Categories (not editable) */}
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <span className=' truncate'>

                {idea.category}
                </span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <span className='truncate'>
                  {idea.subcategory}
                </span>
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onViewAction(idea.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmModal
                trigger={
                  <DropdownMenuItem 
                    className="text-red-600"
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
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          {/* Editable Description */}
          {editingField === 'description' ? (
            <div className="flex-1 mb-3">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                className="text-sm resize-none"
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
              className="text-sm leading-relaxed flex-1 line-clamp-3 cursor-pointer hover:bg-gray-50 p-1 rounded mb-3"
              onClick={() => handleStartEdit('description', idea.description)}
            >
              {idea.description}
            </CardDescription>
          )}
          
          {/* Editable Tags */}
          {editingField === 'tags' ? (
            <div className="mb-3">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="text-sm h-7"
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
              className="flex-nowrap gap-1 mb-3 min-h-[20px] cursor-pointer hover:bg-gray-50 p-1 rounded block"
              onClick={() => handleStartEdit('tags', idea.tags?.join(', ') || '')}
            >
              {idea.tags?.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary" className="text-xs">
                  <span className='truncate max-w-24'>
                    {tag}
                  </span>
                </Badge>
              )).slice(0, 3)}
              {idea.tags && idea.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{idea.tags.length - 3}
                </Badge>
              )}
              {(!idea.tags || idea.tags.length === 0) && (
                <span className="text-xs text-muted-foreground">Click to add tags</span>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {/* Status Dropdown */}
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div className="mt-1">
                <Select 
                  value={idea.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="h-auto p-0 border-0 shadow-none hover:bg-gray-50">
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
            </div>

            {/* Priority Dropdown */}
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <div className="mt-1">
                <Select 
                  value={idea.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="h-auto p-0 border-0 shadow-none hover:bg-gray-50">
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
            </div>

            {/* Effort Dropdown */}
            <div>
              <span className="text-muted-foreground">Effort:</span>
              <div className="mt-1">
                <Select 
                  value={idea.estimated_effort} 
                  onValueChange={(value) => handleSelectChange('estimated_effort', value)}
                >
                  <SelectTrigger className="h-auto p-0 border-0 shadow-none hover:bg-gray-50">
                    <SelectValue asChild>
                      <Badge variant="outline" className="text-xs">
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
            </div>

            {/* Impact Dropdown */}
            <div>
              <span className="text-muted-foreground">Impact:</span>
              <div className="mt-1">
                <Select 
                  value={idea.potential_impact} 
                  onValueChange={(value) => handleSelectChange('potential_impact', value)}
                >
                  <SelectTrigger className="h-auto p-0 border-0 shadow-none hover:bg-gray-50">
                    <SelectValue asChild>
                      <Badge variant="outline" className="text-xs">
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
          </div>

          <div className="pt-2 border-t text-xs text-muted-foreground mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Updated: {new Date(idea.updated_at).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}