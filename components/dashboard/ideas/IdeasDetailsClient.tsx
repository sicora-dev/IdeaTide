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
  Zap,
  Layers,
  Activity,
  Sparkles
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
    <div className="flex-1 max-h-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-accent/50 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight truncate">
              {isEditing ? 'Editing Idea' : idea.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Edit your idea details' : 'Full idea details and management'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="hover:bg-yellow-50 transition-colors"
          >
            <Star 
              className={`h-4 w-4 mr-2 ${idea.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
            />
            {idea.is_favorite ? 'Favorite' : 'Add to favorites'}
          </Button>
          
          {isEditing ? (
            <div className='flex gap-2'>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="hover:bg-primary/5 hover:border-primary/20">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Idea
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 max-h-[70dvh] overflow-y-auto p-1">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                Main Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="border-2 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      rows={6}
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="border-2 focus:border-primary/50 transition-colors resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">{idea.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>
                Tags & Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={editForm.tags}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="web, mobile, ai, startup"
                    className="border-2 focus:border-primary/50 transition-colors"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {idea.tags && idea.tags.length > 0 ? (
                    idea.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/30 hover:bg-secondary/50 transition-colors">
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

          {/* AI Suggestions TODO*/}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                  <Brain className="h-5 w-5 bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent" />
                </div>
                AI Insights
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardTitle>
              <CardDescription>
                Personalized recommendations for this idea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200/50 rounded-xl">
                  <p className="text-sm font-medium text-blue-900 flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" />
                    Improvement opportunities
                  </p>
                  <p className="text-xs text-blue-700">
                    Consider defining specific metrics to measure the success of this idea
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200/50 rounded-xl">
                  <p className="text-sm font-medium text-green-900 flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4" />
                    Related ideas
                  </p>
                  <p className="text-xs text-green-700">
                    You have 2 similar ideas that could complement this proposal
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200/50 rounded-xl">
                  <p className="text-sm font-medium text-purple-900 flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    Next steps
                  </p>
                  <p className="text-xs text-purple-700">
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
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-100">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                Status & Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value as typeof prev.status }))}>
                      <SelectTrigger className="border-2 focus:border-primary/50">
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
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value as typeof prev.priority }))}>
                      <SelectTrigger className="border-2 focus:border-primary/50">
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
                    <div className="mt-2">{getStatusBadge(idea.status)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <div className="mt-2">{getPriorityBadge(idea.priority)}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-green-100">
                  <Layers className="h-4 w-4 text-green-600" />
                </div>
                Categorization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Input
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="border-2 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subcategory</Label>
                    <Input
                      value={editForm.subcategory}
                      onChange={(e) => setEditForm(prev => ({ ...prev, subcategory: e.target.value }))}
                      className="border-2 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{idea.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Subcategory:</span>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-secondary/30">{idea.subcategory}</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-yellow-100">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                Impact Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Estimated Effort</Label>
                    <Select value={editForm.estimated_effort} onValueChange={(value) => setEditForm(prev => ({ ...prev, estimated_effort: value as typeof prev.estimated_effort }))}>
                      <SelectTrigger className="border-2 focus:border-primary/50">
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
                    <Label className="text-sm font-medium">Potential Impact</Label>
                    <Select value={editForm.potential_impact} onValueChange={(value) => setEditForm(prev => ({ ...prev, potential_impact: value as typeof prev.potential_impact }))}>
                      <SelectTrigger className="border-2 focus:border-primary/50">
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
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-muted/50">{idea.estimated_effort}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Impact:</span>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-accent/20">{idea.potential_impact}</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Created:</p>
                  <p className="font-medium">{new Date(idea.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-blue-100">
                  <History className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Updated:</p>
                  <p className="font-medium">{new Date(idea.updated_at).toLocaleDateString('en-US', {
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
            <Card className="border-2 border-red-200 hover:border-red-300 transition-all duration-300 bg-gradient-to-br from-red-50/50 to-red-100/30">
              <CardHeader>
                <CardTitle className="text-base text-red-600 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-100">
                    <Trash className="h-4 w-4 text-red-600" />
                  </div>
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConfirmModal
                  trigger={
                    <Button variant="destructive" size="sm" className="w-full hover:bg-red-600 transition-colors">
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