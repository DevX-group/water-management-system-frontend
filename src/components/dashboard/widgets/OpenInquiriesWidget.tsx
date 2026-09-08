import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

interface InquirySummary {
  id: string;
  name: string;
  category: string;
  status: string;
  createdAt: string;
}

export const OpenInquiriesWidget: React.FC = () => {
  const { t } = useTranslation('widgetManagement');
  const [inquiries, setInquiries] = useState<InquirySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/inquiries')
      .then((res) => {
        const all: InquirySummary[] = res.data ?? [];
        setInquiries(all.filter((i) => i.status === 'open').slice(0, 5));
      })
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-16 bg-muted rounded" />;

  if (!inquiries.length) {
    return (
      <div className="flex items-center gap-2 text-success text-xs">
        <CheckCircle className="w-4 h-4" />
        {t('widgetContent.noOpenInquiries')}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {inquiries.map((inq) => (
        <li key={inq.id} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/30">
          <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-accent" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{inq.name}</p>
            <p className="text-muted-foreground">{inq.category}</p>
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {new Date(inq.createdAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
};
