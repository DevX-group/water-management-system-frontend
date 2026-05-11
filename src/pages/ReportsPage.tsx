import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { monthlyDataByYear, customerWiseDataByYear, areaWiseDataByYear, billsData, billsTableData, overdueTableData } from '@/utils/reportData';
import { MonthlyReportTab } from '@/components/reports/MonthlyReportTab';
import { CustomerReportTab } from '@/components/reports/CustomerReportTab';
import { AreaReportTab } from '@/components/reports/AreaReportTab';
import { BillsReportTab } from '@/components/reports/BillsReportTab';
import { OverdueReportTab } from '@/components/reports/OverdueReportTab';

export const ReportsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [customerSearch, setCustomerSearch] = useState('C001');
  const [customerYear, setCustomerYear] = useState('2026');
  const [selectedArea, setSelectedArea] = useState('all');
  const [areaYear, setAreaYear] = useState('2026');
  const [customerSearchBill, setCustomerSearchBill] = useState(""); 
  const [overdueBill, setoverdueBill] = useState("");

  const getCustomerKeyFromId = (customerId: string): string => ({ 'C001': 'customer1', 'C002': 'customer2', 'C003': 'customer3' }[customerId.toUpperCase()] || 'customer1');
  const selectedCustomer = getCustomerKeyFromId(customerSearch);
  const customerNames: Record<string, string> = { customer1: 'Customer 1', customer2: 'Customer 2', customer3: 'Customer 3' };
  const customerColors: Record<string, string> = { customer1: 'hsl(187, 75%, 35%)', customer2: 'hsl(152, 70%, 40%)', customer3: 'hsl(38, 92%, 55%)' };
  
  const CUSTOMER_UNIT_RATE = 15;
  const customerDataForYear = customerWiseDataByYear[customerYear as keyof typeof customerWiseDataByYear] || customerWiseDataByYear['2026'];
  const customerChartData = customerDataForYear.map((m: any) => {
    const usage = selectedCustomer === 'customer2' ? m.customer2 : selectedCustomer === 'customer3' ? m.customer3 : m.customer1;
    return { month: m.month, usage, revenue: usage * CUSTOMER_UNIT_RATE };
  });

  const areaDataForYear = areaWiseDataByYear[areaYear as keyof typeof areaWiseDataByYear] || areaWiseDataByYear['2026'];

  const filteredBills = customerSearchBill ? billsTableData.filter(bill => bill.customerid.toUpperCase().includes(customerSearchBill)) : billsTableData;
  const transformedBillsData = filteredBills.map(bill => ({ month: bill.dueDate, usage: 1, revenue: bill.amount }));
  
  const filteredOverdue = overdueBill ? overdueTableData.filter(overdue => overdue.customerid.toUpperCase().includes(overdueBill)) : overdueTableData;
  const totalOverdueAmount = overdueTableData.reduce((sum, item) => sum + item.amount, 0);  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Summarized and detailed views of system data for monitoring and analysis</p>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="customer">Customer Report</TabsTrigger>
          <TabsTrigger value="area">Area Report</TabsTrigger>
          <TabsTrigger value="bills">Bills Report</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Report</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <MonthlyReportTab selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <CustomerReportTab
            customerSearch={customerSearch} setCustomerSearch={setCustomerSearch}
            customerYear={customerYear} setCustomerYear={setCustomerYear}
            customerChartData={customerChartData} selectedCustomer={selectedCustomer}
            customerNames={customerNames} customerColors={customerColors}
          />
        </TabsContent>

        <TabsContent value="area" className="space-y-6">
          <AreaReportTab
            selectedArea={selectedArea} setSelectedArea={setSelectedArea}
            areaYear={areaYear} setAreaYear={setAreaYear}
            areaDataForYear={areaDataForYear}
          />
        </TabsContent>

        <TabsContent value="bills" className="space-y-6">
          <BillsReportTab
            customerSearchBill={customerSearchBill} setCustomerSearchBill={setCustomerSearchBill}
            filteredBills={filteredBills} billsData={billsData} transformedBillsData={transformedBillsData}
          />
        </TabsContent>

        <TabsContent value="overdue" className="space-y-6">
          <OverdueReportTab
            overdueBill={overdueBill} setoverdueBill={setoverdueBill}
            filteredOverdue={filteredOverdue} totalOverdueAmount={totalOverdueAmount}
            overdueTableData={overdueTableData} transformedBillsData={transformedBillsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
