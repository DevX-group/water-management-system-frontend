export function exportPDF(
  monthlyDataByYear: Record<string, Array<{ month: string; usage: number; revenue: number }>>,
  selectedYearOrFileName?: string,
  maybeFileName?: string
): Promise<void>;
