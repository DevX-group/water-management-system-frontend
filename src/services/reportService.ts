interface Report {
  id: number;
  name: string;
  type: 'Financial' | 'Analytics' | 'Operations';
  date: string;
  status: 'ready' | 'processing' | 'failed';
}

export const getReports = (): Report[] => {
  return [
    { id: 1, name: 'Monthly Revenue Report', type: 'Financial', date: '2025-12-01', status: 'ready' },
    { id: 2, name: 'Customer Growth Analysis', type: 'Analytics', date: '2025-12-01', status: 'ready' },
    { id: 3, name: 'Water Usage Summary', type: 'Operations', date: '2025-12-01', status: 'ready' },
    { id: 4, name: 'Outstanding Payments', type: 'Financial', date: '2025-12-01', status: 'ready' },
    { id: 5, name: 'Meter Reading Report', type: 'Operations', date: '2025-11-30', status: 'ready' },
  ];
};

export const downloadReport = (reportId: number): boolean => {
  console.log(`Downloading report ${reportId}`);
  return true;
};