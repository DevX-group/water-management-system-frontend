import React from "react";
import { CreditCard, Clock, CheckCircle2, AlertTriangle, Wallet, Receipt, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrentBillResponse, OutstandingBillResponse } from "@/services/paymentService";

export type PaymentMethod = "online" | "slip";

interface MethodTabsProps {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}

export const MethodTabs = ({ value, onChange }: MethodTabsProps) => {
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

interface CustomerPaymentCardProps {
  paymentCardRef: React.RefObject<HTMLDivElement>;
  totalDue: number;
  hasOutstanding: boolean;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  paymentAmount: string;
  setPaymentAmount: (a: string) => void;
  handlePay: () => void;
  currentBill: CurrentBillResponse | null;
  monthlyDue: number;
  outstandingDue: number;
  outstandingExpanded: boolean;
  setOutstandingExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  totalOutstandingBills: number;
  isSingle: boolean;
  currentBills: OutstandingBillResponse[];
  totalPages: number;
  outstandingPage: number;
  setOutstandingPage: React.Dispatch<React.SetStateAction<number>>;
}

export const CustomerPaymentCard: React.FC<CustomerPaymentCardProps> = ({
  paymentCardRef,
  totalDue,
  hasOutstanding,
  paymentMethod,
  setPaymentMethod,
  paymentAmount,
  setPaymentAmount,
  handlePay,
  currentBill,
  monthlyDue,
  outstandingDue,
  outstandingExpanded,
  setOutstandingExpanded,
  totalOutstandingBills,
  isSingle,
  currentBills,
  totalPages,
  outstandingPage,
  setOutstandingPage,
}) => {
  return (
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
  );
};
