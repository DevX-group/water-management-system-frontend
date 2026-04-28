import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Clock,
  Landmark,
  Receipt,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { CurrentBillResponse, getCurrentBill, getOutstandingBillsSummary, initiatePayment, OutstandingBillResponse, OutstandingBillsSummaryResponse, PaymentType } from "@/services/paymentService";
import { toast } from "@/components/ui/sonner";


type PaymentMethod = "online" | "slip";
type ModalVariant = "monthly" | "outstanding" | null;
type WarnVariant = "outstanding-block" | null;

interface OutstandingItem {
  month: string;
  amount: number;
}

interface HistoryEntry {
  month: string;
  amount: number;
  date: string;
  method: "Online" | "Bank Slip";
  status: "Full" | "Partial";
}

interface BankSlipForm {
  paymentFor: string;
  amount: string;
  date: string;
  reference: string;
  file: File | null;
}

// mock data (replace later)

const PAYMENT_OPTIONS = ["Monthly Bill", "Outstanding Balance"];

const HISTORY: HistoryEntry[] = [
  { month: "October 2025", amount: 2800, date: "20/10/2025", method: "Online", status: "Full" },
  { month: "September 2025", amount: 1400, date: "28/09/2025", method: "Bank Slip", status: "Partial" },
  { month: "August 2025", amount: 2800, date: "21/08/2025", method: "Online", status: "Full" },
];

const BANK_DETAILS = [["Bank", "Bank of Ceylon"], ["Branch", "Colombo Main"], ["Account No.", "001-2031-4567"], ["Account Name", "NWSB – Water Services"], ["Reference", "WF-2025-00142"],] as const;


export const CustomerPayments = () => {
  const [subscriptionNumber] = useState("SP-4589"); // replace with actual subscription number from auth context or props

  const [currentBill, setCurrentBill] = useState<CurrentBillResponse | null>(null);
  const [outstandingBillsSummary, setOutstandingBillsSummary] = useState<OutstandingBillsSummaryResponse | null>(null);
  const [outstandingBills, setOutstandingBills] = useState<OutstandingBillResponse[]>([]);
  const [history, setHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadAll = async (subscriptionNumber: string) => {
    setLoadingData(true);
    try {
      const [bill, outs] = await Promise.all([
        getCurrentBill(subscriptionNumber),
        getOutstandingBillsSummary(subscriptionNumber),
      ])

      setCurrentBill(bill);
      setOutstandingBillsSummary(outs);
      setOutstandingBills(outs.outstandingBills);

    } catch (e) {
      toast.error('Failed to load payment data');
    } finally {
      setLoadingData(false);
    }
  };

  const [outstandingPage, setOutstandingPage] = useState(1);
  const billsPerPage = 6;

  const indexOfLastBill = outstandingPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = outstandingBills.slice(indexOfFirstBill, indexOfLastBill);

  const totalPages = Math.ceil(outstandingBills.length / billsPerPage);

  const [monthlyMethod, setMonthlyMethod] = useState<PaymentMethod>("online");
  const [outstandingMethod, setOutstandingMethod] = useState<PaymentMethod>("online");

  //payment amount
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [outstandingAmount, setOutstandingAmount] = useState("");

  // Whether this customer has unpaid outstanding balance
  const hasOutstanding = (outstandingBills?.length ?? 0) > 0;

  // Modal
  const [modal, setModal] = useState<ModalVariant>(null);

  // Outstanding-block warning dialog
  const [warn, setWarn] = useState<WarnVariant>(null);
  const outstandingCardRef = useRef<HTMLDivElement>(null);

  // Bank slip form
  const [slipForm, setSlipForm] = useState<BankSlipForm>({
    paymentFor: PAYMENT_OPTIONS[0],
    amount: "",
    date: "",
    reference: "",
    file: null,
  });
  const [dragging, setDragging] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slipSectionRef = useRef<HTMLDivElement>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ── Payment handlers ────────────────────────────────────────────────────────

  const redirectToPayHere = (data) => {
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
      notify_url: data.notifyUrl
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

  const handlePay = async (type: "monthly" | "outstanding") => {
    if (type === "monthly" && hasOutstanding) {
      setWarn("outstanding-block");
      return;
    }

    const method = type === "monthly" ? monthlyMethod : outstandingMethod;
    const amount = type === "monthly" ? monthlyAmount : outstandingAmount;
    const paymentType: PaymentType = type === "monthly" ? "MONTHLY" : "OUTSTANDING";

    if (!amount) {
      showToast("⚠️ Please enter an amount");
      return;
    }

    const enteredAmount = Number(amount);
    if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
      showToast("⚠️ Enter a valid amount");
      return;
    }

    if (method === "slip") {
      slipSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("📋 Please fill in the bank slip upload form below.");
      return;
    }

    try {
      const response = await initiatePayment({
        subscriptionNumber: "SP-4589", // replace        
        amount: enteredAmount,
        paymentType,
        paymentMethod: "ONLINE"
      });

      redirectToPayHere(response);

    } catch (e) {
      const data = (e)?.response?.data;
      const msg = (typeof data === 'object' ? data?.message || data?.error : data) || 'Failed to add payment';
      showToast(`❌ ${msg}`); // 
    }
  };

  const handleWarnPayOutstanding = () => {
    setWarn(null);
    setTimeout(() => {
      outstandingCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  // ── File upload handlers ─────────────────────────────────────────────────────

  const handleFile = (file: File) => setSlipForm((p) => ({ ...p, file }));

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    setSlipForm((p) => ({ ...p, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSlipSubmit = () => {
    if (!slipForm.file) {
      showToast("⚠️ Please upload a bank slip image or PDF.");
      return;
    }
    setSubmitSuccess(true);
    setSlipForm({ paymentFor: PAYMENT_OPTIONS[0], amount: "", date: "", reference: "", file: null });
    setTimeout(() => setSubmitSuccess(false), 4000);
    showToast("✅ Bank slip submitted! Verification within 24 hours.");
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const isOutstandingModal = modal === "outstanding";

  useEffect(() => {
    if (!subscriptionNumber) return;
    loadAll(subscriptionNumber);
  }, [subscriptionNumber]);


  return (
    <MainLayout isAuthenticated={true}>
      {loadingData ? (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-72 bg-muted animate-pulse rounded"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-2xl bg-muted animate-pulse"></div>
            <div className="h-80 rounded-2xl bg-muted animate-pulse"></div>
          </div>

          <div className="h-96 rounded-2xl bg-muted animate-pulse"></div>

          <div className="h-72 rounded-2xl bg-muted animate-pulse"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your monthly and outstanding water bill payments
            </p>
          </div>

          {/* ── Payment Cards ── */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">

            {/* Monthly */}
            <Card className={`shadow-card border-none transition-opacity ${hasOutstanding ? "opacity-75" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Monthly Payment
                  {hasOutstanding && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                      <AlertTriangle className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Warning banner shown when monthly is blocked */}
                {hasOutstanding && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/[0.06] px-4 py-3">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive leading-relaxed">
                      You have an outstanding balance of{" "}
                      <strong>Rs. {(outstandingBillsSummary?.totalOutstandingAmount ?? 0).toLocaleString()}</strong>. Please clear it
                      before paying your monthly bill.
                    </p>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Bill:</span>
                  <span className="font-semibold">Rs. {(currentBill?.totalAmount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span className="font-semibold">Rs. {(currentBill?.alreadyPaid ?? 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span className="font-medium">Total Due:</span>
                  <span className="text-xl font-bold text-primary">
                    Rs. {(currentBill?.balanceDue ?? 0).toLocaleString()}
                  </span>
                </div>

                {/* Method Toggle */}
                <MethodTabs value={monthlyMethod} onChange={setMonthlyMethod} variant="primary" />

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    className="flex-1"
                  />

                  <Button
                    className="gradient-primary"
                    onClick={() => handlePay("monthly")}
                    disabled={hasOutstanding}
                    title={hasOutstanding ? "Clear outstanding balance first" : undefined}
                  >
                    {hasOutstanding ? (
                      <><AlertTriangle className="w-4 h-4 mr-2" />Pay Outstanding First</>
                    ) : (
                      "Pay Now →"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Outstanding */}
            <Card
              ref={outstandingCardRef}
              className={`shadow-card border-none ring-2 transition-all ${warn === "outstanding-block"
                ? "ring-destructive ring-offset-2"
                : "ring-transparent"
                }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning" />
                  Outstanding Payment
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {hasOutstanding ? (
                  <>
                    {/* Outstanding Bills List */}
                    {currentBills.map((item) => (
                      <div
                        key={item.billId}
                        className="rounded-lg border border-border p-3 space-y-2 bg-secondary/30"
                      >
                        {/* Bill Period */}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.billingPeriod}
                          </span>

                          <span className="font-medium">
                            Bill #{item.billId}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Bill
                          </span>

                          <span className="font-semibold">
                            Rs. {(item.totalAmount ?? 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Paid */}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Already Paid
                          </span>

                          <span className="font-semibold text-success">
                            Rs. {(item.paidAmount ?? 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Due */}
                        <div className="flex justify-between text-sm border-t pt-2">
                          <span className="font-medium">
                            Balance Due
                          </span>

                          <span className="font-bold text-destructive">
                            Rs. {(item.balanceDue ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-4">
                        {/* Previous */}
                        <button
                          onClick={() =>
                            setOutstandingPage((prev) =>
                              Math.max(prev - 1, 1)
                            )
                          }
                          disabled={outstandingPage === 1}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          &lt;
                        </button>

                        {/* Numbers */}
                        {Array.from(
                          { length: totalPages },
                          (_, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                setOutstandingPage(i + 1)
                              }
                              className={`px-3 py-1 border rounded ${outstandingPage === i + 1
                                ? "bg-primary text-white"
                                : ""
                                }`}
                            >
                              {i + 1}
                            </button>
                          )
                        )}

                        {/* Next */}
                        <button
                          onClick={() =>
                            setOutstandingPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={
                            outstandingPage === totalPages
                          }
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          &gt;
                        </button>
                      </div>
                    )}

                    {/* Total Outstanding */}
                    <div className="flex justify-between border-t pt-4">
                      <span className="font-medium">
                        Total Due:
                      </span>

                      <span className="text-xl font-bold text-destructive">
                        Rs. {(
                          outstandingBillsSummary?.totalOutstandingAmount ?? 0
                        ).toLocaleString()}
                      </span>
                    </div>

                    {/* Payment Method */}
                    <MethodTabs
                      value={outstandingMethod}
                      onChange={setOutstandingMethod}
                      variant="destructive"
                    />

                    {/* Payment Input */}
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={outstandingAmount}
                        onChange={(e) =>
                          setOutstandingAmount(
                            e.target.value
                          )
                        }
                        className="flex-1 focus-visible:ring-destructive/80"
                      />

                      <Button
                        variant="destructive"
                        onClick={() =>
                          handlePay("outstanding")
                        }
                      >
                        Pay Now →
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* No Outstanding */}
                    <div className="flex items-center gap-3 rounded-lg bg-success/10 border border-success/20 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>

                      <div>
                        <p className="font-semibold text-success text-sm">
                          No Dues Pending
                        </p>

                        <p className="text-xs text-muted-foreground mt-0.5">
                          You have no outstanding balance to pay.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-3">
                      <span className="font-medium text-sm">
                        Outstanding Balance
                      </span>

                      <span className="text-xl font-bold text-success">
                        Rs. 0
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Bank Slip Section ── */}
          <Card ref={slipSectionRef} className="shadow-card border-none mb-6">
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
                  {BANK_DETAILS.map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-semibold font-mono text-xs">{val}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-md bg-warning/10 border border-warning/20 flex gap-2 text-xs text-warning-foreground">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span>
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

                  {/* Payment For */}
                  <div className="space-y-1.5">
                    <Label htmlFor="paymentFor">Payment For</Label>
                    <Select
                      value={slipForm.paymentFor}
                      onValueChange={(v) => setSlipForm((p) => ({ ...p, paymentFor: v }))}
                    >
                      <SelectTrigger id="paymentFor">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount + Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="slipAmount">Amount Paid (Rs.)</Label>
                      <Input
                        id="slipAmount"
                        type="number"
                        placeholder="e.g. 1350"
                        value={slipForm.amount}
                        onChange={(e) => setSlipForm((p) => ({ ...p, amount: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slipDate">Payment Date</Label>
                      <Input
                        id="slipDate"
                        type="date"
                        value={slipForm.date}
                        onChange={(e) => setSlipForm((p) => ({ ...p, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Reference */}
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

                  {/* File Upload */}
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
                      <div
                        className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${dragging
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
                          <span className="font-semibold text-success">Click to upload</span> or drag
                          and drop
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG or PDF • Max 5MB</p>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant="default"
                    onClick={handleSlipSubmit}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Submit Bank Slip
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

          {/* ── Payment History ── */}
          <Card className="shadow-card border-none">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      {["Month", "Amount", "Date", "Method", "Status"].map((h) => (
                        <th key={h} className="text-left p-4 font-medium text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HISTORY.map((entry, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-4 text-sm">{entry.month}</td>
                        <td className="p-4 text-sm font-mono">
                          Rs. {entry.amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm">{entry.date}</td>
                        <td className="p-4 text-sm">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {entry.method === "Online" ? (
                              <Landmark className="w-3 h-3" />
                            ) : (
                              <Receipt className="w-3 h-3" />
                            )}
                            {entry.method}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              entry.status === "Full" ? "bg-success" : "bg-warning"
                            }
                          >
                            {entry.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Outstanding Balance Block Warning ── */}
      <Dialog open={warn === "outstanding-block"} onOpenChange={(open) => !open && setWarn(null)}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-2">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            <DialogHeader className="space-y-1.5">
              <DialogTitle className="text-center text-lg">
                Outstanding Balance Due
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                You must clear your outstanding balance before making a monthly payment.
              </p>
            </DialogHeader>

            {/* Outstanding breakdown */}
            <div className="w-full rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
              {outstandingBills.map((item) => (
                <div key={item.billId} className="flex justify-between text-sm">
                  <span>{item.billingPeriod}</span>
                  <span>
                    Rs. {(item.balanceDue ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-destructive/20 pt-2 mt-1">
                <span className="text-sm font-semibold">Total Outstanding</span>
                <span className="text-sm font-bold text-destructive">
                  Rs. {outstandingBillsSummary?.totalOutstandingAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2 mt-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleWarnPayOutstanding}
            >
              Pay Outstanding Now →
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setWarn(null)}
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-foreground text-background px-5 py-3.5 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4">
          {toastMsg}
        </div>
      )}
    </MainLayout>
  );
};

// ─── Method Tabs Sub-component ────────────────────────────────────────────────

interface MethodTabsProps {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
  variant: "primary" | "destructive";
}

const MethodTabs = ({ value, onChange, variant }: MethodTabsProps) => {
  const activeClass =
    variant === "primary"
      ? "border-primary bg-primary/10 text-primary"
      : "border-destructive bg-destructive/10 text-destructive";

  const inactiveClass =
    variant === "primary"
      ? "border-border text-muted-foreground hover:border-primary/40"
      : "border-border text-muted-foreground hover:border-destructive/40";

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