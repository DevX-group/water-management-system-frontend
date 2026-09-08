import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { getAllPendingSlips } from '@/services/bankSlipService';
import type { AdminBankSlipResponse } from '@/types/bankSlip';
import { useTranslation } from 'react-i18next';

export const PendingSlipsWidget: React.FC = () => {
  const { t } = useTranslation('widgetManagement');
  const [slips, setSlips] = useState<AdminBankSlipResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPendingSlips()
      .then((data) => setSlips(data.slice(0, 5)))
      .catch(() => setSlips([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-16 bg-muted rounded" />;

  if (!slips.length) {
    return (
      <div className="flex items-center gap-2 text-success text-xs">
        <CheckCircle className="w-4 h-4" />
        {t('widgetContent.noPendingSlips')}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-warning" />
        <span className="text-sm font-semibold text-warning">{slips.length} {t('widgetContent.pending')}</span>
      </div>
      <ul className="space-y-1">
        {slips.map((s) => (
          <li key={s.slipId} className="flex justify-between items-center text-xs py-1 border-b border-border/40">
            <span className="font-medium text-foreground">{s.subscriptionNumber}</span>
            <span className="text-muted-foreground">{t('widgetContent.currency')} {Number(s.amount).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
