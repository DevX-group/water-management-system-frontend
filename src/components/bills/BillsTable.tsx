import '@/index.css';
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, ArrowLeft, ArrowRight } from 'lucide-react';
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
  currentIndex: number;
  itemsPerPage: number;
  setCurrentIndex: (fn: (prev: number) => number) => void;
  onView:       (bill: Bill) => void;
  onDownload:   (bill: Bill) => void;
}

export const BillsTable: React.FC<BillsTableProps> = ({
  bills, currentIndex, itemsPerPage, setCurrentIndex, onView, onDownload,
}) => {
  const page = bills.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <Card className="shadow-card border-none overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              {['Billing Period', 'Amount', 'Usage', 'Status', 'Due Date', ''].map(h => (
                <th key={h} className={`p-5 font-semibold text-sm ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.map(bill => (
              <motion.tr key={bill.billId} className="border-t border-border hover:bg-secondary/30 transition-colors group">
                <td className="p-5 font-semibold">{bill.billingPeriod}</td>
                <td className="p-5 font-bold text-lg">LKR {bill.totalAmount.toLocaleString()}</td>
                <td className="p-5 text-muted-foreground">{bill.usageUnits} units</td>
                <td className="p-5">
                  <Badge variant="secondary" className={`rounded-full px-3 py-1 ${
                    bill.status.toLowerCase() === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {bill.status}
                  </Badge>
                </td>
                <td className="p-5 text-muted-foreground">{bill.dueDate}</td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(bill)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDownload(bill)}><Download className="w-4 h-4" /></Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {bills.length > itemsPerPage && (
          <div className="p-4 border-t bg-secondary/20 flex justify-center items-center gap-4">
            <Button variant="outline" size="sm"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - itemsPerPage))}
              disabled={currentIndex === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="text-sm font-medium">
              Showing {currentIndex + 1} - {Math.min(currentIndex + itemsPerPage, bills.length)} of {bills.length}
            </span>
            <Button variant="outline" size="sm"
              onClick={() => setCurrentIndex(prev => Math.min(bills.length - itemsPerPage, prev + itemsPerPage))}
              disabled={currentIndex + itemsPerPage >= bills.length}>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
        {bills.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">No bills found.</div>
        )}
      </div>
    </Card>
  );
};
