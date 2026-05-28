/**
 *  data for ReportsPage.
 * Extracted from ReportsPage.tsx to reduce file length.
 */

export const monthlyDataByYear: Record<string, { month: string; usage: number; revenue: number }[]> = {
  2023: [
    { month: 'Jan', usage: 20500, revenue: 615000 },
    { month: 'Feb', usage: 21200, revenue: 636000 },
    { month: 'Mar', usage: 22100, revenue: 663000 },
    { month: 'Apr', usage: 23800, revenue: 714000 },
    { month: 'May', usage: 24300, revenue: 729000 },
    { month: 'Jun', usage: 25500, revenue: 765000 },
    { month: 'Jul', usage: 26200, revenue: 786000 },
    { month: 'Aug', usage: 25800, revenue: 774000 },
    { month: 'Sep', usage: 24600, revenue: 738000 },
    { month: 'Oct', usage: 23100, revenue: 693000 },
    { month: 'Nov', usage: 22400, revenue: 672000 },
    { month: 'Dec', usage: 23900, revenue: 717000 },
  ],
  2024: [
    { month: 'Jan', usage: 22500, revenue: 675000 },
    { month: 'Feb', usage: 22200, revenue: 666000 },
    { month: 'Mar', usage: 23100, revenue: 693000 },
    { month: 'Apr', usage: 24800, revenue: 744000 },
    { month: 'May', usage: 25300, revenue: 759000 },
    { month: 'Jun', usage: 26500, revenue: 795000 },
    { month: 'Jul', usage: 27200, revenue: 816000 },
    { month: 'Aug', usage: 26800, revenue: 804000 },
    { month: 'Sep', usage: 25600, revenue: 768000 },
    { month: 'Oct', usage: 24100, revenue: 723000 },
    { month: 'Nov', usage: 23400, revenue: 702000 },
    { month: 'Dec', usage: 24900, revenue: 747000 },
  ],
  2025: [
    { month: 'Jan', usage: 24500, revenue: 735000 },
    { month: 'Feb', usage: 23200, revenue: 696000 },
    { month: 'Mar', usage: 25100, revenue: 753000 },
    { month: 'Apr', usage: 26800, revenue: 804000 },
    { month: 'May', usage: 28300, revenue: 849000 },
    { month: 'Jun', usage: 29500, revenue: 885000 },
    { month: 'Jul', usage: 30200, revenue: 906000 },
    { month: 'Aug', usage: 29800, revenue: 894000 },
    { month: 'Sep', usage: 27600, revenue: 828000 },
    { month: 'Oct', usage: 26100, revenue: 783000 },
    { month: 'Nov', usage: 25400, revenue: 762000 },
    { month: 'Dec', usage: 26900, revenue: 807000 },
  ],
  2026: [
    { month: 'Jan', usage: 25800, revenue: 774000 },
    { month: 'Feb', usage: 23200, revenue: 696000 },
  ],
};

export const customerWiseDataByYear: Record<string, { month: string; customer1: number; customer2: number; customer3: number }[]> = {
  '2023': [
    { month: 'Jan', customer1: 40000, customer2: 35000, customer3: 48000 },
    { month: 'Feb', customer1: 42000, customer2: 37000, customer3: 49000 },
    { month: 'Mar', customer1: 44000, customer2: 39000, customer3: 51000 },
    { month: 'Apr', customer1: 46000, customer2: 41000, customer3: 54000 },
    { month: 'May', customer1: 48000, customer2: 43000, customer3: 56000 },
    { month: 'Jun', customer1: 50000, customer2: 45000, customer3: 59000 },
    { month: 'Jul', customer1: 52000, customer2: 47000, customer3: 61000 },
    { month: 'Aug', customer1: 51000, customer2: 46000, customer3: 60000 },
    { month: 'Sep', customer1: 49000, customer2: 44000, customer3: 58000 },
    { month: 'Oct', customer1: 47000, customer2: 42000, customer3: 56000 },
    { month: 'Nov', customer1: 45000, customer2: 40000, customer3: 54000 },
    { month: 'Dec', customer1: 48000, customer2: 43000, customer3: 56000 },
  ],
  '2024': [
    { month: 'Jan', customer1: 43000, customer2: 37000, customer3: 51000 },
    { month: 'Feb', customer1: 45000, customer2: 39000, customer3: 52000 },
    { month: 'Mar', customer1: 47000, customer2: 41000, customer3: 54000 },
    { month: 'Apr', customer1: 49000, customer2: 43000, customer3: 56000 },
    { month: 'May', customer1: 51000, customer2: 45000, customer3: 58000 },
    { month: 'Jun', customer1: 53000, customer2: 47000, customer3: 60000 },
    { month: 'Jul', customer1: 55000, customer2: 49000, customer3: 62000 },
    { month: 'Aug', customer1: 54000, customer2: 48000, customer3: 61000 },
    { month: 'Sep', customer1: 52000, customer2: 46000, customer3: 59000 },
    { month: 'Oct', customer1: 50000, customer2: 44000, customer3: 57000 },
    { month: 'Nov', customer1: 48000, customer2: 42000, customer3: 55000 },
    { month: 'Dec', customer1: 51000, customer2: 45000, customer3: 58000 },
  ],
  '2025': [
    { month: 'Jan', customer1: 45000, customer2: 38000, customer3: 52000 },
    { month: 'Feb', customer1: 48000, customer2: 42000, customer3: 50000 },
    { month: 'Mar', customer1: 50000, customer2: 45000, customer3: 58000 },
    { month: 'Apr', customer1: 52000, customer2: 48000, customer3: 62000 },
    { month: 'May', customer1: 55000, customer2: 50000, customer3: 65000 },
    { month: 'Jun', customer1: 58000, customer2: 52000, customer3: 68000 },
    { month: 'Jul', customer1: 61000, customer2: 54000, customer3: 71000 },
    { month: 'Aug', customer1: 59000, customer2: 52000, customer3: 69000 },
    { month: 'Sep', customer1: 57000, customer2: 50000, customer3: 67000 },
    { month: 'Oct', customer1: 53000, customer2: 48000, customer3: 63000 },
    { month: 'Nov', customer1: 51000, customer2: 46000, customer3: 61000 },
    { month: 'Dec', customer1: 55000, customer2: 50000, customer3: 65000 },
  ],
  '2026': [
    { month: 'Jan', customer1: 48000, customer2: 42000, customer3: 54000 },
    { month: 'Feb', customer1: 46000, customer2: 40000, customer3: 52000 },
  ],
};

export const areaWiseDataByYear: Record<string, { month: string; area1Revenue: number; area1Usage: number; area2Revenue: number; area2Usage: number; area3Revenue: number; area3Usage: number }[]> = {
  '2023': [
    { month: 'Jan', area1Revenue: 110000, area1Usage: 42000, area2Revenue: 260000, area2Usage: 88000, area3Revenue: 310000, area3Usage: 105000 },
    { month: 'Feb', area1Revenue: 115000, area1Usage: 44000, area2Revenue: 255000, area2Usage: 86000, area3Revenue: 295000, area3Usage: 100000 },
    { month: 'Mar', area1Revenue: 120000, area1Usage: 46000, area2Revenue: 270000, area2Usage: 91000, area3Revenue: 320000, area3Usage: 108000 },
    { month: 'Apr', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 285000, area2Usage: 96000, area3Revenue: 345000, area3Usage: 116000 },
    { month: 'May', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 370000, area3Usage: 125000 },
    { month: 'Jun', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 315000, area2Usage: 106000, area3Revenue: 385000, area3Usage: 130000 },
    { month: 'Jul', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 330000, area2Usage: 111000, area3Revenue: 400000, area3Usage: 135000 },
    { month: 'Aug', area1Revenue: 138000, area1Usage: 53000, area2Revenue: 325000, area2Usage: 109000, area3Revenue: 395000, area3Usage: 133000 },
    { month: 'Sep', area1Revenue: 136000, area1Usage: 52000, area2Revenue: 320000, area2Usage: 107000, area3Revenue: 390000, area3Usage: 131000 },
    { month: 'Oct', area1Revenue: 132000, area1Usage: 50000, area2Revenue: 310000, area2Usage: 104000, area3Revenue: 380000, area3Usage: 128000 },
    { month: 'Nov', area1Revenue: 128000, area1Usage: 49000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 370000, area3Usage: 125000 },
    { month: 'Dec', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 375000, area3Usage: 127000 },
  ],
  '2024': [
    { month: 'Jan', area1Revenue: 115000, area1Usage: 44000, area2Revenue: 270000, area2Usage: 91000, area3Revenue: 320000, area3Usage: 108000 },
    { month: 'Feb', area1Revenue: 120000, area1Usage: 46000, area2Revenue: 275000, area2Usage: 93000, area3Revenue: 310000, area3Usage: 105000 },
    { month: 'Mar', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 285000, area2Usage: 96000, area3Revenue: 330000, area3Usage: 112000 },
    { month: 'Apr', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 355000, area3Usage: 120000 },
    { month: 'May', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 315000, area2Usage: 106000, area3Revenue: 380000, area3Usage: 129000 },
    { month: 'Jun', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 330000, area2Usage: 111000, area3Revenue: 395000, area3Usage: 134000 },
    { month: 'Jul', area1Revenue: 145000, area1Usage: 56000, area2Revenue: 345000, area2Usage: 116000, area3Revenue: 410000, area3Usage: 139000 },
    { month: 'Aug', area1Revenue: 143000, area1Usage: 55000, area2Revenue: 340000, area2Usage: 114000, area3Revenue: 405000, area3Usage: 137000 },
    { month: 'Sep', area1Revenue: 141000, area1Usage: 54000, area2Revenue: 335000, area2Usage: 113000, area3Revenue: 400000, area3Usage: 135000 },
    { month: 'Oct', area1Revenue: 137000, area1Usage: 52000, area2Revenue: 325000, area2Usage: 109000, area3Revenue: 390000, area3Usage: 132000 },
    { month: 'Nov', area1Revenue: 133000, area1Usage: 51000, area2Revenue: 315000, area2Usage: 106000, area3Revenue: 380000, area3Usage: 129000 },
    { month: 'Dec', area1Revenue: 136000, area1Usage: 52000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 385000, area3Usage: 130000 },
  ],
  '2025': [
    { month: 'Jan', area1Revenue: 120000, area1Usage: 45000, area2Revenue: 280000, area2Usage: 95000, area3Revenue: 335000, area3Usage: 115000 },
    { month: 'Feb', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 275000, area2Usage: 92000, area3Revenue: 296000, area3Usage: 105000 },
    { month: 'Mar', area1Revenue: 130000, area1Usage: 50000, area2Revenue: 290000, area2Usage: 98000, area3Revenue: 333000, area3Usage: 112000 },
    { month: 'Apr', area1Revenue: 135000, area1Usage: 52000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 364000, area3Usage: 125000 },
    { month: 'May', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 389000, area3Usage: 133000 },
    { month: 'Jun', area1Revenue: 145000, area1Usage: 56000, area2Revenue: 335000, area2Usage: 113000, area3Revenue: 405000, area3Usage: 138000 },
    { month: 'Jul', area1Revenue: 150000, area1Usage: 58000, area2Revenue: 350000, area2Usage: 118000, area3Revenue: 420000, area3Usage: 143000 },
    { month: 'Aug', area1Revenue: 148000, area1Usage: 57000, area2Revenue: 345000, area2Usage: 116000, area3Revenue: 415000, area3Usage: 141000 },
    { month: 'Sep', area1Revenue: 146000, area1Usage: 56000, area2Revenue: 340000, area2Usage: 114000, area3Revenue: 410000, area3Usage: 139000 },
    { month: 'Oct', area1Revenue: 142000, area1Usage: 54000, area2Revenue: 330000, area2Usage: 111000, area3Revenue: 400000, area3Usage: 136000 },
    { month: 'Nov', area1Revenue: 138000, area1Usage: 53000, area2Revenue: 320000, area2Usage: 108000, area3Revenue: 390000, area3Usage: 133000 },
    { month: 'Dec', area1Revenue: 140000, area1Usage: 54000, area2Revenue: 325000, area2Usage: 110000, area3Revenue: 395000, area3Usage: 134000 },
  ],
  '2026': [
    { month: 'Jan', area1Revenue: 125000, area1Usage: 48000, area2Revenue: 305000, area2Usage: 103000, area3Revenue: 360000, area3Usage: 122000 },
    { month: 'Feb', area1Revenue: 128000, area1Usage: 49000, area2Revenue: 300000, area2Usage: 101000, area3Revenue: 350000, area3Usage: 118000 },
  ],
};

export const billsData = [
  { status: 'Paid', count: 856 },
  { status: 'Unpaid', count: 124 },
];

export const billsTableData = [
  { id: 'BL101', customerid: 'C001', customer: 'John Doe', amount: 5500, dueDate: '2025-12-31', status: 'Paid' },
  { id: 'BL112', customerid: 'C002', customer: 'Jane Smith', amount: 6200, dueDate: '2026-01-15', status: 'Unpaid' },
  { id: 'BL213', customerid: 'C003', customer: 'Mike Johnson', amount: 4800, dueDate: '2026-01-20', status: 'Paid' },
];

export const overdueTableData = [
  { id: 'BL006', customerid: 'C001', customer: 'Alice Davis', amount: 6500, dueDate: '2025-11-30', daysOverdue: 71 },
  { id: 'BL007', customerid: 'C002', customer: 'Tom Wilson', amount: 5200, dueDate: '2025-12-15', daysOverdue: 55 },
  { id: 'BL008', customerid: 'C003', customer: 'Emma Garcia', amount: 7800, dueDate: '2025-12-20', daysOverdue: 50 },
  { id: 'BL009', customerid: 'C004', customer: 'David Martinez', amount: 4900, dueDate: '2026-01-05', daysOverdue: 35 },
  { id: 'BL010', customerid: 'C005', customer: 'Lisa Anderson', amount: 6100, dueDate: '2026-01-10', daysOverdue: 30 },
];
