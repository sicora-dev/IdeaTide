'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Lightbulb, 
  Sparkles, 
  X, 
  Loader2 
} from 'lucide-react';

interface CreateIdeaModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onCreate?: (ideaData: any) => Promise<void>;
  onCancel?: () => void;
  href?: string;
}

interface CategoryOption {
  value: string;
  label: string;
  subcategories: string[];
}

const categories: CategoryOption[] = [
  { 
    value: 'technology', 
    label: 'Tecnología', 
    subcategories: ['mobile_app', 'web_app', 'ai', 'iot', 'blockchain'] 
  },
  { 
    value: 'sustainability', 
    label: 'Sostenibilidad', 
    subcategories: ['green_tech', 'renewable_energy', 'recycling', 'sustainable_agriculture'] 
  },
  { 
    value: 'social', 
    label: 'Social', 
    subcategories: ['web_platform', 'social_network', 'community', 'social_education'] 
  },
  { 
    value: 'health', 
    label: 'Salud', 
    subcategories: ['medical_app', 'wellness', 'fitness', 'nutrition'] 
  },
  { 
    value: 'finance', 
    label: 'Finanzas', 
    subcategories: ['fintech', 'investment', 'savings', 'cryptocurrency'] 
  },
  { 
    value: 'entertainment', 
    label: 'Entretenimiento', 
    subcategories: ['games', 'music', 'video', 'art'] 
  },
  { 
    value: 'education', 
    label: 'Educación', 
    subcategories: ['elearning', 'educational_tools', 'languages', 'skills'] 
  },
  { 
    value: 'business', 
    label: 'Negocios', 
    subcategories: ['startup', 'b2b', 'b2c', 'marketplace'] 
  }
];

const subcategoryLabels: Record<string, string> = {
  'mobile_app': 'Aplicación Móvil',
  'web_app': 'Aplicación Web',
  'ai': 'Inteligencia Artificial',
  'iot': 'IoT',
  'blockchain': 'Blockchain',
  'green_tech': 'Tecnología Verde',
  'renewable_energy': 'Energía Renovable',
  'recycling': 'Reciclaje',
  'sustainable_agriculture': 'Agricultura Sostenible',
  'web_platform': 'Plataforma Web',
  'social_network': 'Red Social',
  'community': 'Comunidad',
  'social_education': 'Educación Social',
  'medical_app': 'Aplicación Médica',
  'wellness': 'Bienestar',
  'fitness': 'Fitness',
  'nutrition': 'Nutrición',
  'fintech': 'Fintech',
  'investment': 'Inversión',
  'savings': 'Ahorro',
  'cryptocurrency': 'Criptomonedas',
  'games': 'Juegos',
  'music': 'Música',
  'video': 'Video',
  'art': 'Arte',
  'elearning': 'E-learning',
  'educational_tools': 'Herramientas Educativas',
  'languages': 'Idiomas',
  'skills': 'Habilidades',
  'startup': 'Startup',
  'b2b': 'B2B',
  'b2c': 'B2C',
  'marketplace': 'Marketplace'
};

export default function CreateIdeaModal({ 
  open, 
  onOpenChangeAction, 
  onCreate, 
  onCancel,
  href 
}: CreateIdeaModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    priority: 'media',
    estimated_effort: 'Media',
    potential_impact: 'Medio',
  });

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      subcategory: '',
      priority: 'media',
      estimated_effort: 'Media',
      potential_impact: 'Medio',
    });
    setTags([]);
    setTagInput('');
    setSelectedCategory('');
    setAvailableSubcategories([]);
  };

  const handleCategoryChange = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    setSelectedCategory(value);
    setAvailableSubcategories(category ? category.subcategories : []);
    setFormData(prev => ({ 
      ...prev, 
      category: value, 
      subcategory: '' 
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChangeAction(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.subcategory) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    
    try {
      const ideaData = {
        ...formData,
        tags,
      };

      if (onCreate) {
        console.log('Creating idea with data:', ideaData);
        await onCreate(ideaData);
        toast.success('¡Idea creada exitosamente!');
      } else if (href) {
        window.location.href = href;
        return;
      }
      
      toast.success('¡Idea creada exitosamente!');
      onOpenChangeAction(false);
      
    } catch (error) {
      toast.error('Error al crear la idea');
      console.error('Error creating idea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction} modal={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Nueva Idea
          </DialogTitle>
          <DialogDescription>
            Captura y organiza tu próxima gran idea
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-semibold">Información Básica</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ej: App de Meditación Gamificada"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe tu idea con el mayor detalle posible..."
                rows={4}
                value={formData.description}
                onChange={(e: any) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">
                  Subcategoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, subcategory: value }))}
                  required
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategoryLabels[subcategory] || subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Escribe un tag y presiona Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Añadir
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Evaluación del Proyecto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-semibold">Evaluación del Proyecto</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedEffort">Esfuerzo Estimado</Label>
                <Select
                  value={formData.estimated_effort}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, estimated_effort: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="potentialImpact">Impacto Potencial</Label>
                <Select
                  value={formData.potential_impact}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, potential_impact: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bajo">Bajo</SelectItem>
                    <SelectItem value="Medio">Medio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Crear Idea
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}