import { useRef, useMemo, useLayoutEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SelectIdea } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb } from 'lucide-react';
import IdeaCard from './IdeaCard';

interface IdeasGridViewProps {
  ideas: SelectIdea[];
  onViewIdea: (id: number) => void;
  onUpdateIdea: (idea: SelectIdea) => void;
  onDeleteIdea: (id: number) => void;
  onCreateIdea: () => void;
  isLoading: boolean;
}

const CARD_WIDTH = 380;
const MIN_CARD_HEIGHT = 200;
const GAP = 24;

export function IdeasGridView({ 
  ideas, 
  onViewIdea, 
  onUpdateIdea, 
  onDeleteIdea, 
  onCreateIdea,
  isLoading 
}: IdeasGridViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [cardHeights, setCardHeights] = useState<Record<string, number>>({});

  // Observar cambios de tamaño del contenedor
  useLayoutEffect(() => {
    if (!parentRef.current) return;

    const updateWidth = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(parentRef.current);
    updateWidth();

    return () => resizeObserver.disconnect();
  }, []);

  // Calcular columnas basado en el ancho real del contenedor
  const columnsPerRow = Math.max(1, Math.floor((containerWidth - GAP) / (CARD_WIDTH + GAP)));

  // Preparar datos para virtualización con medición de altura
  const virtualRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < ideas.length; i += columnsPerRow) {
      const rowIdeas = ideas.slice(i, i + columnsPerRow);
      const rowId = `row-${Math.floor(i / columnsPerRow)}`;
      
      // Calcular altura de la fila basada en la carta más alta
      const maxHeightInRow = rowIdeas.reduce((max, idea) => {
        const cardHeight = cardHeights[`card-${idea.id}`] || MIN_CARD_HEIGHT;
        return Math.max(max, cardHeight);
      }, MIN_CARD_HEIGHT);

      rows.push({
        ideas: rowIdeas,
        id: rowId,
        height: maxHeightInRow + GAP
      });
    }
    return rows;
  }, [ideas, columnsPerRow, cardHeights]);

  const virtualizer = useVirtualizer({
    count: virtualRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => virtualRows[index]?.height || (MIN_CARD_HEIGHT + GAP),
    overscan: 2,
    // Mejorar el smooth scrolling
    scrollPaddingStart: 0,
    scrollPaddingEnd: 0,
  });

  // Función para medir altura de las tarjetas
  const measureCard = (cardId: string, height: number) => {
    setCardHeights(prev => {
      if (prev[cardId] !== height) {
        return { ...prev, [cardId]: height };
      }
      return prev;
    });
  };

  if (ideas.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by creating your first idea
          </p>
          <Button onClick={onCreateIdea}>
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Para listas pequeñas, usar grid normal sin virtualización
  if (ideas.length <= 6) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 h-full overflow-y-auto p-3 scroll-smooth">
        {ideas.map((idea) => (
          <div key={idea.id}>
            <IdeaCard
              idea={idea}
              onUpdateAction={onUpdateIdea}
              onDeleteAction={onDeleteIdea}
              onViewAction={onViewIdea}
              onHeightChange={(height) => measureCard(`card-${idea.id}`, height)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="w-full h-full min-h-0 max-h-[70dvh] overflow-y-auto scroll-smooth"
      style={{ 
        willChange: 'scroll-position'
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowData = virtualRows[virtualRow.index];
          if (!rowData) return null;
          
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div 
                className="grid gap-6 p-3" 
                style={{ 
                  gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))` 
                }}
              >
                {rowData.ideas.map((idea) => (
                  <div key={idea.id}>
                    <IdeaCard
                      idea={idea}
                      onUpdateAction={onUpdateIdea}
                      onDeleteAction={onDeleteIdea}
                      onViewAction={onViewIdea}
                      onHeightChange={(height) => measureCard(`card-${idea.id}`, height)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}