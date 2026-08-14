import '@/index.css';
import React, { ChangeEvent, DragEvent, RefObject } from "react";
import { Landmark, AlertTriangle, CheckCircle2, X, Upload, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerBankSlipResponse } from "@/types/bankSlip";
import { BankDetailsResponse, SlipStatus } from "@/types/payment";
import { useTranslation } from 'react-i18next';

export interface BankSlipForm {
  amount: string;
  date: string;
  reference: string;
  file: File | null;
}

interface CustomerBankSlipSectionProps {
  slipSectionRef: RefObject<HTMLDivElement>;
  bankDetails: BankDetailsResponse;
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
  const { t } = useTranslation('payments');
  return (
    <Card ref={slipSectionRef} className="shadow-card border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-success" />
          {t('payments.bankSlipUpload.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('payments.bankSlipUpload.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bank Details */}
          <div className="rounded-lg bg-secondary/40 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {t('payments.bankSlipUpload.paymentDetails')}
            </h3>
            {bankDetails && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payments.bankSlipUpload.bank')}</span>
                  <span className="font-semibold text-xs">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payments.bankSlipUpload.branch')}</span>
                  <span className="font-semibold text-xs">{bankDetails.branch}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payments.bankSlipUpload.accountNo')}</span>
                  <span className="font-semibold font-mono text-xs">{bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('payments.bankSlipUpload.accountName')}</span>
                  <span className="font-semibold text-xs">{bankDetails.accountName}</span>
                </div>
              </>
            )}
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-700 leading-relaxed">
                <strong>{t('payments.bankSlipUpload.important')}</strong> {t('payments.bankSlipUpload.depositRemark')}
              </span>
            </div>
          </div>

          {/* Upload Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('payments.bankSlipUpload.uploadYourSlip')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="slipAmount">{t('payments.bankSlipUpload.amountPaid')}</Label>
                <Input
                  id="slipAmount"
                  type="number"
                  min={0}
                  step={1}
                  placeholder={t('payments.bankSlipUpload.amountPlaceholder')}
                  value={slipForm.amount}
                  onChange={(e) => setSlipForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slipDate">{t('payments.bankSlipUpload.bankPaymentDate')}</Label>
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
              <Label htmlFor="slipRef">{t('payments.bankSlipUpload.bankReference')}</Label>
              <Input
                id="slipRef"
                type="text"
                placeholder={t('payments.bankSlipUpload.referencePlaceholder')}
                value={slipForm.reference}
                onChange={(e) => setSlipForm((p) => ({ ...p, reference: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('payments.bankSlipUpload.uploadBankSlip')}</Label>
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
                    <span className="font-semibold text-success">{t('payments.bankSlipUpload.clickToUpload')}</span> {t('payments.bankSlipUpload.orDragAndDrop')}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('payments.bankSlipUpload.fileTypes')}</p>
                </button>
              )}
            </div>
            <Button className="w-full gradient-primary" onClick={handleSlipSubmit} disabled={uploading}>
              <Receipt className="w-4 h-4 mr-2" />
              {uploading ? t('payments.bankSlipUpload.uploading') : t('payments.bankSlipUpload.submitBankSlip')}
            </Button>
            {submitSuccess && (
              <p className="text-sm text-success flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {t('payments.bankSlipUpload.slipSubmitted')}
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
  // Filter props
  filterYear: number | undefined;
  setFilterYear: (v: number | undefined) => void;
  filterStatus: SlipStatus | undefined;
  setFilterStatus: (v: SlipStatus | undefined) => void;
  onFilterChange: () => void;
}

const slipCurrentYear = new Date().getFullYear();
const slipYearOptions = Array.from({ length: 6 }, (_, i) => slipCurrentYear - i);

export const CustomerBankSlipHistory: React.FC<CustomerBankSlipHistoryProps> = ({
  slipPageSize, setSlipPageSize, setSlipPage, slipsLoading, bankSlips, setSelectedSlip,
  slipTotalPages, slipStart, slipEnd, slipTotalItems, slipPage,
  filterYear, setFilterYear, filterStatus, setFilterStatus, onFilterChange
}) => {
  const { t } = useTranslation('payments');
  const hasActiveFilter = filterYear !== undefined || filterStatus !== undefined;

  const handleYearChange = (val: string) => {
    setFilterYear(val === 'all' ? undefined : Number(val));
    onFilterChange();
  };

  const handleStatusChange = (val: string) => {
    setFilterStatus(val === 'all' ? undefined : (val as SlipStatus));
    onFilterChange();
  };

  const clearFilters = () => {
    setFilterYear(undefined);
    setFilterStatus(undefined);
    onFilterChange();
  };

  const renderBankSlipContent = () => {
    if (bankSlips.length === 0) {
      return (
        <div className="text-sm text-muted-foreground text-center py-6">
          {t('payments.bankSlipHistory.noSlipsFound')}
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-3 text-sm">{t('payments.bankSlipHistory.uploadedAt')}</th>
              <th className="text-left p-3 text-sm">{t('payments.bankSlipHistory.amount')}</th>
              <th className="text-left p-3 text-sm">{t('payments.bankSlipHistory.reference')}</th>
              <th className="text-left p-3 text-sm">{t('payments.bankSlipHistory.status')}</th>
              <th className="text-left p-3 text-sm">{t('payments.bankSlipHistory.slip')}</th>
            </tr>
          </thead>
          <tbody>
            {bankSlips.map((slip) => (
              <tr key={slip.slipId} className="border-t border-border">
                <td className="p-3 text-sm">
                  {slip.uploadedAt?.split("T")[0]}
                </td>
                <td className="p-3 text-sm font-mono">
                  {t("payments.billPayment.currency")} {slip.amount?.toLocaleString()}
                </td>
                <td className="p-3 text-sm">
                  {slip.bankReference}
                </td>
                <td className="p-3">
                  <Badge className={getStatusClass(slip.status)}>
                    {slip.status === "PENDING" ? t('payments.filters.pending') :
                      slip.status === "APPROVED" ? t('payments.filters.approved') :
                        slip.status === "REJECTED" ? t('payments.filters.rejected') : slip.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm">
                  <button
                    onClick={() => setSelectedSlip(slip)}
                    className="text-primary underline text-xs hover:text-primary/80"
                  >
                    {t('payments.bankSlipHistory.view')}
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
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {t('payments.bankSlipHistory.title')}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t('payments.bankSlipHistory.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Year filter */}
          <Select
            value={filterYear !== undefined ? String(filterYear) : 'all'}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-9 w-[110px] rounded-lg bg-secondary/40 text-xs font-medium">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('payments.filters.allYears')}</SelectItem>
              {slipYearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={filterStatus ?? 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="h-9 w-[120px] rounded-lg bg-secondary/40 text-xs font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('payments.filters.allStatuses')}</SelectItem>
              <SelectItem value="PENDING">{t('payments.filters.pending')}</SelectItem>
              <SelectItem value="APPROVED">{t('payments.filters.approved')}</SelectItem>
              <SelectItem value="REJECTED">{t('payments.filters.rejected')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 h-9 px-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border/50"
            >
              <X className="w-3 h-3" />
              {t('payments.filters.clear')}
            </button>
          )}

          {/* Page size */}
          <span className="text-sm text-muted-foreground">{t('payments.paymentHistory.itemsPerPage')}</span>
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
          <div className="text-sm text-muted-foreground">{t('payments.bankSlipHistory.loadingSlips')}</div>
        ) : (
          renderBankSlipContent()
        )}
        {slipTotalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              {slipStart}-{slipEnd} {t('payments.paymentHistory.of')} {slipTotalItems} {t('payments.paymentHistory.items')}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSlipPage(0)} disabled={slipPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;&lt;</button>
              <button onClick={() => setSlipPage((p) => Math.max(p - 1, 0))} disabled={slipPage === 0} className="px-2 py-1 border rounded text-xs disabled:opacity-40">&lt;</button>
              <div className="text-sm px-3">{t('payments.paymentHistory.page')} {slipPage + 1} {t('payments.paymentHistory.of')} {slipTotalPages}</div>
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
  const { t } = useTranslation('payments');
  if (!selectedSlip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card rounded-2xl w-[90%] max-w-6xl max-h-[98vh] h-auto relative overflow-hidden shadow-2xl">
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
                title={t('payments.bankSlipModal.bankSlipPdf')}
              />
            ) : (
              <img
                src={selectedSlip.filePath}
                alt={t('payments.bankSlipModal.bankSlipImage')}
                className="max-h-full max-w-full object-contain rounded-lg shadow hover:scale-[1.02] transition"
              />
            )}
          </div>
          {/* RIGHT: DETAILS */}
          <div className="p-6 flex flex-col justify-between overflow-auto">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('payments.bankSlipModal.title')}</h2>
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{t('payments.bankSlipModal.amount')}</p>
                    <p className="font-semibold text-base">{t("payments.billPayment.currency")} {selectedSlip.amount?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{t('payments.bankSlipModal.status')}</p>
                    <p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                        {selectedSlip.status === "PENDING" ? t('payments.filters.pending') :
                          selectedSlip.status === "APPROVED" ? t('payments.filters.approved') :
                            selectedSlip.status === "REJECTED" ? t('payments.filters.rejected') : selectedSlip.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{t('payments.bankSlipModal.uploadedAt')}</p>
                    <p className="font-medium">{selectedSlip.uploadedAt?.split("T")[0] || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{t('payments.bankSlipModal.bankPaymentDate')}</p>
                    <p className="font-medium">{selectedSlip.bankPaymentDate?.split("T")[0] || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{t('payments.bankSlipModal.reviewedAt')}</p>
                    <p className="font-medium">{selectedSlip.reviewedAt?.split("T")[0] || t('payments.bankSlipModal.notReviewedYet')}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">{t('payments.bankSlipModal.reference')}</p>
                  <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{selectedSlip.bankReference}</p>
                </div>
              </div>
              {selectedSlip.status === "REJECTED" && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs text-red-600 font-medium mb-1">{t('payments.bankSlipModal.rejectionReason')}</p>
                  <p className="text-sm text-red-700">{(selectedSlip as any).rejectionReason || t('payments.bankSlipModal.notSpecified')}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <a href={selectedSlip.filePath} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                {t('payments.bankSlipModal.viewDownloadSlip')}
              </a>
              {selectedSlip.status === "PENDING" && (
                <button
                  onClick={() => handleDeleteSlip(selectedSlip.slipId)}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                >
                  {t('payments.bankSlipModal.delete')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
