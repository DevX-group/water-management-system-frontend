import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Clock,
  Landmark,
  Receipt,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  HandCoins,
  Wallet,
} from "lucide-react";
import {
  CurrentBillResponse,
  getBankDetails,
  getCurrentBillForCustomer,
  getOutstandingBillsForCustomer,
  getPaymentHistoryForCustomer,
  initiatePayment,
  OutstandingBillResponse,
  OutstandingBillsSummaryResponse,
  PaymentHistoryItemResponse,
} from "@/services/paymentService";
import { toast } from "@/components/ui/sonner";
import { uploadBankSlip, getMySlips, CustomerBankSlipResponse, deleteSlip } from "@/services/bankSlipService";
import { formatDateTime } from "@/util/dateUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPaymentMethod } from "@/util/paymentUtils";

type PaymentMethod = "online" | "slip";

interface BankSlipForm {
  amount: string;
  date: string;
  reference: string;
  file: File | null;
}

export const CustomerPayments = () => {

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
      toast.error("Failed to load payment data");
    } finally {
      setLoadingData(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);

    try {
      const response = await getPaymentHistoryForCustomer(
        historyPage,
        historyPageSize
      );

      setHistory(response.content);
      setHistoryTotalPages(response.totalPages);
      setHistoryTotalItems(response.totalElements);
    } catch {
      toast.error("Failed to load payment history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadSlips = async () => {
    setSlipsLoading(true);

    try {
      const response = await getMySlips(
        slipPage,
        slipPageSize
      );

      setBankSlips(response.content);
      setSlipTotalPages(response.totalPages);
      setSlipTotalItems(response.totalElements);
    } catch {
      toast.error("Failed to load slips");
    } finally {
      setSlipsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [historyPage, historyPageSize]);

  useEffect(() => {
    loadSlips();
  }, [slipPage, slipPageSize]);

  const monthlyDue = currentBill?.balanceDue ?? 0;
  const outstandingDue = outstandingBillsSummary?.totalOutstandingAmount ?? 0;
  const totalDue = monthlyDue + outstandingDue;
  const hasOutstanding = outstandingDue > 0;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
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
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getStatusClass = (status: string) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  const renderBankSlipContent = () => {
    if (bankSlips.length === 0) {
      return (
        <div className="text-sm text-muted-foreground text-center py-6">
          No bank slips uploaded yet.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-3 text-sm">Uploaded At</th>
              <th className="text-left p-3 text-sm">Amount</th>
              <th className="text-left p-3 text-sm">Reference</th>
              <th className="text-left p-3 text-sm">Status</th>
              <th className="text-left p-3 text-sm">Slip</th>
            </tr>
          </thead>

          <tbody>
            {bankSlips.map((slip) => (
              <tr key={slip.slipId} className="border-t border-border">
                <td className="p-3 text-sm">
                  {slip.uploadedAt?.split("T")[0]}
                </td>

                <td className="p-3 text-sm font-mono">
                  Rs. {slip.amount?.toLocaleString()}
                </td>

                <td className="p-3 text-sm">
                  {slip.bankReference}
                </td>

                <td className="p-3">
                  <Badge
                    className={getStatusClass(slip.status)}
                  >
                    {slip.status}
                  </Badge>
                </td>

                <td className="p-3 text-sm">
                  <button
                    onClick={() => setSelectedSlip(slip)}
                    className="text-primary underline text-xs hover:text-primary/80"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
    if (paymentMethod === "slip") {
      goToTab("slip");
      showToast("📋 Please fill in the bank slip upload form below.");
      return;
    }

    const enteredAmount = Number(paymentAmount);
    if (!paymentAmount || !Number.isFinite(enteredAmount) || enteredAmount <= 0) {
      showToast("⚠️ Please enter a valid amount");
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
        (typeof data === "object" ? data?.message || data?.error : data) || "Failed to add payment";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (file.size > maxSize) { removeFile(); showToast("Max file size is 5MB."); return; }
    if (!allowedTypes.includes(file.type)) { removeFile(); showToast("Only JPG, PNG, PDF allowed."); return; }
    setSlipForm((p) => ({ ...p, file }));
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
    if (!slipForm.file) { showToast("Please upload a bank slip image or PDF."); return; }
    if (!slipForm.amount || !slipForm.reference || !slipForm.date) {
      showToast("Please fill all required fields."); return;
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
        reviewedAt: null as any, // temporary pending state
      };

      setBankSlips((prev) => [newSlip, ...prev]);
      setSubmitSuccess(true);
      setSlipForm({ amount: "", date: "", reference: "", file: null });
      showToast("Bank slip uploaded successfully!");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to upload bank slip");
    } finally {
      setUploading(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "ONLINE": return <Landmark className="w-3 h-3" />;
      case "BANK_TRANSFER": return <Receipt className="w-3 h-3" />;
      case "MANUAL": return <HandCoins className="w-3 h-3" />;
      default: return <Receipt className="w-3 h-3" />;
    }
  };

  const historyStart =
    historyTotalItems === 0 ? 0 : historyPage * historyPageSize + 1;

  const historyEnd = Math.min(
    historyStart + history.length - 1,
    historyTotalItems
  );

  const slipStart =
    slipTotalItems === 0 ? 0 : slipPage * slipPageSize + 1;

  const slipEnd = Math.min(
    slipStart + bankSlips.length - 1,
    slipTotalItems
  );

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

      // remove from UI instantly
      setBankSlips((prev) => prev.filter((s) => s.slipId !== slipId));

      // close modal
      setSelectedSlip(null);

      toast.success("Slip deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete slip");
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
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your water bill payments
            </p>
          </div>

          {/* ── Unified Payment Card ── */}
          <Card ref={paymentCardRef} className="shadow-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Bill Payment
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col lg:flex-row lg:divide-x divide-border gap-6 lg:gap-0">

                {/* ── LEFT: Payment Action ── */}
                <div className="flex flex-col gap-5 lg:pl-6 lg:pr-6 lg:w-1/2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Make a Payment
                  </p>

                  {/* Total due callout */}
                  <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 px-5 py-5 overflow-hidden">
                    <div className="absolute -right-5 -top-5 w-28 h-28 rounded-full bg-white/10" />
                    <div className="absolute right-4 bottom-0 w-14 h-14 rounded-full bg-white/5" />
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider relative z-10">Due Now</p>
                    <p className="text-3xl font-bold text-foreground tracking-tight mt-1 relative z-10">
                      Rs. {totalDue.toLocaleString()}
                    </p>
                  </div>

                  {/* Outstanding notice */}
                  {hasOutstanding && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Payment applied to outstanding balance first, then monthly bill.
                      </p>
                    </div>
                  )}

                  {/* Payment Method */}
                  <MethodTabs value={paymentMethod} onChange={setPaymentMethod} />

                  {/* Amount input */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Enter Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rs.</span>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        placeholder={totalDue.toLocaleString()}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Partial payments accepted, up to Rs. {totalDue.toLocaleString()}.
                    </p>
                  </div>

                  {/* Pay button */}
                  <div className="mt-auto">
                    <Button className="gradient-primary w-full" onClick={handlePay}>
                      {paymentMethod === "slip" ? (
                        <><Receipt className="w-4 h-4 mr-2" />Upload Bank Slip</>
                      ) : (
                        <><Wallet className="w-4 h-4 mr-2" />Pay Now</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* ── RIGHT: Bill Breakdown ── */}
                <div className="flex flex-col gap-2.5 lg:pr-6 lg:pl-6 lg:w-1/2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Bill Summary
                  </p>

                  {/* Monthly Bill Row */}
                  <div className="relative rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/[0.02] px-4 py-3 overflow-hidden">
                    <div className="absolute top-0 right-0 w-14 h-14 rounded-bl-full bg-primary/5" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <CreditCard className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Monthly Bill</p>
                          {currentBill?.alreadyPaid != null && currentBill.alreadyPaid > 0 ? (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              <span className="inline-flex items-center gap-1 text-success">
                                <CheckCircle2 className="w-3 h-3" />
                                Rs. {currentBill.alreadyPaid.toLocaleString()} paid
                              </span>
                              {" "}of Rs. {(currentBill.totalAmount ?? 0).toLocaleString()}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-0.5">balance due this month</p>
                          )}
                        </div>
                      </div>
                      <p className="text-base font-bold text-foreground tracking-tight relative z-10 shrink-0 ml-2">
                        Rs. {monthlyDue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Outstanding Row */}
                  <div className={`relative rounded-xl border overflow-hidden ${hasOutstanding
                    ? "border-destructive/25 bg-gradient-to-br from-destructive/8 to-destructive/[0.02]"
                    : "border-success/25 bg-gradient-to-br from-success/8 to-success/[0.02]"
                    }`}>
                    <div className={`absolute top-0 right-0 w-14 h-14 rounded-bl-full ${hasOutstanding ? "bg-destructive/5" : "bg-success/5"}`} />
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${hasOutstanding ? "bg-destructive/10" : "bg-success/10"}`}>
                          {hasOutstanding
                            ? <Clock className="w-3.5 h-3.5 text-destructive" />
                            : <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Outstanding</p>
                          {hasOutstanding ? (
                            <button
                              type="button"
                              onClick={() => setOutstandingExpanded((v) => !v)}
                              className="text-xs text-destructive/70 hover:text-destructive underline underline-offset-2 transition-colors mt-0.5 block"
                            >
                              {totalOutstandingBills} bill{isSingle ? "" : "s"} · {outstandingExpanded ? "hide" : "details"}
                            </button>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-0.5">all clear</p>
                          )}
                        </div>
                      </div>
                      <p className={`text-base font-bold tracking-tight relative z-10 shrink-0 ml-2 ${hasOutstanding ? "text-destructive" : "text-success"}`}>
                        {hasOutstanding ? `Rs. ${outstandingDue.toLocaleString()}` : "Rs. 0"}
                      </p>
                    </div>

                    {/* Expanded outstanding bills */}
                    {outstandingExpanded && hasOutstanding && (
                      <div className="px-4 pb-3 space-y-2 border-t border-destructive/15 pt-3">
                        {currentBills.map((item) => (
                          <div key={item.billId} className="flex items-center justify-between rounded-lg border border-destructive/15 bg-background/70 px-3 py-2">
                            <div>
                              <p className="text-xs font-semibold">{item.billingPeriod}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                #{item.billId}
                                {item.paidAmount > 0 && <span className="text-success ml-1.5">· Paid Rs. {item.paidAmount.toLocaleString()}</span>}
                              </p>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <p className="text-xs font-bold text-destructive">Rs. {(item.balanceDue ?? 0).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">of Rs. {(item.totalAmount ?? 0).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center gap-1.5 pt-1">
                            <button onClick={() => setOutstandingPage((p) => Math.max(p - 1, 1))} disabled={outstandingPage === 1} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;</button>
                            {Array.from({ length: totalPages }, (_, i) => (
                              <button key={i} onClick={() => setOutstandingPage(i + 1)} className={`px-2.5 py-1 border rounded text-xs ${outstandingPage === i + 1 ? "bg-primary text-white border-primary" : ""}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setOutstandingPage((p) => Math.min(p + 1, totalPages))} disabled={outstandingPage === totalPages} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&gt;</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Total row */}
                  <div className="flex items-center justify-between rounded-xl bg-secondary/50 border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">Total Due</p>
                      <p className="text-xs text-muted-foreground mt-0.5">monthly + outstanding</p>
                    </div>
                    <p className="text-lg font-bold text-primary tracking-tight shrink-0 ml-2">
                      Rs. {totalDue.toLocaleString()}
                    </p>
                  </div>
                </div>



              </div>
            </CardContent>
          </Card>

          {/* ── Bank Slip Section ── */}
          <Card ref={slipSectionRef} className="shadow-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-success" />
                Bank Slip Upload
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Already paid at a bank branch? Upload your bank slip and we'll verify your account
                within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">

                {/* Bank Details */}
                <div className="rounded-lg bg-secondary/40 p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Payment Details
                  </h3>
                  {bankDetails && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bank</span>
                        <span className="font-semibold text-xs">{bankDetails.bankName}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Branch</span>
                        <span className="font-semibold text-xs">{bankDetails.branch}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Account No.</span>
                        <span className="font-semibold font-mono text-xs">
                          {bankDetails.accountNumber}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Account Name</span>
                        <span className="font-semibold text-xs">
                          {bankDetails.accountName}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-amber-700 leading-relaxed">
                      <strong>Important:</strong> Use your Subscription Number as the deposit remark
                      to ensure correct allocation.
                    </span>
                  </div>
                </div>

                {/* Upload Form */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Upload Your Slip
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="slipAmount">Amount Paid (Rs.)</Label>
                      <Input
                        id="slipAmount"
                        type="number"
                        min={0}
                        step={1}
                        placeholder="e.g. 1350"
                        value={slipForm.amount}
                        onChange={(e) => setSlipForm((p) => ({ ...p, amount: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slipDate">Bank Payment Date</Label>
                      <Input
                        id="slipDate"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={slipForm.date}
                        onChange={(e) => setSlipForm((p) => ({ ...p, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slipRef">Bank Reference / Slip No.</Label>
                    <Input
                      id="slipRef"
                      type="text"
                      placeholder="e.g. BOC-20250225-0042"
                      value={slipForm.reference}
                      onChange={(e) => setSlipForm((p) => ({ ...p, reference: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Upload Bank Slip</Label>
                    {slipForm.file ? (
                      <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span className="font-medium text-success flex-1 truncate">
                          {slipForm.file.name}
                        </span>
                        <button onClick={removeFile} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={`w-full relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${dragging
                          ? "border-success bg-success/10"
                          : "border-border hover:border-success/50 hover:bg-secondary/50"
                          }`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                        <Upload className="w-7 h-7 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-success">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG or PDF · Max 5MB</p>
                      </button>
                    )}
                  </div>

                  <Button className="w-full gradient-primary" onClick={handleSlipSubmit} disabled={uploading}>
                    <Receipt className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Submit Bank Slip"}
                  </Button>

                  {submitSuccess && (
                    <p className="text-sm text-success flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Slip submitted! Verification within 24 hours.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Bank Slip History ── */}
          <Card className="shadow-card border-none">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  Uploaded Bank Slips
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  Track your submitted bank slips and verification status
                </p>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-muted-foreground">
                  Items per page
                </span>

                <Select
                  value={String(slipPageSize)}
                  onValueChange={(value) => {
                    setSlipPageSize(Number(value));
                    setSlipPage(0);
                  }}
                >
                  <SelectTrigger className="w-[65px] h-9 rounded-lg bg-secondary/40">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="min-w-0 w-[70px]">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {slipsLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading slips...
                </div>
              ) : (
                renderBankSlipContent()
              )}

              {slipTotalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">

                  {/* Showing count */}
                  <div className="text-sm text-muted-foreground">
                    {slipStart}-{slipEnd} of {slipTotalItems} items
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-2">

                    {/* First */}
                    <button
                      onClick={() => setSlipPage(0)}
                      disabled={slipPage === 0}
                      className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                    >
                      {"<<"}
                    </button>

                    {/* Previous */}
                    <button
                      onClick={() =>
                        setSlipPage((p) => Math.max(p - 1, 0))
                      }
                      disabled={slipPage === 0}
                      className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                    >
                      {"<"}
                    </button>

                    {/* Page info */}
                    <div className="text-sm px-3">
                      Page {slipPage + 1} of {slipTotalPages}
                    </div>

                    {/* Next */}
                    <button
                      onClick={() =>
                        setSlipPage((p) =>
                          Math.min(p + 1, slipTotalPages - 1)
                        )
                      }
                      disabled={slipPage === slipTotalPages - 1}
                      className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                    >
                      {">"}
                    </button>

                    {/* Last */}
                    <button
                      onClick={() =>
                        setSlipPage(slipTotalPages - 1)
                      }
                      disabled={slipPage === slipTotalPages - 1}
                      className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                    >
                      {">>"}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Payment History ── */}
          <Card ref={historyRef} className="shadow-card border-none">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Payment History</CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  View your completed and pending payment records
                </p>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-muted-foreground">
                  Items per page
                </span>

                <Select
                  value={String(historyPageSize)}
                  onValueChange={(value) => {
                    setHistoryPageSize(Number(value));
                    setHistoryPage(0);
                  }}
                >
                  <SelectTrigger className="w-[65px] h-9 rounded-lg bg-secondary/40">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="min-w-0 w-[70px]">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading payment history...
                </div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-secondary/50">
                    <tr>
                      {["Date", "Amount", "Method", "Status"].map((h) => (
                        <th key={h} className="text-left p-4 font-medium text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-sm text-muted-foreground text-center">
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      <>
                        {history.map((p) => {
                          const isManual = p.paymentMethod === "MANUAL";

                          const displayStatus =
                            isManual && p.paymentType
                              ? `${p.paymentType} - ${p.status}`
                              : p.status;

                          return (
                            <tr key={p.paymentId} className="border-t border-border">
                              <td className="p-4 text-sm">{formatDateTime(p.createdAt)}</td>
                              <td className="p-4 text-sm font-mono">
                                Rs. {p.amount.toLocaleString()}
                              </td>
                              <td className="p-4 text-sm">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                  {getPaymentIcon(p.paymentMethod)}
                                  {formatPaymentMethod(p.paymentMethod)}
                                </span>
                              </td>
                              <td className="p-4">
                                <Badge className={p.status === "FULL" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                                  {displayStatus}
                                </Badge>
                              </td>
                            </tr>
                          )

                        })}
                      </>
                    )}
                  </tbody>
                </table>

                {historyTotalPages > 1 && (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">

                    {/* Showing count */}
                    <div className="text-sm text-muted-foreground">
                      {historyStart}-{historyEnd} of {historyTotalItems} items
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">

                      {/* First */}
                      <button
                        onClick={() => setHistoryPage(0)}
                        disabled={historyPage === 0}
                        className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                      >
                        {"<<"}
                      </button>

                      {/* Previous */}
                      <button
                        onClick={() =>
                          setHistoryPage((p) => Math.max(p - 1, 0))
                        }
                        disabled={historyPage === 0}
                        className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                      >
                        {"<"}
                      </button>

                      {/* Page info */}
                      <div className="text-sm px-3">
                        Page {historyPage + 1} of {historyTotalPages}
                      </div>

                      {/* Next */}
                      <button
                        onClick={() =>
                          setHistoryPage((p) =>
                            Math.min(p + 1, historyTotalPages - 1)
                          )
                        }
                        disabled={historyPage === historyTotalPages - 1}
                        className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                      >
                        {">"}
                      </button>

                      {/* Last */}
                      <button
                        onClick={() =>
                          setHistoryPage(historyTotalPages - 1)
                        }
                        disabled={historyPage === historyTotalPages - 1}
                        className="px-2 py-1 border rounded text-xs disabled:opacity-40"
                      >
                        {">>"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-foreground text-background px-5 py-3.5 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4">
          {toastMsg}
        </div>
      )}

      {/* ── Bank Slip Preview Modal ── */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-[90%] max-w-6xl max-h-[98vh] h-auto relative overflow-hidden shadow-2xl">

            {/* Close button */}
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-4 right-4 z-10 rounded-full p-1.5 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full">

              {/* ── LEFT: SLIP IMAGE ── */}
              <div className="flex items-center justify-center bg-gray-100 p-6 border-r">
                {selectedSlip.filePath?.includes(".pdf") ? (
                  <iframe
                    src={selectedSlip.filePath}
                    className="w-full h-full rounded-lg shadow"
                    title="Bank Slip PDF"
                  />
                ) : (
                  <img
                    src={selectedSlip.filePath}
                    alt="Bank Slip"
                    className="max-h-full max-w-full object-contain rounded-lg shadow hover:scale-[1.02] transition"
                  />
                )}
              </div>

              {/* ── RIGHT: DETAILS ── */}
              <div className="p-6 flex flex-col justify-between overflow-auto">

                {/* Top section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Bank Slip Details</h2>

                  {/* Info Sections */}
                  <div className="space-y-5 text-sm">

                    {/* Amount + Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Amount</p>
                        <p className="font-semibold text-base">
                          Rs. {selectedSlip.amount?.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Status</p>
                        <p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                            {selectedSlip.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-2 gap-4">

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Uploaded At</p>
                        <p className="font-medium">
                          {selectedSlip.uploadedAt?.split("T")[0] || "-"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Bank Payment Date</p>
                        <p className="font-medium">
                          {selectedSlip.bankPaymentDate?.split("T")[0] || "-"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Reviewed At</p>
                        <p className="font-medium">
                          {selectedSlip.reviewedAt?.split("T")[0] || "Not reviewed yet"}
                        </p>
                      </div>

                    </div>

                    {/* Reference */}
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Reference</p>
                      <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                        {selectedSlip.bankReference}
                      </p>
                    </div>

                  </div>

                  {/* Rejection reason */}
                  {selectedSlip.status === "REJECTED" && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-xs text-red-600 font-medium mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-700">
                        {selectedSlip.rejectionReason || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom actions */}
                <div className="mt-6 flex justify-between items-center">

                  {/* Download */}
                  <a
                    href={selectedSlip.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    View / Download Slip
                  </a>

                  {/* Delete (only pending) */}
                  {selectedSlip.status === "PENDING" && (
                    <button
                      onClick={() => handleDeleteSlip(selectedSlip.slipId)}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

// ─── Method Tabs ──────────────────────────────────────────────────────────────

interface MethodTabsProps {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}

const MethodTabs = ({ value, onChange }: MethodTabsProps) => {
  const activeClass = "border-primary bg-primary/10 text-primary";
  const inactiveClass = "border-border text-muted-foreground hover:border-primary/40";

  const tab = (method: PaymentMethod, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => onChange(method)}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-[1.5px] py-2 text-sm font-medium transition-colors ${value === method ? activeClass : inactiveClass
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Pay via
      </p>
      <div className="flex gap-2">
        {tab("online", <Landmark className="w-3.5 h-3.5" />, "Online Banking")}
        {tab("slip", <Receipt className="w-3.5 h-3.5" />, "Bank Slip")}
      </div>
    </div>
  );
};

export default CustomerPayments;