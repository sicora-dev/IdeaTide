'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
import { useRouter } from 'next/navigation';

interface CreateIdeaModalProps {
  open: boolean;
  onOpenChangeAction: () => void;
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
    label: 'Technology', 
    subcategories: ['mobile_app', 'web_app', 'ai', 'iot', 'blockchain'] 
  },
  { 
    value: 'sustainability', 
    label: 'Sustainability', 
    subcategories: ['green_tech', 'renewable_energy', 'recycling', 'sustainable_agriculture'] 
  },
  { 
    value: 'social', 
    label: 'Social', 
    subcategories: ['web_platform', 'social_network', 'community', 'social_education'] 
  },
  { 
    value: 'health', 
    label: 'Health', 
    subcategories: ['medical_app', 'wellness', 'fitness', 'nutrition'] 
  },
  { 
    value: 'finance', 
    label: 'Finance', 
    subcategories: ['fintech', 'investment', 'savings', 'cryptocurrency'] 
  },
  { 
    value: 'entertainment', 
    label: 'Entertainment', 
    subcategories: ['games', 'music', 'video', 'art'] 
  },
  { 
    value: 'education', 
    label: 'Education', 
    subcategories: ['elearning', 'educational_tools', 'languages', 'skills'] 
  },
  { 
    value: 'business', 
    label: 'Business', 
    subcategories: ['startup', 'b2b', 'b2c', 'marketplace'] 
  }
];

const subcategoryLabels: Record<string, string> = {
  'mobile_app': 'Mobile App',
  'web_app': 'Web App',
  'ai': 'Artificial Intelligence',
  'iot': 'IoT',
  'blockchain': 'Blockchain',
  'green_tech': 'Green Tech',
  'renewable_energy': 'Renewable Energy',
  'recycling': 'Recycling',
  'sustainable_agriculture': 'Sustainable Agriculture',
  'web_platform': 'Web Platform',
  'social_network': 'Social Network',
  'community': 'Community',
  'social_education': 'Social Education',
  'medical_app': 'Medical App',
  'wellness': 'Wellness',
  'fitness': 'Fitness',
  'nutrition': 'Nutrition',
  'fintech': 'Fintech',
  'investment': 'Investment',
  'savings': 'Savings',
  'cryptocurrency': 'Cryptocurrency',
  'games': 'Games',
  'music': 'Music',
  'video': 'Video',
  'art': 'Art',
  'elearning': 'E-learning',
  'educational_tools': 'Educational Tools',
  'languages': 'Languages',
  'skills': 'Skills',
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
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    priority: 'medium',
    estimated_effort: 'medium',
    potential_impact: 'medium',
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
      priority: 'medium',
      estimated_effort: 'medium',
      potential_impact: 'medium',
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
    onOpenChangeAction();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.subcategory) {
      toast.error('Please complete all required fields');
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
        toast.success('Idea created successfully!');
      } else if (href) {
        router.push(href);
        return;
      }
      onOpenChangeAction();
      
    } catch (error) {
      toast.error('Error creating idea');
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
            New Idea
          </DialogTitle>
          <DialogDescription>
            Capture and organize your next big idea
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="E.g. Gamified Meditation App"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your idea in as much detail as possible..."
                rows={4}
                value={formData.description}
                onChange={(e: any) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
                  Subcategory <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, subcategory: value }))}
                  required
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
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
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
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

          {/* Project Evaluation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-semibold">Project Evaluation</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, priority: value }))}
                >
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
                <Label htmlFor="estimatedEffort">Estimated Effort</Label>
                <Select
                  value={formData.estimated_effort}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, estimated_effort: value }))}
                >
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
                <Label htmlFor="potentialImpact">Potential Impact</Label>
                <Select
                  value={formData.potential_impact}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, potential_impact: value }))}
                >
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
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button variant="default" type="submit" className="flex-1 bg-rainbow hover:bg-rainbow-hover" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Create Idea
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}