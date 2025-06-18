import { Brain, Lightbulb, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdeasHeaderProps {
  totalIdeas: number;
  onCreateIdea: () => void;
}

export function IdeasHeader({ totalIdeas, onCreateIdea }: IdeasHeaderProps) {
  return (
    <div className="flex md:flex-row flex-col space-y-2 space-x-2 items-center justify-between">
      <div className='flex flex-col space-y-1'>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lightbulb className="h-8 w-8" />
          My Ideas
        </h1>
        <p className="text-muted-foreground">
          Manage, organize, and develop all your creative ideas ({totalIdeas} ideas)
        </p>
      </div>
      <div className="flex gap-2 self-end">
        <Button 
          className='bg-rainbow hover:bg-rainbow-hover'     
          variant="default" 
          size="sm"
          onClick={onCreateIdea}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Idea
        </Button>
      </div>
    </div>
  );
}