import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

type PlaceholderPanelProps = {
  placeholders: string[];
  onInsert: (placeholder: string) => void;
};

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ placeholders, onInsert }) => {
  const { t } = useTranslation('messaging');
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{t('placeholderPanel.title')}</Label>
      <div className="flex flex-wrap gap-2">
        {placeholders.length === 0 ? (
          <div className="text-xs text-muted-foreground">{t('placeholderPanel.empty')}</div>
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
