import React from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { exportPDF } from '@/util/exportPDF';

interface BillsReportTabProps {
  customerSearchBill: string;
  setCustomerSearchBill: (v: string) => void;
  filteredBills: any[];
  billsData: any[];
  transformedBillsData: any[];
}

export const BillsReportTab: React.FC<BillsReportTabProps> = ({
  customerSearchBill, setCustomerSearchBill, filteredBills, billsData, transformedBillsData
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Paid vs Unpaid Bills Report</CardTitle>
      <CardDescription>Overview of bill payment status with comparison and detailed listings</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={billsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Bar dataKey="count" name="Number of Bills" fill="hsl(187, 75%, 35%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end">
        <Input placeholder="Search Customer ID (C001, C002, C003)" value={customerSearchBill} onChange={(e) => setCustomerSearchBill(e.target.value.toUpperCase())} className="w-48" />
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.customerid}</TableCell>
                  <TableCell>{bill.customer}</TableCell>
                  <TableCell>LKR {bill.amount.toLocaleString()}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell><span className={`px-3 py-1 rounded-full text-xs font-medium ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{bill.status}</span></TableCell>
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
