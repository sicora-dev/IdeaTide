import { useState, useMemo } from 'react';
import { SelectIdea } from '@/lib/db/schema';
import { useDebounce } from '@/hooks/shared/useDebounce';

export function useIdeasFilters(ideas: SelectIdea[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'priority' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredIdeas = useMemo(() => {
    let filtered = ideas.filter(idea => {
      const matchesSearch = 
        idea.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        idea.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      const matchesFilter = 
        filterStatus === 'all' ||
        (filterStatus === 'favorites' && idea.is_favorite) ||
        idea.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

    // Ordenamiento optimizado
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [ideas, debouncedSearchTerm, filterStatus, sortBy, sortOrder]);

  return {
    searchTerm,
    filterStatus,
    sortBy,
    sortOrder,
    filteredIdeas,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    setSortOrder
  };
}