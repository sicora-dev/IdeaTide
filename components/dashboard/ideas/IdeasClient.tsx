'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Clock,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Brain,
  Lightbulb
} from 'lucide-react';
import { toggleFavoriteAction, deleteIdeaAction, createIdeaAction } from '@/lib/actions/ideas';
import { SelectIdea } from '@/lib/db/schema';
import CreateIdeaModal from './CreateIdeaModal';
import { useRouter } from 'next/navigation';

interface IdeasClientProps {
  initialIdeas: SelectIdea[];
}

export default function IdeasClient({ initialIdeas }: IdeasClientProps) {
  const [ideas, setIdeas] = useState<SelectIdea[]>(initialIdeas || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'favorites' && idea.is_favorite) ||
      idea.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const gotoIdea = (id: number) => {
    router.push(`/dashboard/ideas/${id}`);
  }

  const handleToggleFavorite = async (id: number, currentFavorite: boolean) => {
    try {
      await toggleFavoriteAction(id, currentFavorite);
      setIdeas(prev => 
        prev.map(idea => 
          idea.id === id ? { ...idea, is_favorite: !currentFavorite } : idea
        )
      );
      toast.success(currentFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Error updating favorite');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this idea?')) {
      return;
    }

    try {
      await deleteIdeaAction(id);
      setIdeas(prev => prev.filter(idea => idea.id !== id));
      toast.success('Idea deleted successfully');
    } catch (error) {
      toast.error('Error deleting idea');
    }
  };

  // Handle create idea
  const handleCreateIdea = async (ideaData: any) => {
    try {
      const formData = new FormData();
      formData.append('title', ideaData.title);
      formData.append('description', ideaData.description);
      formData.append('category', ideaData.category);
      formData.append('subcategory', ideaData.subcategory);
      formData.append('priority', ideaData.priority);
      formData.append('estimated_effort', ideaData.estimated_effort);
      formData.append('potential_impact', ideaData.potential_impact);
      formData.append('tags', ideaData.tags.join(','));

      await createIdeaAction(formData);
      
      // Reload the page to get updated data
      router.refresh();
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error; // Re-throw so the modal can handle the error
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false)
  }

  // Badges
  const getStatusBadge = (status: string) => {
    const variants = {
      'nueva': 'default',
      'en_progreso': 'destructive',
      'en_revision': 'secondary',
      'completada': 'outline'
    } as const;
    
    // Translate status to English
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

    // Translate priority to English
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
    <>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Lightbulb className="h-8 w-8" />
              My Ideas
            </h1>
            <p className="text-muted-foreground">
              Manage, organize, and develop all your creative ideas ({ideas.length} ideas)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              AI Auto-organize
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Idea
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search ideas..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All ideas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('favorites')}>
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('en_progreso')}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('nueva')}>
                    New
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('completada')}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No ideas found with those criteria' : 'Start by creating your first idea'}
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 h-full">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFavorite(idea.id, idea.is_favorite)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`h-4 w-4 ${idea.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`} 
                          />
                        </button>
                        {idea.title}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {idea.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {idea.subcategory}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => gotoIdea(idea.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(idea.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {idea.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1">
                    {idea.tags?.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">{getStatusBadge(idea.status)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <div className="mt-1">{getPriorityBadge(idea.priority)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effort:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {idea.estimated_effort}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {idea.potential_impact}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Updated: {new Date(idea.updated_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Idea Modal */}
      <CreateIdeaModal
        open={showCreateModal}
        onOpenChangeAction={closeCreateModal}
        onCreate={handleCreateIdea}
        onCancel={closeCreateModal}
      />
    </>
  );
}