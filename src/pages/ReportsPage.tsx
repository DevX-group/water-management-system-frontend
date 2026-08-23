import "@/index.css";
import React, { useEffect, useMemo, useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  MonthlyReportTab,
  type MonthlyReportRow,
} from "@/components/reports/MonthlyReportTab";

import {
  CustomerReportTab,
  type CustomerReportRow,
} from "@/components/reports/CustomerReportTab";

import {
  AreaReportTab,
  type AreaReportRow,
} from "@/components/reports/AreaReportTab";

import {
  BillsReportTab,
  type BillReportRow,
} from "@/components/reports/BillsReportTab";

import {
  OverdueReportTab,
  type OverdueReportRow,
} from "@/components/reports/OverdueReportTab";

import { api } from "@/services/api";

interface BillApiResponse {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  billReportDate?: string;
  status: string;
}

export const ReportsPage: React.FC = () => {
  /*
   * Monthly report state
   */
  const [year, setYear] = useState<number>(2023);
  const [reports, setReports] = useState<MonthlyReportRow[]>([]);

  /*
   * Customer report state
   */
  const [customerId, setCustomerId] = useState<string>("C001");
  const [customerYear, setCustomerYear] =
    useState<string>("2025");
  const [customerData, setCustomerData] =
    useState<CustomerReportRow[]>([]);

  /*
   * Area report state
   */
  const [areaData, setAreaData] =
    useState<AreaReportRow[]>([]);
  const [areaYear, setAreaYear] =
    useState<string>("2026");
  const [selectedArea, setSelectedArea] =
    useState<string>("all");

  /*
   * Bills report state
   */
  const [billsTableData, setBillsTableData] =
    useState<BillReportRow[]>([]);
  const [customerSearchBill, setCustomerSearchBill] =
    useState<string>("");

  /*
   * Overdue report state
   */
  const [overdueTableData, setOverdueTableData] =
    useState<OverdueReportRow[]>([]);
  const [overdueBill, setOverdueBill] =
    useState<string>("");

  /*
   * Monthly report.
   * The backend/database filters the data by year.
   */
  useEffect(() => {
    const controller = new AbortController();

    api
      .get<MonthlyReportRow[]>("/reports/monthly", {
        params: {
          year,
        },
        signal: controller.signal,
      })
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") {
          console.error("MONTHLY REPORT ERROR:", error);
          setReports([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [year]);

  /*
   * Customer report.
   * Filtering is performed by the backend/database using
   * customerId and year.
   *
   * The request is debounced so entering C001 does not send
   * a separate request for every character.
   */
  useEffect(() => {
    const normalizedCustomerId =
      customerId.trim().toUpperCase();

    if (!normalizedCustomerId) {
      setCustomerData([]);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      api
        .get<CustomerReportRow[]>("/reports/customer", {
          params: {
            customerId: normalizedCustomerId,
            year: customerYear,
          },
          signal: controller.signal,
        })
        .then((response) => {
          setCustomerData(response.data);
        })
        .catch((error) => {
          if (error.code !== "ERR_CANCELED") {
            console.error(
              "CUSTOMER REPORT ERROR:",
              error
            );
            setCustomerData([]);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [customerId, customerYear]);

  /*
   * Area report.
   * The backend/database filters the data by year and area.
   */
  useEffect(() => {
    const controller = new AbortController();

    api
      .get<AreaReportRow[]>("/reports/area", {
        params: {
          year: areaYear,
          area: selectedArea,
        },
        signal: controller.signal,
      })
      .then((response) => {
        setAreaData(response.data);
      })
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") {
          console.error("AREA REPORT ERROR:", error);
          setAreaData([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [areaYear, selectedArea]);

  /*
   * Bills report.
   * The optional customerId is sent to the backend.
   *
   * When the search is empty, the backend returns all bills.
   * When it has a value, the backend returns only matching bills.
   */
  useEffect(() => {
    const normalizedCustomerId =
      customerSearchBill.trim().toUpperCase();

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      api
        .get<BillApiResponse[]>("/bills_report", {
          params: normalizedCustomerId
            ? {
              customerId: normalizedCustomerId,
            }
            : {},
          signal: controller.signal,
        })
        .then((response) => {
          const mappedBills: BillReportRow[] =
            response.data.map((bill) => ({
              id: bill.id,
              customerid: bill.customerId,
              customer: bill.customerName,
              amount: Number(bill.amount ?? 0),
              dueDate: bill.dueDate,
              status:
                bill.status?.toUpperCase() === "PAID"
                  ? "Paid"
                  : "Unpaid",
            }));

          setBillsTableData(mappedBills);
        })
        .catch((error) => {
          if (error.code !== "ERR_CANCELED") {
            console.error("BILLS REPORT ERROR:", error);
            setBillsTableData([]);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [customerSearchBill]);

  /*
   * Overdue report.
   * The backend applies all overdue conditions:
   *
   * status = UNPAID
   * dueDate < today
   * optional customerId filtering
   */
  useEffect(() => {
    const normalizedCustomerId =
      overdueBill.trim().toUpperCase();

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      api
        .get<BillApiResponse[]>(
          "/bills_report/overdue",
          {
            params: normalizedCustomerId
              ? {
                customerId: normalizedCustomerId,
              }
              : {},
            signal: controller.signal,
          }
        )
        .then((response) => {
          const today = new Date();

          const mappedOverdueBills: OverdueReportRow[] =
            response.data.map((bill) => {
              /*
               * Adding a local midnight time prevents an
               * ISO date such as 2026-01-20 from shifting
               * to the previous day because of UTC conversion.
               */
              const dueDate = new Date(
                `${bill.dueDate}T00:00:00`
              );

              const millisecondsPerDay =
                1000 * 60 * 60 * 24;

              const daysOverdue = Math.max(
                Math.floor(
                  (today.getTime() -
                    dueDate.getTime()) /
                  millisecondsPerDay
                ),
                0
              );

              return {
                id: bill.id,
                customerid: bill.customerId,
                customer: bill.customerName,
                amount: Number(bill.amount ?? 0),
                dueDate: bill.dueDate,
                daysOverdue,
              };
            });

          setOverdueTableData(mappedOverdueBills);
        })
        .catch((error) => {
          if (error.code !== "ERR_CANCELED") {
            console.error(
              "OVERDUE REPORT ERROR:",
              error
            );
            setOverdueTableData([]);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [overdueBill]);

  /*
   * Generate the paid/unpaid chart using only the bills
   * already filtered and returned by the backend.
   */
  const billsData = useMemo(() => {
    if (billsTableData.length === 0) {
      return [];
    }

    return [
      {
        status: "Paid",
        count: billsTableData.filter(
          (bill) => bill.status === "Paid"
        ).length,
      },
      {
        status: "Unpaid",
        count: billsTableData.filter(
          (bill) => bill.status === "Unpaid"
        ).length,
      },
    ];
  }, [billsTableData]);

  /*
   * Calculate the total using only overdue records
   * returned by the backend.
   */
  const totalOverdueAmount = useMemo(
    () =>
      overdueTableData.reduce(
        (total, bill) =>
          total + Number(bill.amount ?? 0),
        0
      ),
    [overdueTableData]
  );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Reports
        </h1>
        <p className="mt-1 text-muted-foreground">
          Summarized and detailed views of system data
          for monitoring and analysis
        </p>
      </div>

      <Tabs
        defaultValue="monthly"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monthly">
            Monthly Report
          </TabsTrigger>

          <TabsTrigger value="customer">
            Customer Report
          </TabsTrigger>

          <TabsTrigger value="area">
            Area Report
          </TabsTrigger>

          <TabsTrigger value="bills">
            Bills Report
          </TabsTrigger>

          <TabsTrigger value="overdue">
            Overdue Report
          </TabsTrigger>
        </TabsList>

        {/* Monthly report */}
        <TabsContent
          value="monthly"
          className="space-y-6"
        >
          <MonthlyReportTab
            year={year}
            setYear={setYear}
            reports={reports}
          />
        </TabsContent>

        {/* Customer report */}
        <TabsContent
          value="customer"
          className="space-y-6"
        >
          <CustomerReportTab
            customerId={customerId}
            setCustomerId={setCustomerId}
            customerYear={customerYear}
            setCustomerYear={setCustomerYear}
            data={customerData}
          />
        </TabsContent>

        {/* Area report */}
        <TabsContent
          value="area"
          className="space-y-6"
        >
          <AreaReportTab
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            areaYear={areaYear}
            setAreaYear={setAreaYear}
            areaData={areaData}
          />
        </TabsContent>

        {/* Bills report */}
        <TabsContent
          value="bills"
          className="space-y-6"
        >
          <BillsReportTab
            customerSearchBill={customerSearchBill}
            setCustomerSearchBill={
              setCustomerSearchBill
            }
            billsTableData={billsTableData}
            billsData={billsData}
          />
        </TabsContent>

        {/* Overdue report */}
        <TabsContent
          value="overdue"
          className="space-y-6"
        >
          <OverdueReportTab
            overdueBill={overdueBill}
            setOverdueBill={setOverdueBill}
            overdueTableData={overdueTableData}
            totalOverdueAmount={
              totalOverdueAmount
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;

