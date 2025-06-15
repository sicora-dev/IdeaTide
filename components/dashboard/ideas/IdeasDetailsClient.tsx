'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Brain,
  Lightbulb,
  Tag,
  Trash,
  History,
  MessageSquare,
  Target,
  Zap
} from 'lucide-react';
import { toggleFavoriteAction, deleteIdeaAction, updateIdeaAction } from '@/lib/actions/ideas';
import { SelectIdea } from '@/lib/db/schema';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

interface IdeaDetailClientProps {
  idea: SelectIdea;
}

export default function IdeaDetailClient({ idea: initialIdea }: IdeaDetailClientProps) {
  const router = useRouter();
  const [idea, setIdea] = useState(initialIdea);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: idea.title,
    description: idea.description,
    category: idea.category,
    subcategory: idea.subcategory,
    status: idea.status,
    priority: idea.priority,
    estimated_effort: idea.estimated_effort,
    potential_impact: idea.potential_impact,
    tags: idea.tags?.join(', ') || '',
  });

  useEffect(() => {
    setIdea(initialIdea);
  }, [initialIdea]);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavoriteAction(idea.id, idea.is_favorite);
      setIdea(prev => ({ ...prev, is_favorite: !prev.is_favorite }));
      toast.success(idea.is_favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Error updating favorite');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIdeaAction(idea.id);
      toast.success('Idea deleted successfully');
      router.push('/dashboard/ideas');
    } catch (error) {
      toast.error('Error deleting idea');
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('category', editForm.category);
      formData.append('subcategory', editForm.subcategory);
      formData.append('status', editForm.status);
      formData.append('priority', editForm.priority);
      formData.append('estimated_effort', editForm.estimated_effort);
      formData.append('potential_impact', editForm.potential_impact);
      formData.append('tags', editForm.tags);

      await updateIdeaAction(idea.id, formData);
      
      // Update local state
      setIdea(prev => ({
        ...prev,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        subcategory: editForm.subcategory,
        status: editForm.status,
        priority: editForm.priority,
        estimated_effort: editForm.estimated_effort,
        potential_impact: editForm.potential_impact,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updated_at: new Date(),
      }));
      
      setIsEditing(false);
      toast.success('Idea updated successfully');
    } catch (error) {
      toast.error('Error updating idea');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'nueva': 'default',
      'en_progreso': 'destructive',
      'en_revision': 'secondary',
      'completada': 'outline'
    } as const;

    // English translations
    const statusTranslations: Record<string, string> = {
      'nueva': 'New',
      'en_progreso': 'In Progress',
      'en_revision': 'In Review',
      'completada': 'Completed'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {statusTranslations[status] || status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'alta': 'destructive',
      'media': 'secondary',
      'baja': 'outline'
    } as const;

    // English translations
    const priorityTranslations: Record<string, string> = {
      'alta': 'High',
      'media': 'Medium',
      'baja': 'Low'
    };
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priorityTranslations[priority] || priority}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 ">
              <Lightbulb className="h-8 w-8" />
              <span className='truncate max-md:max-w-52'>
                {isEditing ? 'Editing Idea' : idea.title}
              </span>
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Edit your idea details' : 'Full idea details'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
          >
            <Star 
              className={`h-4 w-4 mr-2 ${idea.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
            />
            {idea.is_favorite ? 'Favorite' : 'Mark as favorite'}
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 max-h-[70dvh] overflow-y-auto p-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Main Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={6}
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={editForm.tags}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="web, mobile, ai, startup"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {idea.tags && idea.tags.length > 0 ? (
                    idea.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No tags assigned</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Suggestions
              </CardTitle>
              <CardDescription>
                Personalized recommendations for this idea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Improvement opportunities
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Consider defining specific metrics to measure the success of this idea
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Related ideas
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    You have 2 similar ideas that could complement this proposal
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Next steps
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Based on the current status, we suggest creating an initial prototype
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Metadata & Actions */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value.toLowerCase() as typeof prev.status }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="under_review">In Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value as typeof prev.priority }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <div className="mt-1">{getStatusBadge(idea.status)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <div className="mt-1">{getPriorityBadge(idea.priority)}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Categorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Input
                      value={editForm.subcategory}
                      onChange={(e) => setEditForm(prev => ({ ...prev, subcategory: e.target.value }))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{idea.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Subcategory:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{idea.subcategory}</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Estimated Effort</Label>
                    <Select value={editForm.estimated_effort} onValueChange={(value) => setEditForm(prev => ({ ...prev, estimated_effort: value as typeof prev.estimated_effort }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Potential Impact</Label>
                    <Select value={editForm.potential_impact} onValueChange={(value) => setEditForm(prev => ({ ...prev, potential_impact: value as typeof prev.potential_impact }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-sm text-muted-foreground">Effort:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{idea.estimated_effort}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Impact:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{idea.potential_impact}</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Created:</p>
                  <p>{new Date(idea.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <History className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Updated:</p>
                  <p>{new Date(idea.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {!isEditing && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfirmModal
                  trigger={
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Idea
                    </Button>
                  }
                  title="Are you absolutely sure?"
                  description={`This action cannot be undone. This will permanently delete the idea "${idea.title}" and all its associated data.`}
                  onConfirm={handleDelete}
                  confirmText="Yes, delete idea"
                  cancelText="Cancel"
                  confirmVariant="destructive"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}