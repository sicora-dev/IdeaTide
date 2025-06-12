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

interface IdeasClientProps {
  initialIdeas: SelectIdea[];
}

export default function IdeasClient({ initialIdeas }: IdeasClientProps) {
  const [ideas, setIdeas] = useState<SelectIdea[]>(initialIdeas || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleToggleFavorite = async (id: number, currentFavorite: boolean) => {
    try {
      await toggleFavoriteAction(id, currentFavorite);
      setIdeas(prev => 
        prev.map(idea => 
          idea.id === id ? { ...idea, is_favorite: !currentFavorite } : idea
        )
      );
      toast.success(currentFavorite ? 'Removido de favoritos' : 'Añadido a favoritos');
    } catch (error) {
      toast.error('Error al actualizar favorito');
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta idea?')) {
      return;
    }

    try {
      await deleteIdeaAction(id);
      setIdeas(prev => prev.filter(idea => idea.id !== id));
      toast.success('Idea eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la idea');
    }
  };

  // Manejar creación de idea
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
      
      // Recargar la página para obtener los datos actualizados
      window.location.reload();
    } catch (error) {
      console.error('Error al crear la idea:', error);
      throw error; // Re-throw para que el modal maneje el error
    }
  };

  // Badges
  const getStatusBadge = (status: string) => {
    const variants = {
      'nueva': 'default',
      'en_progreso': 'destructive',
      'en_revision': 'secondary',
      'completada': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'alta': 'destructive',
      'media': 'secondary',
      'baja': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority}
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
              Gestiona, organiza y desarrolla todas tus ideas creativas ({ideas.length} ideas)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Auto-organizar IA
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Idea
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
                    placeholder="Buscar ideas..." 
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
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    Todas las ideas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('favorites')}>
                    Favoritas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('en_progreso')}>
                    En progreso
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('nueva')}>
                    Nuevas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('completada')}>
                    Completadas
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
              <h3 className="text-lg font-semibold mb-2">No hay ideas todavía</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No se encontraron ideas con esos criterios' : 'Comienza creando tu primera idea'}
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Idea
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
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(idea.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
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
                      <span className="text-muted-foreground">Estado:</span>
                      <div className="mt-1">{getStatusBadge(idea.status)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prioridad:</span>
                      <div className="mt-1">{getPriorityBadge(idea.priority)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Esfuerzo:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {idea.estimated_effort}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impacto:</span>
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
                      Actualizada: {new Date(idea.updated_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Crear Idea */}
      <CreateIdeaModal
        open={showCreateModal}
        onOpenChangeAction={setShowCreateModal}
        onCreate={handleCreateIdea}
        onCancel={() => setShowCreateModal(false)}
      />
    </>
  );
}