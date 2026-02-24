import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';  
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';    
import { ReferenceLine } from 'recharts';    


const monthlyPredictionData = [
  { month: 'Jan', usage: 1200, revenue: 24000, predictedUsage: null, predictedRevenue: null },
  { month: 'Feb', usage: 1300, revenue: 26000, predictedUsage: null, predictedRevenue: null },
  { month: 'Mar', usage: 1250, revenue: 25000, predictedUsage: null, predictedRevenue: null },
  { month: 'Apr', usage: 1400, revenue: 28000, predictedUsage: null, predictedRevenue: null },
  { month: 'May', usage: 1350, revenue: 27000, predictedUsage: null, predictedRevenue: null },
  { month: 'Jun', usage: 1500, revenue: 30000, predictedUsage: null, predictedRevenue: null },

  { month: 'Jul', usage: null, revenue: null, predictedUsage: 1550, predictedRevenue: 31000 },
  { month: 'Aug', usage: null, revenue: null, predictedUsage: 1600, predictedRevenue: 32000 },
  { month: 'Sep', usage: null, revenue: null, predictedUsage: 1650, predictedRevenue: 33000 },
];

const customerPredictionData = [
  { customerId: "C001", month: "Jan", usage: 500, revenue: 10000, predictedUsage: null, predictedRevenue: null },
  { customerId: "C001", month: "Feb", usage: 520, revenue: 10400, predictedUsage: null, predictedRevenue: null },
  { customerId: "C001", month: "Mar", usage: 510, revenue: 10200, predictedUsage: null, predictedRevenue: null },
  { customerId: "C001", month: "Apr", usage: 530, revenue: 10600, predictedUsage: null, predictedRevenue: null },
  { customerId: "C001", month: "May", usage: 550, revenue: 11000, predictedUsage: null, predictedRevenue: null },
  { customerId: "C001", month: "Jun", usage: 600, revenue: 12000, predictedUsage: null, predictedRevenue: null },
  { customerId: "C001", month: "Jul", usage: null, revenue: null, predictedUsage: 620, predictedRevenue: 12400 },
  { customerId: "C001", month: "Aug", usage: null, revenue: null, predictedUsage: 640, predictedRevenue: 12800 },
  { customerId: "C001", month: "Sep", usage: null, revenue: null, predictedUsage: 660, predictedRevenue: 13200 },

  { customerId: "C002", month: "Jan", usage: 300, revenue: 6000, predictedUsage: null, predictedRevenue: null },
  { customerId: "C002", month: "Feb", usage: 320, revenue: 6400, predictedUsage: null, predictedRevenue: null },
  { customerId: "C002", month: "Mar", usage: 310, revenue: 6200, predictedUsage: null, predictedRevenue: null },
  { customerId: "C002", month: "Apr", usage: 330, revenue: 6600, predictedUsage: null, predictedRevenue: null },
  { customerId: "C002", month: "May", usage: 340, revenue: 6800, predictedUsage: null, predictedRevenue: null },
  { customerId: "C002", month: "Jun", usage: 360, revenue: 7200, predictedUsage: null, predictedRevenue: null },
  { customerId: "C002", month: "Jul", usage: null, revenue: null, predictedUsage: 380, predictedRevenue: 7600 },
  { customerId: "C002", month: "Aug", usage: null, revenue: null, predictedUsage: 400, predictedRevenue: 8000 },
  { customerId: "C002", month: "Sep", usage: null, revenue: null, predictedUsage: 420, predictedRevenue: 8400 },
];


export const PredictionsPage = () => {

    const [searchId, setSearchId] = useState("C001");

    // Filter data by selected customer
    const filteredData = customerPredictionData.filter(
        (item) => item.customerId === searchId
    );

    return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Predictions</h1>
          <p className="text-sm text-muted-foreground">Predicted data for monitoring and analysis up to 3 months</p>
    </div>

    

    <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Report Prediction</TabsTrigger>
          <TabsTrigger value="customer">Customer Report Prediction</TabsTrigger>
          <TabsTrigger value="area">Area Report Prediction</TabsTrigger>
        </TabsList>  
    

{/* Monthly Report Prediction */}
    <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Usage and Revenue Report Prediction - 2026</CardTitle>
                  <CardDescription>Individual customer consumption and billing trends predicted up to 3 months</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPredictionData}>
                    <ReferenceLine
                        x="Jul"
                        stroke="gray"
                        strokeDasharray="3 3"
                        label="Prediction Start"
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Usage (L)', position: 'top', offset: 10 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload;

                        return (
                                <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
                                 <p className="font-semibold mb-2">{data.month}</p>

                                {data.usage !== null && (
                                    <>
                                    <p>Actual Usage: {data.usage.toLocaleString()} L</p>
                                    <p>Actual Revenue: LKR {data.revenue.toLocaleString()}</p>
                                    </>
                                )}

                                {data.predictedUsage !== null && (
                                    <>
                                    <p className="text-orange-500">
                                        Predicted Usage: {data.predictedUsage.toLocaleString()} L
                                    </p>
                                    <p className="text-orange-500">
                                        Predicted Revenue: LKR {data.predictedRevenue.toLocaleString()}
                                    </p>
                                    </>
                                )}
                                </div>
                                );
                               }
                                return null;
                               }}
                              />



                    {/* Actual Line */}
                    <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Actual Usage"
                        connectNulls
                    />

                    {/* Predicted Line */}
                    <Line
                        type="monotone"
                        dataKey="predictedUsage"
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted Usage"
                        connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
            </div>
            </CardContent>
        </Card>
    </TabsContent>


{/* Customer Prediction Tab */}
<TabsContent value="customer" className="space-y-6">
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
      <div>
      <CardTitle>Customer Usage Prediction</CardTitle>
      <CardDescription>Forecasted usage for selected customer up to 3 months </CardDescription>
      </div>
      <div className="flex items-center gap-2">
       <Input
          placeholder="Enter Customer ID (e.g., C001)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.toUpperCase())}
          className="w-48"
        />
      </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <ReferenceLine
              x="Jul"
              stroke="gray"
              strokeDasharray="3 3"
              label="Prediction Start"
            />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: "Usage (L)", angle: -90, position: "insideLeft" }} />
            <Tooltip
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-md">
                        <p className="font-semibold mb-2">{data.month}</p>

                        {data.usage !== null && <p>Actual Usage: {data.usage.toLocaleString()} L</p>}
                        {data.revenue !== null && <p>Actual Revenue: LKR {data.revenue.toLocaleString()}</p>}

                        {data.predictedUsage !== null && (
                            <>
                            <p className="text-orange-500">
                                Predicted Usage: {data.predictedUsage.toLocaleString()} L
                            </p>
                            <p className="text-orange-500">
                                Predicted Revenue: LKR {data.predictedRevenue.toLocaleString()}
                            </p>
                            </>
                        )}
                        </div>
                    );
                    }
                    return null;
                }}
            />

            {/* Actual Usage */}
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#2563eb"
              strokeWidth={2}
              name="Actual Usage"
              connectNulls
            />

            {/* Predicted Usage */}
            <Line
              type="monotone"
              dataKey="predictedUsage"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Usage"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</TabsContent>
</Tabs>
</div>
)}