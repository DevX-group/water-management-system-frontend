import '@/index.css';
import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  getBankDetails,
  getCurrentBillForCustomer,
  getOutstandingBillsForCustomer,
  getPaymentHistoryForCustomer,
  initiatePayment,
} from "@/services/paymentService";
import { toast } from "@/components/ui/sonner";
import { uploadBankSlip, getMySlips, deleteSlip, extractBankSlipData } from "@/services/bankSlipService";
import type {
  CurrentBillResponse,
  PaymentHistoryItemResponse,
  OutstandingBillResponse,
  OutstandingBillsSummaryResponse,
  PaymentMethod,
  SlipStatus,
} from "@/types/payment";
import type {
  CustomerBankSlipResponse,
} from "@/types/bankSlip";

import { CustomerPaymentCard } from "@/components/payments/CustomerPaymentComponents";
import { CustomerBankSlipSection, CustomerBankSlipHistory, CustomerBankSlipModal, BankSlipForm } from "@/components/payments/CustomerBankSlipComponents";
import { CustomerPaymentHistoryTable } from "@/components/payments/CustomerPaymentHistoryTable";
import { useTranslation } from "react-i18next";

export const CustomerPayments = () => {
  const { t } = useTranslation();

  const [currentBill, setCurrentBill] = useState<CurrentBillResponse | null>(null);
  const [outstandingBillsSummary, setOutstandingBillsSummary] = useState<OutstandingBillsSummaryResponse | null>(null);
  const [outstandingBills, setOutstandingBills] = useState<OutstandingBillResponse[]>([]);
  const [history, setHistory] = useState<PaymentHistoryItemResponse[]>([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(5);
  const [historyTotalItems, setHistoryTotalItems] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [bankSlips, setBankSlips] = useState<CustomerBankSlipResponse[]>([]);
  const [slipsLoading, setSlipsLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const [slipPage, setSlipPage] = useState(0);
  const [slipTotalPages, setSlipTotalPages] = useState(0);
  const [slipPageSize, setSlipPageSize] = useState(5);
  const [slipTotalItems, setSlipTotalItems] = useState(0);

  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "payment";

  const [bankDetails, setBankDetails] = useState<any>(null);

  // Filter state
  const [historyFilterYear, setHistoryFilterYear] = useState<number | undefined>(undefined);
  const [historyFilterMethod, setHistoryFilterMethod] = useState<PaymentMethod | undefined>(undefined);
  const [slipFilterYear, setSlipFilterYear] = useState<number | undefined>(undefined);
  const [slipFilterStatus, setSlipFilterStatus] = useState<SlipStatus | undefined>(undefined);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) return;
    const validTabs = ["payment", "slip", "history"];
    if (!validTabs.includes(tab)) {
      setSearchParams({ tab: "payment" });
    }
  }, [searchParams, setSearchParams]);

  const goToTab = (tab: string) => setSearchParams({ tab });

  const paymentCardRef = useRef<HTMLDivElement>(null);
  const slipSectionRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingData) return;
    const timer = setTimeout(() => {
      if (activeTab === "payment") {
        paymentCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (activeTab === "slip") {
        slipSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (activeTab === "history") {
        historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeTab, loadingData]);

  const loadInitialData = async () => {
    setLoadingData(true);

    try {
      const [bill, outs, bank] = await Promise.all([
        getCurrentBillForCustomer(),
        getOutstandingBillsForCustomer(),
        getBankDetails(),
      ]);

      setCurrentBill(bill);
      setOutstandingBillsSummary(outs);
      setOutstandingBills(outs.outstandingBills);
      setBankDetails(bank);
    } catch {
      toast.error(t("payments.paymentHistory.failedToLoadData"));
    } finally {
      setLoadingData(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);

    try {
      const response = await getPaymentHistoryForCustomer(
        historyPage,
        historyPageSize,
        historyFilterYear,
        historyFilterMethod
      );

      setHistory(response.content);
      setHistoryTotalPages(response.totalPages);
      setHistoryTotalItems(response.totalElements);
    } catch {
      toast.error(t("payments.paymentHistory.failedToLoadHistory"));
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadSlips = async () => {
    setSlipsLoading(true);

    try {
      const response = await getMySlips(
        slipPage,
        slipPageSize,
        slipFilterYear,
        slipFilterStatus
      );

      setBankSlips(response.content);
      setSlipTotalPages(response.totalPages);
      setSlipTotalItems(response.totalElements);
    } catch {
      toast.error(t("payments.pendingSlips.failedToLoad"));
    } finally {
      setSlipsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [historyPage, historyPageSize, historyFilterYear, historyFilterMethod]);

  useEffect(() => {
    loadSlips();
  }, [slipPage, slipPageSize, slipFilterYear, slipFilterStatus]);

  const handleHistoryFilterChange = () => {
    setHistoryPage(0);
  };

  const handleSlipFilterChange = () => {
    setSlipPage(0);
  };

  const monthlyDue = currentBill?.balanceDue ?? 0;
  const outstandingDue = outstandingBillsSummary?.totalOutstandingAmount ?? 0;
  const totalDue = monthlyDue + outstandingDue;
  const hasOutstanding = outstandingDue > 0;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [outstandingExpanded, setOutstandingExpanded] = useState(false);
  const [outstandingPage, setOutstandingPage] = useState(0);
  const billsPerPage = 4;
  const indexOfLastBill = (outstandingPage + 1) * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = outstandingBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(outstandingBills.length / billsPerPage);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 6000);
  };

  // ── Payment handler ─────────────────────────────────────────────────────────
  const redirectToPayHere = (data: any) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payhere.lk/pay/checkout";
    const mappedData = {
      merchant_id: data.merchantId,
      order_id: data.orderId,
      items: data.items,
      amount: data.amount,
      currency: data.currency,
      hash: data.hash,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      city: data.city,
      country: data.country,
      return_url: data.returnUrl,
      cancel_url: data.cancelUrl,
      notify_url: data.notifyUrl,
    };
    Object.entries(mappedData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  const handlePay = async () => {
    if (paymentMethod === "BANK_TRANSFER") {
      goToTab("slip");
      showToast(t("payments.billPayment.fillBankSlipForm"));
      return;
    }

    const enteredAmount = Number(paymentAmount);
    if (!paymentAmount || !Number.isFinite(enteredAmount) || enteredAmount <= 0) {
      showToast(t("payments.billPayment.enterValidAmount"));
      return;
    }

    try {
      const response = await initiatePayment({
        amount: enteredAmount,
        paymentMethod: "ONLINE",
      });
      redirectToPayHere(response);
    } catch (e: any) {
      const data = e?.response?.data;
      const msg =
        (typeof data === "object" ? data?.message || data?.error : data) || t("payments.billPayment.failedToAddPayment");
      showToast(`❌ ${msg}`);
    }
  };

  // ── Bank slip ───────────────────────────────────────────────────────────────
  const [slipForm, setSlipForm] = useState<BankSlipForm>({
    amount: "",
    date: "",
    reference: "",
    file: null,
  });
  const [dragging, setDragging] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── AI Slip Auto-Extraction ───────────────────────────────────────────
  const handleFile = async (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (file.size > maxSize) { removeFile(); showToast(t("payments.bankSlipUpload.maxFileSize")); return; }
    if (!allowedTypes.includes(file.type)) { removeFile(); showToast(t("payments.bankSlipUpload.allowedFileTypes")); return; }

    setSlipForm((p) => ({ ...p, file }));

    // AI Vision extraction
    try {
      setIsExtracting(true);
      showToast("AI scanning bank slip...");

      const extracted = await extractBankSlipData(file);

      if (extracted.extracted) {
        const hasAmount = extracted.amount !== null && extracted.amount !== undefined;
        const hasDate = !!extracted.bankPaymentDate;
        const hasRef = !!extracted.bankReference;

        setSlipForm((prev) => ({
          ...prev,
          amount: hasAmount ? String(extracted.amount) : prev.amount,
          date: hasDate ? extracted.bankPaymentDate : prev.date,
          reference: hasRef ? extracted.bankReference : prev.reference,
        }));

        const filled: string[] = [];
        const missing: string[] = [];

        if (hasAmount) filled.push("Amount"); else missing.push("Amount");
        if (hasDate) filled.push("Date"); else missing.push("Date");
        if (hasRef) filled.push("Reference"); else missing.push("Reference");

        if (missing.length === 0) {
          showToast("All fields auto-filled by AI! Check and edit if needed.");
        } else if (filled.length === 0) {
          showToast("Could not auto-read slip. Please fill all fields manually.");
        } else {
          showToast(
            `Auto-filled: ${filled.join(", ")}  |  Fill manually: ${missing.join(", ")}`
          );
        }
      } else {
        showToast("Could not auto-read slip. Please fill fields manually.");
      }
    } catch (err) {
      console.warn("AI extraction unavailable:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const removeFile = () => {
    setSlipForm((p) => ({ ...p, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSlipSubmit = async () => {
    if (!slipForm.file) { showToast(t("payments.bankSlipUpload.uploadSlipImage")); return; }
    if (!slipForm.amount || !slipForm.reference || !slipForm.date) {
      showToast(t("payments.bankSlipUpload.fillAllFields")); return;
    }
    try {
      setUploading(true);
      const uploadResponse = await uploadBankSlip({
        amount: Number(slipForm.amount),
        bankPaymentDate: slipForm.date,
        bankReference: slipForm.reference,
        file: slipForm.file,
      });

      const newSlip: CustomerBankSlipResponse = {
        slipId: uploadResponse.slipId,
        amount: uploadResponse.amount,
        bankReference: uploadResponse.bankReference,
        filePath: uploadResponse.filePath,
        status: uploadResponse.status,
        uploadedAt: uploadResponse.uploadedAt,
        bankPaymentDate: uploadResponse.bankPaymentDate,
        reviewedAt: null as any,
      };

      setBankSlips((prev) => [newSlip, ...prev]);
      setSubmitSuccess(true);
      setSlipForm({ amount: "", date: "", reference: "", file: null });
      showToast(t("payments.bankSlipUpload.uploadSuccess"));
    } catch (err: any) {
      showToast(err?.response?.data?.message || t("payments.bankSlipUpload.uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const historyStart = historyTotalItems === 0 ? 0 : historyPage * historyPageSize + 1;
  const historyEnd = Math.min(historyStart + history.length - 1, historyTotalItems);
  const slipStart = slipTotalItems === 0 ? 0 : slipPage * slipPageSize + 1;
  const slipEnd = Math.min(slipStart + bankSlips.length - 1, slipTotalItems);

  let statusClass = "";
  if (selectedSlip?.status === "APPROVED") {
    statusClass = "bg-green-100 text-green-700";
  } else if (selectedSlip?.status === "REJECTED") {
    statusClass = "bg-red-100 text-red-600";
  } else {
    statusClass = "bg-yellow-100 text-yellow-700";
  }

  const totalOutstandingBills = outstandingBills.length;
  const isSingle = totalOutstandingBills === 1;

  const handleDeleteSlip = async (slipId: number) => {
    try {
      await deleteSlip(slipId);
      setBankSlips((prev) => prev.filter((s) => s.slipId !== slipId));
      setSelectedSlip(null);
      toast.success(t("payments.bankSlipHistory.slipDeleteSuccess"));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("payments.bankSlipHistory.slipDeleteFailed"));
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <MainLayout isAuthenticated={true}>
      {loadingData ? (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-72 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-96 rounded-2xl bg-muted animate-pulse" />
          <div className="h-72 rounded-2xl bg-muted animate-pulse" />
          <div className="h-72 rounded-2xl bg-muted animate-pulse" />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* ── Header ── */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold">{t("payments.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("payments.subtitle")}
            </p>
          </div>

          <CustomerPaymentCard
            paymentCardRef={paymentCardRef}
            totalDue={totalDue}
            hasOutstanding={hasOutstanding}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            handlePay={handlePay}
            currentBill={currentBill}
            monthlyDue={monthlyDue}
            outstandingDue={outstandingDue}
            outstandingExpanded={outstandingExpanded}
            setOutstandingExpanded={setOutstandingExpanded}
            totalOutstandingBills={totalOutstandingBills}
            isSingle={isSingle}
            currentBills={currentBills}
            totalPages={totalPages}
            outstandingPage={outstandingPage}
            setOutstandingPage={setOutstandingPage}
          />

          <CustomerBankSlipSection
            slipSectionRef={slipSectionRef}
            bankDetails={bankDetails}
            slipForm={slipForm}
            setSlipForm={setSlipForm}
            dragging={dragging}
            setDragging={setDragging}
            submitSuccess={submitSuccess}
            uploading={uploading || isExtracting}
            fileInputRef={fileInputRef}
            handleFile={handleFile}
            handleFileInput={handleFileInput}
            handleDrop={handleDrop}
            removeFile={removeFile}
            handleSlipSubmit={handleSlipSubmit}
          />

          <CustomerBankSlipHistory
            slipPageSize={slipPageSize}
            setSlipPageSize={setSlipPageSize}
            setSlipPage={setSlipPage}
            slipsLoading={slipsLoading}
            bankSlips={bankSlips}
            setSelectedSlip={setSelectedSlip}
            slipTotalPages={slipTotalPages}
            slipStart={slipStart}
            slipEnd={slipEnd}
            slipTotalItems={slipTotalItems}
            slipPage={slipPage}
            filterYear={slipFilterYear}
            setFilterYear={setSlipFilterYear}
            filterStatus={slipFilterStatus}
            setFilterStatus={setSlipFilterStatus}
            onFilterChange={handleSlipFilterChange}
          />

          <CustomerPaymentHistoryTable
            historyRef={historyRef}
            historyPageSize={historyPageSize}
            setHistoryPageSize={setHistoryPageSize}
            setHistoryPage={setHistoryPage}
            historyLoading={historyLoading}
            history={history}
            historyTotalPages={historyTotalPages}
            historyStart={historyStart}
            historyEnd={historyEnd}
            historyTotalItems={historyTotalItems}
            historyPage={historyPage}
            filterYear={historyFilterYear}
            setFilterYear={setHistoryFilterYear}
            filterMethod={historyFilterMethod}
            setFilterMethod={setHistoryFilterMethod}
            onFilterChange={handleHistoryFilterChange}
          />
        </div>
      )}

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed bottom-24 right-8 z-50 rounded-xl bg-foreground text-background px-5 py-3.5 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4 flex items-center gap-2">
          {toastMsg}
        </div>
      )}

      {/* ── Bank Slip Preview Modal ── */}
      <CustomerBankSlipModal
        selectedSlip={selectedSlip}
        setSelectedSlip={setSelectedSlip}
        statusClass={statusClass}
        handleDeleteSlip={handleDeleteSlip}
      />
    </MainLayout>
  );
};

export default CustomerPayments;
