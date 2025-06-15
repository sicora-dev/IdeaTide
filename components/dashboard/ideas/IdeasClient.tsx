'use client';

import { useMemo, useState } from 'react';
import { SelectIdea } from '@/lib/db/schema';
import { IdeasHeader } from './IdeasHeader';
import { IdeasFilters } from './IdeasFilters';
import { IdeasGridView } from './IdeasGridView';
import { IdeasMapView } from './IdeasMapView';
import { useIdeasData } from '@/hooks/dashboard/ideas/useIdeasData';
import { useIdeasFilters } from '@/hooks/dashboard/ideas/useIdeasFilters';
import CreateIdeaModal from './CreateIdeaModal';

interface IdeasClientProps {
  initialIdeas: SelectIdea[];
}

export default function IdeasClient({ initialIdeas }: IdeasClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    ideas,
    handleCreateIdea,
    handleUpdateIdea,
    handleDeleteIdea,
    handleViewIdea,
    isLoading
  } = useIdeasData(initialIdeas);

  const {
    searchTerm,
    filterStatus,
    filteredIdeas,
    setSearchTerm,
    setFilterStatus
  } = useIdeasFilters(ideas);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col space-y-6 p-6 min-h-0">
        <IdeasHeader 
          totalIdeas={ideas.length}
          onCreateIdea={() => setShowCreateModal(true)}
        />

        <IdeasFilters
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          viewMode={viewMode}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterStatus}
          onViewModeChange={setViewMode}
        />

        {viewMode === 'grid' ? (
          <IdeasGridView 
            ideas={filteredIdeas}
            onViewIdea={handleViewIdea}
            onUpdateIdea={handleUpdateIdea}
            onDeleteIdea={handleDeleteIdea}
            onCreateIdea={() => setShowCreateModal(true)}
            isLoading={isLoading}
          />
        ) : (
          <IdeasMapView 
            ideas={filteredIdeas}
            onViewIdea={handleViewIdea}
            onUpdateIdea={handleUpdateIdea}
            onDeleteIdea={handleDeleteIdea}
            isLoading={isLoading}
          />
        )}
      </div>

      <CreateIdeaModal
        open={showCreateModal}
        onOpenChangeAction={() => setShowCreateModal}
        onCreate={handleCreateIdea}
        onCancel={() => setShowCreateModal(false)}
      />
    </div>
  );
}