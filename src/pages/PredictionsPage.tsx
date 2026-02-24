import React from 'react';
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

export const PredictionsPage = () => {
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
    


    <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Usage and Revenue Report Prediction</CardTitle>
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
                        stroke="#14b8a6"
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
    </div>);
}