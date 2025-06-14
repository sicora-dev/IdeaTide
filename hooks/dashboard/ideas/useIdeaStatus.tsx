import { useCallback } from 'react';
import { Circle, Clock, CheckCircle } from 'lucide-react';

export function useIdeaStatus() {
  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'new': return <Circle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'completed': return 'bg-green-100 border-green-300 text-green-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  }, []);

  return {
    getStatusIcon,
    getStatusColor,
    getPriorityColor
  };
}