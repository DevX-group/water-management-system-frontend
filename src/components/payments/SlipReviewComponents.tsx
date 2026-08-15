import '@/index.css';
import React from 'react';
import { ZoomIn, ZoomOut, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AdminBankSlipResponse } from '@/types/bankSlip';
import { formatDateTime } from '@/utils/dateUtils';
import { useTranslation } from 'react-i18next';

interface SlipImageViewerProps {
  imageUrl: string;
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;
}

export const SlipImageViewer: React.FC<SlipImageViewerProps> = ({ imageUrl, zoom, setZoom }) => {
  return (
    <div className="lg:w-[60%] bg-card rounded-xl p-4 h-[calc(100vh-260px)]">
      <div className="relative w-full rounded-xl border border-border bg-background p-3 h-full flex flex-col">
        <div className="overflow-auto flex-1">
          <div
            style={{
              width: `${zoom * 100}%`,
              transition: "width 0.2s ease",
            }}
            className="inline-block min-w-full"
          >
            <img
              src={imageUrl}
              alt="Bank slip"
              className="block w-full h-auto rounded-lg"
              onDoubleClick={() => setZoom(1)}
            />
          </div>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border rounded-full px-3 py-1.5 shadow-md z-10">
          <button
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
            className="p-1 rounded-full hover:bg-muted"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
            className="p-1 rounded-full hover:bg-muted"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SlipDetailsCardProps {
  slip: AdminBankSlipResponse;
  isReviewed: boolean;
  handleApprove: () => void;
  onRejectClick: () => void;
}

export const SlipDetailsCard: React.FC<SlipDetailsCardProps> = ({ slip, isReviewed, handleApprove, onRejectClick }) => {
  const { t, i18n } = useTranslation('payments');
  return (
    <div className="lg:w-[40%] h-[calc(100vh-260px)]">
      <div className="bg-card p-6 rounded-xl h-full flex flex-col">
        <div>
          <h3 className="font-semibold mb-4">{t('payments.slipReview.slipDetails')}</h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>{t('payments.slipReview.customer')}</span>
              <span>{slip.accountHolderName}</span>
            </div>

            <div className="flex justify-between">
              <span>{t('payments.slipReview.subscriptionNo')}</span>
              <span>{slip.subscriptionNumber}</span>
            </div>

            <div className="flex justify-between">
              <span>{t('payments.slipReview.reference')}</span>
              <span>{slip.bankReference}</span>
            </div>

            <div className="flex justify-between">
              <span>{t('payments.slipReview.amount')}</span>
              <span className="font-bold">
                {t('payments.billPayment.currency')} {slip.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{t('payments.slipReview.uploadedAt')}</span>
              <span>
                {(() => {
                  const dt = formatDateTime(slip.uploadedAt);
                  if (dt === "-") return dt;
                  const [datePart, timePart, ampmPart] = dt.split(' ');
                  const translatedAmPm = ampmPart === 'AM' ? t('payments.filters.am') : t('payments.filters.pm');
                  if (i18n.language === 'si') {
                    return `${datePart} ${translatedAmPm} ${timePart}`;
                  }
                  return `${datePart} ${timePart} ${translatedAmPm}`;
                })()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{t('payments.slipReview.bankPaymentDate')}</span>
              <span>{slip.bankPaymentDate}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            onClick={handleApprove}
            disabled={isReviewed}
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('payments.slipReview.approve')}
          </Button>

          <Button
            variant="destructive"
            onClick={onRejectClick}
            disabled={isReviewed}
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {t('payments.slipReview.reject')}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface RejectDialogProps {
  rejectOpen: boolean;
  setRejectOpen: (open: boolean) => void;
  comment: string;
  setComment: (comment: string) => void;
  handleReject: () => void;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({ rejectOpen, setRejectOpen, comment, setComment, handleReject }) => {
  const { t } = useTranslation('payments');
  return (
    <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t('payments.rejectDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('payments.rejectDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('payments.rejectDialog.rejectionReason')} <span className="text-destructive">*</span>
          </label>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('payments.rejectDialog.placeholder')}
            maxLength={250}
            className="min-h-[120px] border-border focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:border-[#0d9488] focus:outline-none"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{comment.length}/250</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={() => setRejectOpen(false)} className="bg-muted hover:bg-muted/80 text-foreground">
            {t('payments.rejectDialog.cancel')}
          </Button>

          <Button
            variant="destructive"
            onClick={handleReject}
          >
            {t('payments.rejectDialog.rejectAndNotify')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
