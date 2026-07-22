import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type PlaceholderPanelProps = {
  placeholders: string[];
  onInsert: (placeholder: string) => void;
};

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ placeholders, onInsert }) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Placeholders (Click to copy/insert)</Label>
      <div className="flex flex-wrap gap-2">
        {placeholders.length === 0 ? (
          <div className="text-xs text-muted-foreground">No placeholders available.</div>
        ) : (
          placeholders.map((placeholder) => (
            <Button
              key={placeholder}
              variant="outline"
              size="sm"
              onClick={() => onInsert(placeholder)}
              className="h-6 text-[10px] px-2"
            >
              {placeholder}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
