import '@/index.css';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Slip {
  id:           string;
  customerName: string;
  subscriptionNo: string;
  refNo:        string;
  amount:       number;
  uploadedAt:   string;
  slipImageUrl?: string;
  imageUrl?:    string;
}

interface SlipImageViewerProps {
  imageUrl: string | undefined;
  zoom:     number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onApprove: () => void;
  onReject:  () => void;
}

export const SlipImageViewer: React.FC<SlipImageViewerProps> = ({
  imageUrl, zoom, onZoomIn, onZoomOut, onApprove, onReject,
}) => (
  <div className="lg:w-[60%] bg-card rounded-2xl shadow-md overflow-hidden bg-primary/5">
    <div className="px-4 py-1 border-b border-border flex items-center justify-end gap-2">
      <Button variant="secondary" size="icon" className="h-9 w-9" onClick={onZoomOut}>
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button variant="secondary" size="icon" className="h-9 w-9" onClick={onZoomIn}>
        <ZoomIn className="w-4 h-4" />
      </Button>
      <span className="text-xs text-muted-foreground w-[48px] text-right">{Math.round(zoom * 100)}%</span>
    </div>

    <div className="p-3 bg-secondary/20">
      {imageUrl ? (
        <div className="w-full overflow-auto rounded-xl border border-border bg-background">
          <div className="flex justify-center p-2">
            <img src={imageUrl} alt="Bank slip"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              className="max-w-full h-auto rounded-lg shadow-sm" />
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-secondary/40 text-sm text-muted-foreground">
          No image URL available for this slip.
        </div>
      )}
    </div>

    <div className="p-5 border-t border-border bg-card">
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onApprove} className="sm:w-[220px]">
          <CheckCircle className="w-4 h-4 mr-2" /> Approve
        </Button>
        <Button variant="destructive" onClick={onReject} className="sm:w-[220px]">
          <XCircle className="w-4 h-4 mr-2" /> Reject
        </Button>
      </div>
    </div>
  </div>
);

interface SlipDetailsCardProps {
  slip: Slip;
}

export const SlipDetailsCard: React.FC<SlipDetailsCardProps> = ({ slip }) => (
  <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
    <h3 className="text-lg font-semibold text-foreground mb-4">Slip Details</h3>
    <div className="space-y-3 text-sm">
      {[
        { label: 'Customer',       value: slip.customerName },
        { label: 'Subscription No.', value: slip.subscriptionNo },
        { label: 'Reference No.',  value: slip.refNo },
        { label: 'Amount',         value: `Rs. ${slip.amount.toLocaleString()}`, bold: true },
        { label: 'Uploaded At',    value: slip.uploadedAt },
      ].map(({ label, value, bold }) => (
        <div key={label} className="flex justify-between gap-4">
          <span className="text-muted-foreground">{label}</span>
          <span className={`${bold ? 'font-bold' : 'font-medium'} text-foreground text-right`}>{value}</span>
        </div>
      ))}
    </div>
  </div>
);

interface RejectDialogProps {
  open:     boolean;
  comment:  string;
  onCommentChange: (v: string) => void;
  onCancel: () => void;
  onReject: () => void;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
  open, comment, onCommentChange, onCancel, onReject,
}) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Reject Bank Slip</DialogTitle>
        <DialogDescription>Please add a reason. This message will be shown to the customer.</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Rejection reason <span className="text-destructive">*</span>
        </label>
        <Textarea value={comment} onChange={e => onCommentChange(e.target.value)}
          placeholder="Example: Slip is unclear / amount mismatch / wrong reference no..."
          maxLength={250} className="min-h-[120px]" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{comment.length}/250</span>
        </div>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button onClick={onCancel} className="bg-muted hover:bg-muted/80 text-foreground">Cancel</Button>
        <Button variant="destructive" onClick={onReject}>Reject & Notify</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
