import React, { useEffect, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { exportPDF } from '@/util/exportPDF';

type MonthlyReportRow = {
  month: string;
  usage: number;
  revenue: number;
};

export const ReportsPage = () => {
  const [year, setYear] = useState(2023);
  const [reports, setReports] = useState([]);

  const [customerId, setCustomerId] = useState("C001");
  const [customerYear, setCustomerYear] = useState("2025");
  const [data, setData] = useState([]);

  const [areaData, setAreaData] = useState([]);
  const [areaYear, setAreaYear] = useState("2026");
  const [selectedArea, setSelectedArea] = useState("all");

  const [billsTableData, setBillsTableData] = useState([]);
  const [customerSearchBill, setCustomerSearchBill] = useState(""); 

  const [overdueTableData, setOverdueTableData] = useState([]);
  const [overdueBill, setoverdueBill] = useState("");

  //Monthly report data fetch 
  useEffect(() => {
  fetch(`http://localhost:8081/api/reports/monthly?year=${year}`)
    .then(res => res.json())
    .then(data => setReports(data));
}, [year]);

//Customer report data fetch 
  useEffect(() => {
    if (!customerId) return;

  fetch(`http://localhost:8081/api/reports/customer?customerId=${customerId}&year=${customerYear}`)
    .then(res => res.json())
    .then(result => {
      console.log("API RESULT:", result);
      setData(result);
    });
  }, [customerId, customerYear]);

  //Area report data fetch
  useEffect(() => {
  fetch(`http://localhost:8081/api/reports/area?year=${areaYear}`)
    .then(res => res.json())
    .then(data => {
      console.log("AREA API:", data);
      setAreaData(data);
    })
    .catch(err => console.error(err));
}, [areaYear]);


  // Map customer ID to internal customer reference
  const getCustomerKeyFromId = (customerId: string): string => {
    const idMap: Record<string, string> = {
      'C001': 'customer1',
      'C002': 'customer2',
      'C003': 'customer3',
    };
    return idMap[customerId.toUpperCase()] || 'customer1';
  };

  // Prepare customer-specific chart data (only the selected customer)
  const customerNames: Record<string, string> = {
    customer1: 'Customer 1',
    customer2: 'Customer 2',
    customer3: 'Customer 3',
  };

  const customerColors: Record<string, string> = {
    customer1: 'hsl(187, 75%, 35%)',
    customer2: 'hsl(152, 70%, 40%)',
    customer3: 'hsl(38, 92%, 55%)',
  };

  // For customers we only have usage in mock data; derive revenue using a per-unit rate
  const CUSTOMER_UNIT_RATE = 15; // LKR per unit (mock)

// Bills report data fetch
useEffect(() => {
  fetch("http://localhost:8081/api/bills_report")
    .then((res) => res.json())
    .then((data) => {
      const mappedBills = data.map((bill) => ({
        id: bill.id,
        customerid: bill.customerId,
        customer: bill.customerName,
        amount: bill.amount,
        dueDate: bill.dueDate,
        status: bill.status === "PAID" ? "Paid" : "Unpaid",
      }));

      setBillsTableData(mappedBills);
    })
    .catch((err) => console.error(err));
}, []);


// Filter bills
const filteredBills = customerSearchBill
  ? billsTableData.filter((bill) =>
      bill.customerid
        .toUpperCase()
        .includes(customerSearchBill.toUpperCase())
    )
  : billsTableData;


  //filter area data based on selected area  
  const filteredAreaData =
  selectedArea === "all"
    ? areaData
    : areaData.map((row) => {
        const base = { month: row.month };

        if (selectedArea === "area1") {
          return {
            ...base,
            area1Usage: row.area1Usage,
            area1Revenue: row.area1Revenue,
          };
        }

        if (selectedArea === "area2") {
          return {
            ...base,
            area2Usage: row.area2Usage,
            area2Revenue: row.area2Revenue,
          };
        }

        if (selectedArea === "area3") {
          return {
            ...base,
            area3Usage: row.area3Usage,
            area3Revenue: row.area3Revenue,
          };
        }

        return row;
      });

  // Chart Data
  const billsData = billsTableData.length > 0 ? [
    {
      status: "Paid",
      count: billsTableData.filter((b) => b.status === "Paid").length,
    },
    {
      status: "Unpaid",
      count: billsTableData.filter((b) => b.status === "Unpaid").length,
    },
  ] : [];

  // PDF Transform
  const transformedBillsData = filteredBills.map((bill) => ({
    month: bill.dueDate,
    usage: 1,
    revenue: bill.amount,
  }));



  //Serach bar for Overdue report + default shows all overdue bills
useEffect(() => {
  fetch("http://localhost:8081/api/bills_report/overdue")
    .then((res) => res.json())
    .then((data) => {
      const today = new Date();

      const mapped = data.map((bill) => {
  const due = new Date(bill.dueDate);

  const daysOverdue = Math.max(
    Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

  return {
    id: bill.id,
    customerid: bill.customerId,
    customer: bill.customerName,
    amount: bill.amount,
    dueDate: bill.dueDate,
    daysOverdue,
  };
});

      setOverdueTableData(mapped);
    })
    .catch((err) => console.error("OVERDUE ERROR:", err));
}, []);

const filteredOverdue = overdueBill
  ? overdueTableData.filter((overdue) =>
      overdue.customerid.toUpperCase().includes(overdueBill.toUpperCase())
    )
  : overdueTableData;

  const totalOverdueAmount = overdueTableData.reduce(
  (sum, item) => sum + item.amount,
  0
);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Summarized and detailed views of system data for monitoring and analysis</p>

      </div>

      {/* Tabs for different report types */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="customer">Customer Report</TabsTrigger>
          <TabsTrigger value="area">Area Report</TabsTrigger>
          <TabsTrigger value="bills">Bills Report</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Report</TabsTrigger>
        </TabsList>

        {/* Monthly Usage and Revenue Report */}
<TabsContent value="monthly" className="space-y-6">
  <Card id="monthly-report">
    <CardHeader>
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <CardTitle>Monthly Usage and Revenue Report</CardTitle>
          <CardDescription>
            Usage and revenue trends across months for a selected year
          </CardDescription>
        </div>

        {/* Styled Year Filter (same UI system as others) */}
        <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>

    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={reports}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Usage (L)", position: "top", offset: 10 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />

            <Bar
              dataKey="usage"
              name="Usage (L)"
              fill="hsl(187, 75%, 35%)"
              radius={[4, 4, 0, 0]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue (LKR)"
              stroke="hsl(152, 70%, 40%)"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>

  {/* Export button */}
  <div className="flex justify-end">
  <Button
    onClick={() =>
      exportPDF(
        {
          [year]: reports.map((item) => ({
            month: item.month,
            usage: item.usage ?? item.totalUsage ?? 0,
            revenue: item.revenue ?? item.totalRevenue ?? 0,
          })),
        },
        year.toString(),
        `MonthlyReport-${year}.pdf`
      )
    }
  >
    <Download className="w-4 h-4 mr-2" />
    Export as PDF
  </Button>
</div>
</TabsContent>

        {/* Customer-wise Usage and Revenue Report */}
        <TabsContent value="customer" className="space-y-6">

  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        
        {/* LEFT: Title */}
        <div>
          <CardTitle>Customer-wise Usage and Revenue Report</CardTitle>
          <CardDescription>
            Individual customer consumption and billing trends for a selected year
          </CardDescription>
        </div>

        {/* RIGHT: Filters */}
        <div className="flex items-center gap-2">
          
          {/* Customer ID Input */}
          <Input
            placeholder="Search Customer ID (e.g. C001)"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
            className="w-48"
          />

          {/* Styled Year Select (FIXED) */}
          <Select value={customerYear} onValueChange={setCustomerYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Usage (L)", position: "top", offset: 10 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]?.payload;

                  if (data) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-2 text-sm">
                        <p className="text-foreground">
                          {`Usage: ${Number(data.totalUsage).toLocaleString()} L`}
                        </p>
                        <p className="text-foreground">
                          {`Revenue: LKR ${Number(data.totalAmount).toLocaleString()}`}
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey="totalUsage"
              name="Customer Usage (L)"
              stroke="hsl(187, 75%, 35%)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => exportPDF({ customer: data }, `CustomerReport.pdf`)}>
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
      </div>
    </CardContent>
  </Card>

</TabsContent>

        {/* Area-wise Usage and Revenue Report */}
        <TabsContent value="area" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Area-wise Usage and Revenue Report</CardTitle>
                  <CardDescription>Usage and revenue trends summarized by area for comparison across regions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="area1">Area 1</SelectItem>
                      <SelectItem value="area2">Area 2</SelectItem>
                      <SelectItem value="area3">Area 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={areaYear} onValueChange={setAreaYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={filteredAreaData}>
  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />

  <YAxis
    yAxisId="left"
    stroke="hsl(var(--muted-foreground))"
    label={{ value: "(L)", angle: -90, position: "insideBottom" }}
  />

  <YAxis
    yAxisId="right"
    orientation="right"
    stroke="hsl(var(--muted-foreground))"
    label={{ value: "(LKR)", angle: 90, position: "insideBottom" }}
  />

  <Tooltip
    contentStyle={{
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
    }}
    content={({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0]?.payload;

        return (
          <div className="bg-card border border-border rounded-lg p-2 text-sm">
            {selectedArea === "all" || selectedArea === "area1" ? (
              <p>Area 1 Usage: {data.area1Usage ?? 0}</p>
            ) : null}

            {selectedArea === "all" || selectedArea === "area2" ? (
              <p>Area 2 Usage: {data.area2Usage ?? 0}</p>
            ) : null}

            {selectedArea === "all" || selectedArea === "area3" ? (
              <p>Area 3 Usage: {data.area3Usage ?? 0}</p>
            ) : null}

            {selectedArea === "all" || selectedArea === "area1" ? (
              <p>Area 1 Revenue: {data.area1Revenue ?? 0}</p>
            ) : null}

            {selectedArea === "all" || selectedArea === "area2" ? (
              <p>Area 2 Revenue: {data.area2Revenue ?? 0}</p>
            ) : null}

            {selectedArea === "all" || selectedArea === "area3" ? (
              <p>Area 3 Revenue: {data.area3Revenue ?? 0}</p>
            ) : null}
          </div>
        );
      }
      return null;
    }}
  />

  <Legend />

  {/* AREA 1 */}
  {(selectedArea === "all" || selectedArea === "area1") && (
    <>
      <Bar
        yAxisId="left"
        dataKey="area1Usage"
        name="Area 1 Usage (L)"
        fill="hsl(187, 75%, 35%)"
        radius={[4, 4, 0, 0]}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="area1Revenue"
        name="Area 1 Revenue (LKR)"
        stroke="hsl(187, 75%, 55%)"
        strokeWidth={2}
      />
    </>
  )}

  {/* AREA 2 */}
  {(selectedArea === "all" || selectedArea === "area2") && (
    <>
      <Bar
        yAxisId="left"
        dataKey="area2Usage"
        name="Area 2 Usage (L)"
        fill="hsl(152, 70%, 40%)"
        radius={[4, 4, 0, 0]}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="area2Revenue"
        name="Area 2 Revenue (LKR)"
        stroke="hsl(152, 70%, 60%)"
        strokeWidth={2}
      />
    </>
  )}

  {/* AREA 3 */}
  {(selectedArea === "all" || selectedArea === "area3") && (
    <>
      <Bar
        yAxisId="left"
        dataKey="area3Usage"
        name="Area 3 Usage (L)"
        fill="hsl(38, 92%, 55%)"
        radius={[4, 4, 0, 0]}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="area3Revenue"
        name="Area 3 Revenue (LKR)"
        stroke="hsl(38, 92%, 75%)"
        strokeWidth={2}
      />
    </>
  )}
</ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    exportPDF(
                      {
                        [areaYear]: areaData.map((row) => ({
                          month: row.month,
                          usage: row.area1Usage + row.area2Usage + row.area3Usage,
                          revenue: row.area1Revenue + row.area2Revenue + row.area3Revenue,
                        })),
                      },
                      `AreaReport-${areaYear}.pdf`
                    )
                  }
                >
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paid vs Unpaid Bills Report */}
        <TabsContent value="bills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paid vs Unpaid Bills Report</CardTitle>
              <CardDescription>Overview of bill payment status with comparison and detailed listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(187, 75%, 35%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end">
                  <Input 
                    placeholder="Search Customer ID (C001,...)"
                    value={customerSearchBill}
                    onChange={(e) => setCustomerSearchBill(e.target.value.toUpperCase())}
                    className="w-48"
                  />
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
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bill.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bill.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                    ) : (     //condition ? valueIfTrue : valueIfFalse in jsx
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
              <Button
                onClick={() =>
                exportPDF(
                  {
                     bills: transformedBillsData },
                  `BillsReport.pdf`
                )
                }
                >
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue Payments Report */}
        <TabsContent value="overdue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments Report</CardTitle>
              <CardDescription>Unpaid bills that have passed their due dates with financial risk analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Overdue Amount</p>
                  <p className="text-3xl font-bold text-destructive">LKR {totalOverdueAmount.toLocaleString()}</p>
                </div>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">Number of Overdue Bills</p>
                  <p className="text-3xl font-bold text-destructive">{filteredOverdue.length}</p>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex justify-end">
                  <Input
                    placeholder="Search Customer ID"
                    value={overdueBill}
                    onChange={(e) => setoverdueBill(e.target.value.toUpperCase())}
                  />
                </div>
              </form>

              {/* Overdue Bills Table */}
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
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            {overdue.daysOverdue} days
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
                  )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    exportPDF(
                      { overdue: overdueTableData },
                      `OverdueReport.pdf`
                    )
                  }
                >
                <Download className="w-4 h-4 mr-2" />
                 Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
