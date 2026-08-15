import '@/index.css';
import React from 'react';
import clsx from 'clsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Inquiry } from '@/types/inquiry';

import { useTranslation } from 'react-i18next';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation('inquiry');
  const config: Record<string, { labelKey: string; className: string }> = {
    open:     { labelKey: 'status.open',     className: 'bg-primary/10 text-blue-400 border-primary/20' },
    pending:  { labelKey: 'status.pending',  className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    resolved: { labelKey: 'status.resolved', className: 'bg-success/10 text-emerald-400 border-success/20' },
  };
  const badgeConfig = config[status.toLowerCase()] ?? { labelKey: status, className: 'bg-secondary text-muted-foreground' };
  const label = config[status.toLowerCase()] ? t(badgeConfig.labelKey) : status;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeConfig.className}`}>{label}</span>;
};

interface InquiryHistoryListProps {
  inquiries:        Inquiry[];
  historyIndex:     number;
  itemsPerPage:     number;
  viewingHistoryId: string | null;
  setViewingHistoryId: (id: string | null) => void;
  setHistoryIndex:  (fn: (prev: number) => number) => void;
}

export const InquiryHistoryList: React.FC<InquiryHistoryListProps> = ({
  inquiries, historyIndex, itemsPerPage, viewingHistoryId, setViewingHistoryId, setHistoryIndex,
}) => {
  const { t } = useTranslation('inquiry');
  
  if (inquiries.length === 0) return null;
  return (
    <Card className="shadow-card border-none overflow-hidden bg-card">
      <div className="p-4 bg-primary/5 border-b flex items-center gap-2 text-primary font-semibold text-sm">
        <History size={16} />  {t('history.title')}
      </div>
      <CardContent className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
        {inquiries.slice(historyIndex, historyIndex + itemsPerPage).map((inq) => (
          <button
            key={inq.id} onClick={() => setViewingHistoryId(inq.id)}
            className={clsx("w-full text-left p-3 rounded-xl transition-all border",
              viewingHistoryId === inq.id ? "bg-primary/5 border-primary/20 shadow-sm" : "border-transparent hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="text-xs font-semibold truncate">{inq.category ? t(`categories.${inq.category}`) : t('history.general')}</span>
              <StatusBadge status={inq.status} />
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{inq.messages[inq.messages.length - 1]?.text}</p> {/*Last message preview*/} 
            <p className="text-[10px] text-primary/60 mt-1">{inq.id}</p>
          </button>
        ))}
        {inquiries.length > itemsPerPage && (  // Show pagination controls
          <div className="flex justify-center items-center gap-2 mt-4 pb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setHistoryIndex(p => Math.max(0, p - itemsPerPage))} disabled={historyIndex === 0}>
              <ArrowLeft size={14} />
            </Button>
            <span className="text-[10px] font-medium text-muted-foreground">
              {historyIndex + 1}-{Math.min(historyIndex + itemsPerPage, inquiries.length)} / {inquiries.length}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setHistoryIndex(p => Math.min(inquiries.length - itemsPerPage, p + itemsPerPage))} disabled={historyIndex + itemsPerPage >= inquiries.length}>
              <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
