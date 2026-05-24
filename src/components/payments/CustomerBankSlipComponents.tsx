import React, { ChangeEvent, DragEvent, RefObject } from "react";
import { Landmark, AlertTriangle, CheckCircle2, X, Upload, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerBankSlipResponse } from "@/types/bankSlip";

export interface BankSlipForm {
  amount: string;
  date: string;
  reference: string;
  file: File | null;
}

interface CustomerBankSlipSectionProps {
  slipSectionRef: RefObject<HTMLDivElement>;
  bankDetails: any;
  slipForm: BankSlipForm;
  setSlipForm: React.Dispatch<React.SetStateAction<BankSlipForm>>;
  dragging: boolean;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  submitSuccess: boolean;
  uploading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFile: (file: File) => void;
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: DragEvent<HTMLButtonElement>) => void;
  removeFile: () => void;
  handleSlipSubmit: () => void;
}

export const CustomerBankSlipSection: React.FC<CustomerBankSlipSectionProps> = ({
  slipSectionRef, bankDetails, slipForm, setSlipForm, dragging, setDragging, submitSuccess,
  uploading, fileInputRef, handleFileInput, handleDrop, removeFile, handleSlipSubmit
}) => {
  return (
    <Card ref={slipSectionRef} className="shadow-card border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-success" />
          Bank Slip Upload
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Already paid at a bank branch? Upload your bank slip and we'll verify your account within 24 hours.
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
                  <span className="font-semibold font-mono text-xs">{bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-semibold text-xs">{bankDetails.accountName}</span>
                </div>
              </>
            )}
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-700 leading-relaxed">
                <strong>Important:</strong> Use your Subscription Number as the deposit remark to ensure correct allocation.
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
                  <span className="font-medium text-success flex-1 truncate">{slipForm.file.name}</span>
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
  );
};

export const getStatusClass = (status: string) => {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "REJECTED") return "bg-red-100 text-red-600";
  return "bg-yellow-100 text-yellow-700";
};

interface CustomerBankSlipHistoryProps {
  slipPageSize: number;
  setSlipPageSize: (v: number) => void;
  setSlipPage: React.Dispatch<React.SetStateAction<number>>;
  slipsLoading: boolean;
  bankSlips: CustomerBankSlipResponse[];
  setSelectedSlip: (slip: CustomerBankSlipResponse) => void;
  slipTotalPages: number;
  slipStart: number;
  slipEnd: number;
  slipTotalItems: number;
  slipPage: number;
}

export const CustomerBankSlipHistory: React.FC<CustomerBankSlipHistoryProps> = ({
  slipPageSize, setSlipPageSize, setSlipPage, slipsLoading, bankSlips, setSelectedSlip,
  slipTotalPages, slipStart, slipEnd, slipTotalItems, slipPage
}) => {
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
                  <Badge className={getStatusClass(slip.status)}>
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

  return (
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
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-muted-foreground">Items per page</span>
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
          <div className="text-sm text-muted-foreground">Loading slips...</div>
        ) : (
          renderBankSlipContent()
        )}
        {slipTotalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              {slipStart}-{slipEnd} of {slipTotalItems} items
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSlipPage(0)} disabled={slipPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;&lt;</button>
              <button onClick={() => setSlipPage((p) => Math.max(p - 1, 0))} disabled={slipPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;</button>
              <div className="text-sm px-3">Page {slipPage + 1} of {slipTotalPages}</div>
              <button onClick={() => setSlipPage((p) => Math.min(p + 1, slipTotalPages - 1))} disabled={slipPage === slipTotalPages - 1} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&gt;</button>
              <button onClick={() => setSlipPage(slipTotalPages - 1)} disabled={slipPage === slipTotalPages - 1} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&gt;&gt;</button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CustomerBankSlipModalProps {
  selectedSlip: CustomerBankSlipResponse | null;
  setSelectedSlip: (slip: CustomerBankSlipResponse | null) => void;
  statusClass: string;
  handleDeleteSlip: (slipId: number) => void;
}

export const CustomerBankSlipModal: React.FC<CustomerBankSlipModalProps> = ({
  selectedSlip, setSelectedSlip, statusClass, handleDeleteSlip
}) => {
  if (!selectedSlip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[90%] max-w-6xl max-h-[98vh] h-auto relative overflow-hidden shadow-2xl">
        <button
          onClick={() => setSelectedSlip(null)}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* LEFT: SLIP IMAGE */}
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
          {/* RIGHT: DETAILS */}
          <div className="p-6 flex flex-col justify-between overflow-auto">
            <div>
              <h2 className="text-xl font-semibold mb-4">Bank Slip Details</h2>
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Amount</p>
                    <p className="font-semibold text-base">Rs. {selectedSlip.amount?.toLocaleString()}</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Uploaded At</p>
                    <p className="font-medium">{selectedSlip.uploadedAt?.split("T")[0] || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Bank Payment Date</p>
                    <p className="font-medium">{selectedSlip.bankPaymentDate?.split("T")[0] || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Reviewed At</p>
                    <p className="font-medium">{selectedSlip.reviewedAt?.split("T")[0] || "Not reviewed yet"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Reference</p>
                  <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{selectedSlip.bankReference}</p>
                </div>
              </div>
              {selectedSlip.status === "REJECTED" && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{(selectedSlip as any).rejectionReason || "Not specified"}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <a href={selectedSlip.filePath} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                View / Download Slip
              </a>
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
  );
};
