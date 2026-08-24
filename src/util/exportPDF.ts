import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface PDFColumn<T> {
  header: string;
  value: (
    row: T
  ) => string | number | null | undefined;
  width?: number;
  align?: "left" | "center" | "right";
}

export const exportPDF = <T extends object>(
  data: T[],
  reportTitle: string,
  fileName: string,
  customColumns?: PDFColumn<T>[]
): void => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No report data is available to export");
    return;
  }

  const defaultColumns: PDFColumn<T>[] = [
    {
      header: "Month",
      value: (row) => {
        const item = row as {
          month?: string;
        };

        return item.month ?? "-";
      },
      width: 1.2,
      align: "left",
    },
    {
      header: "Usage (L)",
      value: (row) => {
        const item = row as {
          usage?: number;
        };

        const value = Number(item.usage ?? 0);

        return Number.isFinite(value)
          ? value.toLocaleString()
          : "-";
      },
      width: 1.2,
      align: "right",
    },
    {
      header: "Revenue (LKR)",
      value: (row) => {
        const item = row as {
          revenue?: number;
        };

        const value = Number(item.revenue ?? 0);

        return Number.isFinite(value)
          ? value.toLocaleString()
          : "-";
      },
      width: 1.4,
      align: "right",
    },
  ];

  const columns =
    customColumns && customColumns.length > 0
      ? customColumns
      : defaultColumns;

  const safeTitle =
    reportTitle?.trim() || "Report";

  let safeFileName =
    fileName?.trim() || "report.pdf";

  if (!safeFileName.toLowerCase().endsWith(".pdf")) {
    safeFileName = `${safeFileName}.pdf`;
  }

  const orientation =
    columns.length > 5
      ? "landscape"
      : "portrait";

  const document = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  document.setFont("helvetica", "bold");
  document.setFontSize(16);

  const pageWidth =
    document.internal.pageSize.getWidth();

  document.text(safeTitle, pageWidth / 2, 16, {
    align: "center",
  });

  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.setTextColor(90);

  document.text(
    `Generated: ${new Date().toLocaleString()}`,
    pageWidth - 12,
    23,
    {
      align: "right",
    }
  );

  document.setTextColor(0);

  const headers = [
    columns.map((column) => column.header),
  ];

  const rows = data.map((row) =>
    columns.map((column) => {
      try {
        const value = column.value(row);

        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          return "-";
        }

        return String(value);
      } catch (error) {
        console.error(
          `Unable to export column ${column.header}:`,
          error
        );

        return "-";
      }
    })
  );

  const columnStyles = columns.reduce<
    Record<
      number,
      {
        halign: "left" | "center" | "right";
      }
    >
  >((styles, column, index) => {
    styles[index] = {
      halign: column.align ?? "left",
    };

    return styles;
  }, {});

  autoTable(document, {
    startY: 29,
    head: headers,
    body: rows,

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: [0, 0, 0],
      cellPadding: 3,
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      overflow: "linebreak",
      valign: "middle",
    },

    headStyles: {
      fillColor: [31, 122, 140],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },

    alternateRowStyles: {
      fillColor: [245, 247, 249],
    },

    columnStyles,

    margin: {
      top: 15,
      right: 10,
      bottom: 15,
      left: 10,
    },

    didDrawPage: () => {
      const currentPage =
        document.getNumberOfPages();

      const pageHeight =
        document.internal.pageSize.getHeight();

      document.setFontSize(8);
      document.setTextColor(100);

      document.text(
        `Page ${currentPage}`,
        pageWidth / 2,
        pageHeight - 7,
        {
          align: "center",
        }
      );

      document.setTextColor(0);
    },
  });

  document.save(safeFileName);
};