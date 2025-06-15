import { Filter, Grid, Map, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface IdeasFiltersProps {
  searchTerm: string;
  filterStatus: string;
  viewMode: 'grid' | 'map';
  onSearchChange: (term: string) => void;
  onFilterChange: (status: string) => void;
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

export function IdeasFilters({
  searchTerm,
  filterStatus,
  viewMode,
  onSearchChange,
  onFilterChange,
  onViewModeChange
}: IdeasFiltersProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search ideas..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex border rounded-md max-md:hidden">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="rounded-r-none"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'map' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('map')}
          className="rounded-l-none"
        >
          <Map className="h-4 w-4" />
        </Button>
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
          <DropdownMenuItem onClick={() => onFilterChange('all')}>
            All ideas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('favorites')}>
            Favorites
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('in_progress')}>
            In Progress
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange('new')}>
            New
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('completed')}>
            Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}