interface BillingData {
  overdueAmount: number;
  currentBill: number;
}

export const OverdueChart: React.FC = () => {
  const overdueData = mockCustomerBilling.filter((c: BillingData) => c.overdueAmount > 0);
  const totalOverdue = overdueData.reduce((sum: number, c: BillingData) => sum + c.overdueAmount, 0);
  const totalCurrent = mockCustomerBilling.reduce((sum: number, c: BillingData) => sum + c.currentBill, 0);

  const data = [
    { name: 'Current Bills', value: totalCurrent, color: 'hsl(var(--success))' },
    { name: 'Overdue', value: totalOverdue, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payment Status</h3>
          <p className="text-sm text-muted-foreground">Current vs Overdue (LKR)</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => `LKR ${value.toLocaleString()}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-xl bg-success/10">
          <p className="text-sm text-muted-foreground">Current</p>
          <p className="text-lg font-bold text-success">LKR {totalCurrent.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-xl bg-destructive/10">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-lg font-bold text-destructive">LKR {totalOverdue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};