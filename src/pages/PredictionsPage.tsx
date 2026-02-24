import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';  
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';    
import { ReferenceLine } from 'recharts';    


// Testing Git
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

const areaWiseData2026 = [
  // ACTUAL (Jan–Jun)
  { month: "Jan", area1Usage: 48000, area1Revenue: 125000, area2Usage: 103000, area2Revenue: 305000, area3Usage: 122000, area3Revenue: 360000 },
  { month: "Feb", area1Usage: 49000, area1Revenue: 128000, area2Usage: 101000, area2Revenue: 300000, area3Usage: 118000, area3Revenue: 350000 },
  { month: "Mar", area1Usage: 50000, area1Revenue: 130000, area2Usage: 104000, area2Revenue: 310000, area3Usage: 120000, area3Revenue: 355000 },
  { month: "Apr", area1Usage: 51000, area1Revenue: 133000, area2Usage: 106000, area2Revenue: 320000, area3Usage: 123000, area3Revenue: 365000 },
  { month: "May", area1Usage: 52000, area1Revenue: 135000, area2Usage: 108000, area2Revenue: 330000, area3Usage: 125000, area3Revenue: 375000 },
  { month: "Jun", area1Usage: 53000, area1Revenue: 138000, area2Usage: 110000, area2Revenue: 340000, area3Usage: 128000, area3Revenue: 385000 },

  // 🔮 PREDICTED (Jul–Sep)
  { month: "Jul", predictedArea1Usage: 55000, predictedArea1Revenue: 142000, predictedArea2Usage: 115000, predictedArea2Revenue: 355000, predictedArea3Usage: 132000, predictedArea3Revenue: 400000 },
  { month: "Aug", predictedArea1Usage: 57000, predictedArea1Revenue: 147000, predictedArea2Usage: 120000, predictedArea2Revenue: 370000, predictedArea3Usage: 136000, predictedArea3Revenue: 415000 },
  { month: "Sep", predictedArea1Usage: 59000, predictedArea1Revenue: 152000, predictedArea2Usage: 125000, predictedArea2Revenue: 385000, predictedArea3Usage: 140000, predictedArea3Revenue: 430000 },
];


export const PredictionsPage = () => {

    const [searchId, setSearchId] = useState("C001");

    // Filter data by selected customer
    const filteredData = customerPredictionData.filter(
        (item) => item.customerId === searchId
    );

    const [selectedArea, setSelectedArea] = useState("all");
    const [areaYear, setAreaYear] = useState("2026");

    // For simplicity, using only 2026 data
    const areaDataForYear = areaWiseData2026;

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

{/* Area Report Prediction */}
<TabsContent value="area" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Area-wise Usage and Revenue Report Prediction - {areaYear}</CardTitle>
              <CardDescription>Predicted trends for each area in 2026</CardDescription>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={areaWiseData2026}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: '(L)', angle: -90, position: 'insideBottomLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '(LKR)', angle: 90, position: 'insideBottomRight' }} />
                <Tooltip />
                <Legend />

                {/* ================= ACTUAL BARS ================= */}

                {(selectedArea === "all" || selectedArea === "area1") && (
                    <>
                    <Bar yAxisId="left" dataKey="area1Usage" name="Area 1 Usage" fill="#0ea5e9" />
                    <Bar yAxisId="right" dataKey="area1Revenue" name="Area 1 Revenue" fill="#0369a1" />
                    </>
                )}

                {(selectedArea === "all" || selectedArea === "area2") && (
                    <>
                    <Bar yAxisId="left" dataKey="area2Usage" name="Area 2 Usage" fill="#22c55e" />
                    <Bar yAxisId="right" dataKey="area2Revenue" name="Area 2 Revenue" fill="#15803d" />
                    </>
                )}

                {(selectedArea === "all" || selectedArea === "area3") && (
                    <>
                    <Bar yAxisId="left" dataKey="area3Usage" name="Area 3 Usage" fill="#f59e0b" />
                    <Bar yAxisId="right" dataKey="area3Revenue" name="Area 3 Revenue" fill="#b45309" />
                    </>
                )}

                {/* ================= PREDICTED BARS (DIFFERENT COLOR) ================= */}

                {(selectedArea === "all" || selectedArea === "area1") && (
                    <>
                    <Bar yAxisId="left" dataKey="predictedArea1Usage" name="Predicted Area 1 Usage" fill="#93c5fd" />
                    <Bar yAxisId="right" dataKey="predictedArea1Revenue" name="Predicted Area 1 Revenue" fill="#60a5fa" />
                    </>
                )}

                {(selectedArea === "all" || selectedArea === "area2") && (
                    <>
                    <Bar yAxisId="left" dataKey="predictedArea2Usage" name="Predicted Area 2 Usage" fill="#86efac" />
                    <Bar yAxisId="right" dataKey="predictedArea2Revenue" name="Predicted Area 2 Revenue" fill="#4ade80" />
                    </>
                )}

                {(selectedArea === "all" || selectedArea === "area3") && (
                    <>
                    <Bar yAxisId="left" dataKey="predictedArea3Usage" name="Predicted Area 3 Usage" fill="#fde68a" />
                    <Bar yAxisId="right" dataKey="predictedArea3Revenue" name="Predicted Area 3 Revenue" fill="#facc15" />
                    </>
                )}
                </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
</Tabs>
</div>
)}