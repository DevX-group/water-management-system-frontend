import '@/index.css';
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface Bill {
  billId: string;
  status: string;
  totalAmount: number;
  balanceDue: number;
}

interface BillsSummaryStatsProps {
  bills: Bill[];
}
 
export const BillsSummaryStats: React.FC<BillsSummaryStatsProps> = ({ bills }) => {   // Calculate summary stats for cards
  const { t } = useTranslation('billing');
  const totalPaid = bills
    .filter(b => b.status.toLowerCase() === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalOutstanding = bills
    .filter(b => b.status.toLowerCase() !== 'paid')
    .reduce((sum, b) => sum + b.balanceDue, 0);

  const avgMonthly = bills.length > 0
    ? bills.reduce((sum, b) => sum + b.totalAmount, 0) / bills.length
    : 0;

  const stats = [
    { label: t('history.stats.totalPaid'),   value: `${t('currency')} ${totalPaid.toLocaleString()}`,       icon: CheckCircle2, color: 'text-success',  bgColor: 'bg-success/10' },
    { label: t('history.stats.outstanding'), value: `${t('currency')} ${totalOutstanding.toLocaleString()}`, icon: AlertCircle,  color: 'text-warning',  bgColor: 'bg-warning/10' },
    { label: t('history.stats.avgMonthly'), value: `${t('currency')} ${avgMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'text-primary', bgColor: 'bg-primary/10' },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }} className="stat-card">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
