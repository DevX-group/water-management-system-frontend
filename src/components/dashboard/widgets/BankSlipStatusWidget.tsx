import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { getMySlips } from '@/services/bankSlipService';

interface SlipItem {
  slipId: number;
  amount: number;
  status: string;
  bankPaymentDate: string;
  uploadedAt: string;
}

export const BankSlipStatusWidget: React.FC = () => {
  const [slips, setSlips] = useState<SlipItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySlips(0, 4)
      .then((res) => setSlips(res.content ?? res ?? []))
      .catch(() => setSlips([]))
      .finally(() => setLoading(false));
  }, []);

  const statusIcon = (status: string) => {
    if (status === 'APPROVED') return <CheckCircle className="w-3.5 h-3.5 text-success" />;
    if (status === 'REJECTED') return <XCircle className="w-3.5 h-3.5 text-destructive" />;
    return <Clock className="w-3.5 h-3.5 text-warning" />;
  };

  if (loading) return <div className="animate-pulse h-16 bg-muted rounded" />;

  if (!slips.length) {
    return <p className="text-xs text-muted-foreground text-center py-4">No bank slips submitted.</p>;
  }

  return (
    <ul className="space-y-1.5">
      {slips.map((s) => (
        <li key={s.slipId} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {statusIcon(s.status)}
            <span className="font-medium">Rs. {Number(s.amount).toLocaleString()}</span>
          </div>
          <span className="text-muted-foreground">
            {new Date(s.uploadedAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
};
