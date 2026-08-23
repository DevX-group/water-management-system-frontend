import { jsPDF } from "jspdf";

export interface PDFReportRow {
  month: string;
  usage: number;
  revenue: number;
}

export interface PDFColumn<T> {
  header: string;
  value: (row: T) => string | number;
  width?: number;
  align?: "left" | "center" | "right";
}

export const exportPDF = async <T extends object>(
  data: T[],
  title: string,
  fileName: string,
  columns?: PDFColumn<T>[]
): Promise<void> => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data available to export");
  }

  /*
   * Monthly and customer reports can omit columns.
   * These default columns will then be used.
   */
  const selectedColumns: PDFColumn<T>[] =
    columns ??
    ([
      {
        header: "Month / Date",
        value: (row: T) =>
          String(
            (row as unknown as PDFReportRow).month ?? ""
          ),
        width: 1.2,
        align: "left",
      },
      {
        header: "Usage (L)",
        value: (row: T) =>
          Number(
            (row as unknown as PDFReportRow).usage ?? 0
          ).toLocaleString(),
        width: 1,
        align: "right",
      },
      {
        header: "Revenue (LKR)",
        value: (row: T) =>
          Number(
            (row as unknown as PDFReportRow).revenue ?? 0
          ).toLocaleString(),
        width: 1,
        align: "right",
      },
    ] as PDFColumn<T>[]);

  /*
   * Six-column reports use landscape orientation.
   */
  const orientation: "portrait" | "landscape" =
    selectedColumns.length > 4
      ? "landscape"
      : "portrait";

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const leftMargin = 12;
  const rightMargin = 12;
  const topMargin = 15;
  const bottomMargin = 15;
  const rowHeight = 10;

  const usableWidth =
    pageWidth - leftMargin - rightMargin;

  const totalWidthWeight = selectedColumns.reduce(
    (total, column) =>
      total + Number(column.width ?? 1),
    0
  );

  const columnWidths = selectedColumns.map(
    (column) =>
      usableWidth *
      (Number(column.width ?? 1) /
        totalWidthWeight)
  );

  let currentY = topMargin;

  const shortenText = (
    text: string,
    maximumWidth: number
  ): string => {
    if (pdf.getTextWidth(text) <= maximumWidth) {
      return text;
    }

    let shortenedText = text;

    while (
      shortenedText.length > 0 &&
      pdf.getTextWidth(`${shortenedText}...`) >
        maximumWidth
    ) {
      shortenedText = shortenedText.slice(0, -1);
    }

    return `${shortenedText}...`;
  };

  const drawPageTitle = (): void => {
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    const titleLines = pdf.splitTextToSize(
      title,
      usableWidth
    );

    pdf.text(
      titleLines,
      pageWidth / 2,
      currentY,
      {
        align: "center",
      }
    );

    currentY += titleLines.length * 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(90, 90, 90);

    pdf.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      currentY,
      {
        align: "center",
      }
    );

    currentY += 8;
  };

  const drawTableHeader = (): void => {
    let currentX = leftMargin;

    selectedColumns.forEach((column, index) => {
      const columnWidth = columnWidths[index];

      pdf.setFillColor(232, 244, 245);
      pdf.setDrawColor(180, 180, 180);

      pdf.rect(
        currentX,
        currentY,
        columnWidth,
        rowHeight,
        "FD"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      const alignment = column.align ?? "left";

      const textX =
        alignment === "right"
          ? currentX + columnWidth - 2
          : alignment === "center"
            ? currentX + columnWidth / 2
            : currentX + 2;

      pdf.text(
        shortenText(
          column.header,
          columnWidth - 4
        ),
        textX,
        currentY + 6.5,
        {
          align: alignment,
        }
      );

      currentX += columnWidth;
    });

    currentY += rowHeight;
  };

  const startNewPage = (): void => {
    pdf.addPage();
    currentY = topMargin;

    drawPageTitle();
    drawTableHeader();
  };

  drawPageTitle();
  drawTableHeader();

  data.forEach((row, rowIndex) => {
    if (
      currentY + rowHeight >
      pageHeight - bottomMargin
    ) {
      startNewPage();
    }

    let currentX = leftMargin;

    selectedColumns.forEach((column, columnIndex) => {
      const columnWidth =
        columnWidths[columnIndex];

      const rawValue = column.value(row);

      const cellValue =
        rawValue === null ||
        rawValue === undefined
          ? ""
          : String(rawValue);

      if (rowIndex % 2 === 0) {
        pdf.setFillColor(255, 255, 255);
      } else {
        pdf.setFillColor(248, 248, 248);
      }

      pdf.setDrawColor(210, 210, 210);

      pdf.rect(
        currentX,
        currentY,
        columnWidth,
        rowHeight,
        "FD"
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(0, 0, 0);

      const alignment = column.align ?? "left";

      const textX =
        alignment === "right"
          ? currentX + columnWidth - 2
          : alignment === "center"
            ? currentX + columnWidth / 2
            : currentX + 2;

      pdf.text(
        shortenText(
          cellValue,
          columnWidth - 4
        ),
        textX,
        currentY + 6.5,
        {
          align: alignment,
        }
      );

      currentX += columnWidth;
    });

    currentY += rowHeight;
  });

  /*
   * Keep totals for the default monthly/customer format.
   */
  if (!columns) {
    const reportRows =
      data as unknown as PDFReportRow[];

    const totalUsage = reportRows.reduce(
      (total, row) =>
        total + Number(row.usage ?? 0),
      0
    );

    const totalRevenue = reportRows.reduce(
      (total, row) =>
        total + Number(row.revenue ?? 0),
      0
    );

    if (
      currentY + 25 >
      pageHeight - bottomMargin
    ) {
      pdf.addPage();
      currentY = topMargin;
    } else {
      currentY += 5;
    }

    pdf.setFillColor(247, 247, 247);
    pdf.setDrawColor(190, 190, 190);

    pdf.rect(
      leftMargin,
      currentY,
      usableWidth,
      20,
      "FD"
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    pdf.text(
      `Total Usage: ${totalUsage.toLocaleString()} L`,
      pageWidth - rightMargin - 4,
      currentY + 7,
      {
        align: "right",
      }
    );

    pdf.text(
      `Total Revenue: LKR ${totalRevenue.toLocaleString()}`,
      pageWidth - rightMargin - 4,
      currentY + 14,
      {
        align: "right",
      }
    );
  }

  /*
   * Add page numbers.
   */
  const pageCount = pdf.getNumberOfPages();

  for (
    let pageNumber = 1;
    pageNumber <= pageCount;
    pageNumber++
  ) {
    pdf.setPage(pageNumber);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);

    pdf.text(
      `Page ${pageNumber} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 7,
      {
        align: "center",
      }
    );
  }

  pdf.save(
    fileName.toLowerCase().endsWith(".pdf")
      ? fileName
      : `${fileName}.pdf`
  );
};