export interface MonthlyDataPoint {
  name: string;
  usage: number;
  limit: number;
}

export interface AnalyticsData {
  averageUsage: number;
  peakUsage: number;
  minimumUsage: number;
  totalUsage: number;
  monthlyData: MonthlyDataPoint[];
}
