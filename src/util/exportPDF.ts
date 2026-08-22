import { jsPDF } from "jspdf";

export interface PDFReportRow {
  month: string;
  usage: number;
  revenue: number;
}

export const exportPDF = async (
  data: PDFReportRow[],
  title: string,
  fileName: string
): Promise<void> => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data available to export");
  }

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const leftMargin = 15;
    const rightMargin = 15;
    const bottomMargin = 15;

    const usableWidth =
      pageWidth - leftMargin - rightMargin;

    const monthColumnWidth = 60;
    const usageColumnWidth = 55;
    const revenueColumnWidth =
      usableWidth -
      monthColumnWidth -
      usageColumnWidth;

    const rowHeight = 10;

    let currentY = 20;

    const formatNumber = (
      value: number | null | undefined
    ): string => {
      return Number(value ?? 0).toLocaleString(
        "en-US",
        {
          maximumFractionDigits: 2,
        }
      );
    };

    const drawPageHeading = (): void => {
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
      pdf.setFontSize(9);
      pdf.setTextColor(90, 90, 90);

      pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        currentY,
        {
          align: "center",
        }
      );

      currentY += 10;
    };

    const drawTableHeading = (): void => {
      pdf.setFillColor(232, 244, 245);
      pdf.setDrawColor(180, 180, 180);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);

      pdf.rect(
        leftMargin,
        currentY,
        monthColumnWidth,
        rowHeight,
        "FD"
      );

      pdf.rect(
        leftMargin + monthColumnWidth,
        currentY,
        usageColumnWidth,
        rowHeight,
        "FD"
      );

      pdf.rect(
        leftMargin +
          monthColumnWidth +
          usageColumnWidth,
        currentY,
        revenueColumnWidth,
        rowHeight,
        "FD"
      );

      pdf.text(
        "Month / Date",
        leftMargin + 3,
        currentY + 6.5
      );

      pdf.text(
        "Usage (L)",
        leftMargin +
          monthColumnWidth +
          usageColumnWidth -
          3,
        currentY + 6.5,
        {
          align: "right",
        }
      );

      pdf.text(
        "Revenue (LKR)",
        pageWidth - rightMargin - 3,
        currentY + 6.5,
        {
          align: "right",
        }
      );

      currentY += rowHeight;
    };

    const startNewPage = (): void => {
      pdf.addPage();
      currentY = 20;

      drawPageHeading();
      drawTableHeading();
    };

    drawPageHeading();
    drawTableHeading();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    data.forEach((item, index) => {
      if (
        currentY + rowHeight >
        pageHeight - bottomMargin
      ) {
        startNewPage();
      }

      if (index % 2 === 0) {
        pdf.setFillColor(255, 255, 255);
      } else {
        pdf.setFillColor(248, 248, 248);
      }

      pdf.setDrawColor(210, 210, 210);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");

      pdf.rect(
        leftMargin,
        currentY,
        monthColumnWidth,
        rowHeight,
        "FD"
      );

      pdf.rect(
        leftMargin + monthColumnWidth,
        currentY,
        usageColumnWidth,
        rowHeight,
        "FD"
      );

      pdf.rect(
        leftMargin +
          monthColumnWidth +
          usageColumnWidth,
        currentY,
        revenueColumnWidth,
        rowHeight,
        "FD"
      );

      pdf.text(
        String(item.month ?? ""),
        leftMargin + 3,
        currentY + 6.5
      );

      pdf.text(
        formatNumber(item.usage),
        leftMargin +
          monthColumnWidth +
          usageColumnWidth -
          3,
        currentY + 6.5,
        {
          align: "right",
        }
      );

      pdf.text(
        formatNumber(item.revenue),
        pageWidth - rightMargin - 3,
        currentY + 6.5,
        {
          align: "right",
        }
      );

      currentY += rowHeight;
    });

    const totalUsage = data.reduce(
      (total, item) =>
        total + Number(item.usage ?? 0),
      0
    );

    const totalRevenue = data.reduce(
      (total, item) =>
        total + Number(item.revenue ?? 0),
      0
    );

    const summaryHeight = 20;

    if (
      currentY + summaryHeight >
      pageHeight - bottomMargin
    ) {
      pdf.addPage();
      currentY = 20;
    } else {
      currentY += 5;
    }

    pdf.setFillColor(247, 247, 247);
    pdf.setDrawColor(190, 190, 190);

    pdf.rect(
      leftMargin,
      currentY,
      usableWidth,
      summaryHeight,
      "FD"
    );

    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);

    pdf.text(
      `Total Usage: ${formatNumber(
        totalUsage
      )} L`,
      pageWidth - rightMargin - 4,
      currentY + 7,
      {
        align: "right",
      }
    );

    pdf.text(
      `Total Revenue: LKR ${formatNumber(
        totalRevenue
      )}`,
      pageWidth - rightMargin - 4,
      currentY + 14,
      {
        align: "right",
      }
    );

    /*
     * Add page numbers.
     */
    const pageCount =
      pdf.getNumberOfPages();

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
  } catch (error) {
    console.error("PDF EXPORT ERROR:", error);
    throw error;
  }
};