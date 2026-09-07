import '@/index.css';
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, Download, Printer, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Bill {
  billId:        string;
  billingPeriod: string;
  totalAmount:   number;
  usageUnits:    number;
  status:        string;
  dueDate:       string;
}

interface BillsTableProps {
  bills:        Bill[];
  pageIndex:    number;
  totalPages:   number;
  totalElements: number;
  itemsPerPage: number;
  setPageIndex: (fn: (prev: number) => number) => void;
  onView:       (bill: Bill) => void;
  onDownload:   (bill: Bill) => void;
  onPrint:      (bill: Bill) => void;
}

export const BillsTable: React.FC<BillsTableProps> = ({
  bills, pageIndex, totalPages, totalElements, itemsPerPage, setPageIndex, onView, onDownload, onPrint
}) => {
  const { t } = useTranslation('billing');
  const page = bills; // backend already returns a page of items

  return (
    <Card className="shadow-card border-none overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              {[t('history.table.billingPeriod'), t('history.table.amount'), t('history.table.usage'), t('history.table.status'), t('history.table.dueDate'), ''].map(h => (
                <th key={h} className={`p-5 font-semibold text-sm ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.map(bill => (        // Render each bill row with framer-motion for hover effect
              <motion.tr key={bill.billId} className="border-t border-border hover:bg-secondary/30 transition-colors group">
                <td className="p-5 font-semibold">{bill.billingPeriod}</td>
                <td className="p-5 font-bold text-lg">{t('currency')} {bill.totalAmount.toLocaleString()}</td>
                <td className="p-5 text-muted-foreground">{bill.usageUnits} {t('history.table.units')}</td>
                <td className="p-5">
                  <Badge variant="secondary" className={`rounded-full px-3 py-1 ${
                    bill.status.toLowerCase() === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {t(`status.${bill.status.toUpperCase()}`, { defaultValue: bill.status })}
                  </Badge>
                </td>
                <td className="p-5 text-muted-foreground">{bill.dueDate}</td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(bill)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDownload(bill)}><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onPrint(bill)}><Printer className="w-4 h-4" /></Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (        // Pagination Controls
          <div className="p-4 border-t bg-secondary/20 flex justify-center items-center gap-4">
            <Button variant="outline" size="sm"
              onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
              disabled={pageIndex === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> {t('history.table.previous')}
            </Button>
            <span className="text-sm font-medium">
              {t('history.table.showing')} {pageIndex * itemsPerPage + 1} - {Math.min((pageIndex + 1) * itemsPerPage, totalElements)} {t('history.table.of')} {totalElements}
            </span>
            <Button variant="outline" size="sm"
              onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={pageIndex >= totalPages - 1}>
              {t('history.table.next')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
        {bills.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">{t('history.table.noBills')}</div>
        )}
      </div>
    </Card>
  );
};
