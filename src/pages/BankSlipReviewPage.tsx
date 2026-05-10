import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockBankSlips } from "@/data/mockData";
import { toast } from "@/components/ui/sonner";
import { SlipImageViewer, SlipDetailsCard, RejectDialog } from "@/components/payments/SlipReviewComponents";

export const BankSlipReviewPage: React.FC = () => {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { slipId } = useParams<{ slipId: string }>();

  const slip = useMemo(() => mockBankSlips.find((s) => s.id === slipId) || null, [slipId]);
  const [zoom, setZoom] = useState(1);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!slip) {
    return (
      <div className="p-6">
        <div className="bg-card rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">Slip not found</h2>
          <p className="text-sm text-muted-foreground mt-2">The requested bank slip does not exist in mock data.</p>
          <Button className="mt-4" onClick={() => navigate("/admin/payments")}>Back to Payments</Button>
        </div>
      </div>
    );
  }

  const imageUrl = (slip as any).slipImageUrl || (slip as any).imageUrl;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Review Bank Slip</h1>
        <Button variant="secondary" onClick={() => navigate("/admin/payments")}>Back</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SlipImageViewer
          imageUrl={imageUrl} zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(2, Number((z + 0.1).toFixed(2))))}
          onZoomOut={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
          onApprove={() => toast.success("Payment approved!", { className: "toast-success" })}
          onReject={() => setRejectOpen(true)}
        />
        <div className="lg:w-[40%] space-y-6">
          <SlipDetailsCard slip={slip as any} />
        </div>
      </div>

      <RejectDialog
        open={rejectOpen} comment={comment}
        onCommentChange={setComment} onCancel={() => setRejectOpen(false)}
        onReject={() => {
          if (!comment.trim()) { toast.error("Please add a rejection reason.", { className: "toast-error" }); return; }
          toast.success("Slip rejected", { className: "toast-error" });
          setRejectOpen(false); setComment("");
        }}
      />
    </div>
  );
};
