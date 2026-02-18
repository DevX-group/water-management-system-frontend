import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBankSlips } from "@/data/mockData";
<<<<<<< HEAD
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export const BankSlipReviewPage: React.FC = () => {
    const [comment, setComment] = useState("");
=======

export const BankSlipReviewPage: React.FC = () => {
>>>>>>> 3514924 (Add initial bank slip review page)
    const navigate = useNavigate();
    const { slipId } = useParams<{ slipId: string }>();

    const slip = useMemo(() => {
        return mockBankSlips.find((s) => s.id === slipId) || null;
    }, [slipId]);

    const [zoom, setZoom] = useState(1);
<<<<<<< HEAD
    const [rejectOpen, setRejectOpen] = useState(false);
=======

    const handleApprove = () => {
        window.alert("Slip approved (mock).");
        navigate("/admin/payments");
    };

    const handleReject = () => {
        window.alert("Slip rejected (mock).");
        navigate("/admin/payments");
    };
>>>>>>> 3514924 (Add initial bank slip review page)

    if (!slip) {
        return (
            <div className="p-6">
                <div className="bg-card rounded-2xl p-6 shadow-md">
                    <h2 className="text-lg font-semibold text-foreground">Slip not found</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        The requested bank slip does not exist in mock data.
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/admin/payments")}>
                        Back to Payments
                    </Button>
                </div>
            </div>
        );
    }

    const imageUrl = (slip as any).slipImageUrl || (slip as any).imageUrl;

    return (
<<<<<<< HEAD
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="animate-fade-in flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Review Bank Slip</h1>
                    </div>

                    <Button variant="secondary" onClick={() => navigate("/admin/payments")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>

                {/* Main layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Slip image */}
                    <div className="lg:w-[60%] bg-card rounded-2xl shadow-md overflow-hidden bg-primary/5">
                        <div className="px-4 py-1 border-b border-border flex items-center justify-end gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9"
=======
        <div className="space-y-6">
            {/* Header */}
            <div className="animate-fade-in flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Review Bank Slip</h1>
                    <p className="text-muted-foreground">
                        {slip.customerName} • {slip.subscriptionNo} • {slip.refNo}
                    </p>
                </div>

                    <Button variant="secondary" onClick={() => navigate("/admin/payments")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>

                {/* Main layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Slip image */}
                    <div className="lg:w-[60%] bg-card rounded-2xl shadow-md overflow-hidden bg-primary/5">
                        <div className="px-4 py-1 border-b border-border flex items-center justify-end gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
>>>>>>> 3514924 (Add initial bank slip review page)
                                onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
                            >
                                <ZoomOut className="w-4 h-4" />
                            </Button>
<<<<<<< HEAD

                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9"
=======
                            <Button
                                variant="secondary"
                                size="sm"
>>>>>>> 3514924 (Add initial bank slip review page)
                                onClick={() => setZoom((z) => Math.min(2, Number((z + 0.1).toFixed(2))))}
                            >
                                <ZoomIn className="w-4 h-4" />
                            </Button>
<<<<<<< HEAD

                            <span className="text-xs text-muted-foreground w-[48px] text-right">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>

                        <div className="p-3 bg-secondary/20">
                            {imageUrl ? (
                                <div className="w-full overflow-auto rounded-xl border border-border bg-background">
                                    <div className="flex justify-center p-2">
                                        <img
                                            src={imageUrl}
                                            alt="Bank slip"
                                            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
                                            className="max-w-full h-auto rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 rounded-xl bg-secondary/40 text-sm text-muted-foreground">
                                    No image URL available for this slip. Add{" "}
                                    <span className="font-medium text-foreground">slipImageUrl</span> to mock data.
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-5 border-t border-border bg-card">
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    onClick={() => {
                                        toast.success("Payment approved!", {
                                            style: {
                                                background: "#0f766e",
                                                color: "#ffffff",
                                                border: "1px solid #0d9488",
                                            },
                                        });
                                    }}
                                    className="sm:w-[220px]"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => setRejectOpen(true)}
                                    className="sm:w-[220px]"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
=======
                            <span className="text-xs text-muted-foreground w-[52px] text-right">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>

                        <div className="p-3 bg-secondary/20">
                            {imageUrl ? (
                                <div className="w-full overflow-auto rounded-xl border border-border bg-background">
                                    <div className="flex justify-center p-2">
                                        <img
                                            src={imageUrl}
                                            alt="Bank slip"
                                            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
                                            className="max-w-full h-auto rounded-lg shadow-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 rounded-xl bg-secondary/40 text-sm text-muted-foreground">
                                    No image URL available for this slip. Add{" "}
                                    <span className="font-medium text-foreground">slipImageUrl</span> to mock data.
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-5 border-t border-border bg-card">
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    onClick={() => {
                                        toast.success("Payment approved!", {
                                            style: {
                                                background: "#0f766e",
                                                color: "#ffffff",
                                                border: "1px solid #0d9488",
                                            },
                                        });
                                    }}
                                    className="sm:w-[220px]"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => setRejectOpen(true)}
                                    className="sm:w-[220px]"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Details and actions */}
                    <div className="lg:w-[40%] space-y-6">
                        {/* Slip details */}
                        <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Slip Details</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Customer</span>
                                    <span className="font-medium text-foreground text-right">{slip.customerName}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Subscription No.</span>
                                    <span className="font-medium text-foreground text-right">{slip.subscriptionNo}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Reference No.</span>
                                    <span className="font-medium text-foreground text-right">{slip.refNo}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-bold text-foreground text-right">
                                        Rs. {slip.amount.toLocaleString()}
                                    </span>
                                </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Uploaded At</span>
                                <span className="font-medium text-foreground text-right">{slip.uploadedAt}</span>
>>>>>>> 3514924 (Add initial bank slip review page)
                            </div>
                        </div>
                    </div>

<<<<<<< HEAD
                    {/* Details and actions */}
                    <div className="lg:w-[40%] space-y-6">
                        {/* Slip details */}
                        <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Slip Details</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Customer</span>
                                    <span className="font-medium text-foreground text-right">{slip.customerName}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Subscription No.</span>
                                    <span className="font-medium text-foreground text-right">{slip.subscriptionNo}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Reference No.</span>
                                    <span className="font-medium text-foreground text-right">{slip.refNo}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-bold text-foreground text-right">
                                        Rs. {slip.amount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Uploaded At</span>
                                    <span className="font-medium text-foreground text-right">{slip.uploadedAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Reject Bank Slip</DialogTitle>
                        <DialogDescription>
                            Please add a reason. This message will be shown to the customer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Rejection reason <span className="text-destructive">*</span>
                        </label>

                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Example: Slip is unclear / amount mismatch / wrong reference no..."
                            maxLength={250}
                            className="min-h-[120px] border-border focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:border-[#0d9488] focus:outline-none"
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{comment.length}/250</span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button onClick={() => setRejectOpen(false)} className="bg-muted hover:bg-muted/80 text-foreground">
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (!comment.trim()) {
                                    toast.error("Please add a rejection reason.", {
                                        style: {
                                            background: "#7f1d1d",
                                            color: "#ffffff",
                                            border: "1px solid #b91c1c",
                                        },
                                    });
                                    return;
                                }

                                toast.success("Slip rejected", {
                                    style: {
                                        background: "#7f1d1d",
                                        color: "#ffffff",
                                        border: "1px solid #b91c1c",
                                    },
                                });
                                setRejectOpen(false);
                                setComment("");
                            }}
                        >
                            Reject & Notify
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
=======
                    {/* Actions */}
                    <div className="bg-card rounded-2xl p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Action</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button onClick={handleApprove} className="w-full">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                            </Button>

                            <Button variant="destructive" onClick={handleReject} className="w-full">
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-3">
                            Later, these buttons will call backend APIs to approve/reject and update customer balance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
>>>>>>> 3514924 (Add initial bank slip review page)
    );
};
