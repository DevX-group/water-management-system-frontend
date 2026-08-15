import '@/index.css';
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { exportPDF } from '@/util/exportPDF';

interface OverdueReportTabProps {
  overdueBill: string;
  setoverdueBill: (v: string) => void;
  filteredOverdue: any[];
  totalOverdueAmount: number;
  overdueTableData: any[];
  transformedBillsData: any[];
}

export const OverdueReportTab: React.FC<OverdueReportTabProps> = ({
  overdueBill, setoverdueBill, filteredOverdue, totalOverdueAmount, overdueTableData, transformedBillsData
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Overdue Payments Report</CardTitle>
      <CardDescription>Unpaid bills that have passed their due dates with financial risk analysis</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Overdue Amount</p>
          <p className="text-3xl font-bold text-destructive">LKR {totalOverdueAmount.toLocaleString()}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Number of Overdue Bills</p>
          <p className="text-3xl font-bold text-destructive">{overdueTableData.length}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Input placeholder="Search Customer ID (C001, C002, C003)" value={overdueBill} onChange={(e) => setoverdueBill(e.target.value.toUpperCase())} className="w-48" />
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Days Overdue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOverdue.length > 0 ? (
              filteredOverdue.map((overdue) => (
                <TableRow key={overdue.id}>
                  <TableCell className="font-medium">{overdue.id}</TableCell>
                  <TableCell>{overdue.customerid}</TableCell>
                  <TableCell>{overdue.customer}</TableCell>
                  <TableCell>LKR {overdue.amount.toLocaleString()}</TableCell>
                  <TableCell>{overdue.dueDate}</TableCell>
                  <TableCell><span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">{overdue.daysOverdue} days</span></TableCell>
                </TableRow>
              ))
            ) : <TableRow><TableCell colSpan={6} className="text-center">No results found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => exportPDF({ bills: transformedBillsData }, `BillsReport.pdf`)}>
          <Download className="w-4 h-4 mr-2" /> Export as PDF
        </Button>
      </div>
    </CardContent>
  </Card>
);
