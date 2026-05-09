import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { AdminBankSlipResponse, getAllPendingSlips, getPendingSlips, getSlipById, processBankSlipReview } from "@/services/bankSlipService";

export const BankSlipReviewPage: React.FC = () => {
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const { slipId } = useParams<{ slipId: string }>();
    const numericSlipId = Number(slipId);
    const [searchParams] = useSearchParams();

    const isReviewAll = searchParams.get("mode") === "all";

    const [pendingSlips, setPendingSlips] = useState<AdminBankSlipResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slip, setSlip] = useState<AdminBankSlipResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const passedSlips = location.state?.slips;

    const [zoom, setZoom] = useState(1);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set());

    const hasPrev = isReviewAll && currentIndex > 0;
    const hasNext = isReviewAll && currentIndex < pendingSlips.length - 1;
    const allDone = isReviewAll && reviewedIds.size >= pendingSlips.length;

    const goTo = (index: number) => {
        setCurrentIndex(index);
        setZoom(1);
        setComment("");
    };
    const markReviewed = (id: number) => {
        setReviewedIds((prev) => new Set(prev).add(id));
    };

    const handleApprove = async () => {
        if (!slip) return;

        try {
            await processBankSlipReview({
                slipId: slip.slipId,
                action: "APPROVED",
            });

            markReviewed(slip.slipId);

            toast.success("Payment approved!");

            if (isReviewAll && hasNext) {
                setTimeout(() => goTo(currentIndex + 1), 400);
            } else {
                navigate("/admin/payments");
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to approve slip");
        }
    };

    const handleReject = async () => {
        if (!slip) return;

        if (!comment.trim()) {
            toast.error("Please add a rejection reason.");
            return;
        }

        try {
            await processBankSlipReview({
                slipId: slip.slipId,
                action: "REJECTED",
                rejectionReason: comment,
            });

            markReviewed(slip.slipId);

            toast.success("Slip rejected");

            setRejectOpen(false);
            setComment("");

            if (isReviewAll && hasNext) {
                setTimeout(() => goTo(currentIndex + 1), 400);
            } else {
                navigate("/admin/payments");
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to reject slip");
        }
    };

    useEffect(() => {
        if (!isReviewAll) return;

        const loadSlips = async () => {
            try {

                // coming from PaymentsPage 
                if (passedSlips && passedSlips.length > 0) {
                    setPendingSlips(passedSlips);

                    const idx = passedSlips.findIndex(
                        (s) => s.slipId === numericSlipId
                    );

                    setCurrentIndex(idx >= 0 ? idx : 0);
                    return;
                }

                //  page refresh fallback
                const data = await getAllPendingSlips();

                setPendingSlips(data);

                const idx = data.findIndex(
                    (s) => s.slipId === numericSlipId
                );

                setCurrentIndex(idx >= 0 ? idx : 0);

            } catch (err) {
                toast.error("Failed to load pending slips");
            }
        };

        loadSlips();
    }, [isReviewAll, numericSlipId]);

    useEffect(() => {
        const loadSlip = async () => {
            try {
                setLoading(true);

                let currentSlipId: number | undefined = numericSlipId;

                if (isReviewAll && pendingSlips.length > 0) {
                    currentSlipId =
                        pendingSlips[currentIndex]?.slipId;
                }

                if (!currentSlipId) return;

                const data = await getSlipById(currentSlipId);

                setSlip(data);

            } catch (err) {
                toast.error("Failed to load bank slip");
            } finally {
                setLoading(false);
            }
        };

        loadSlip();
    }, [numericSlipId, currentIndex, pendingSlips, isReviewAll]);

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading...</p>
            </div>
        );
    }

    if (!slip && !allDone) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Review Bank Slip</h1>
                    <Button onClick={() => navigate("/admin/payments")}>← Back</Button>
                </div>

                <div className="bg-card p-8 rounded-xl text-center">
                    <XCircle className="mx-auto w-10 h-10 text-red-500" />
                    <p className="mt-4">Slip not found</p>
                </div>
            </div>
        );
    }

    if (allDone) {
        return (
            <div className="space-y-6 p-6 text-center">
                <h1 className="text-2xl font-bold">All Slips Reviewed!</h1>
                <Button onClick={() => navigate("/admin/payments")}>
                    ← Back
                </Button>
            </div>
        );
    }

    const imageUrl = (slip as any).filePath || (slip as any).imageUrl;
    const isReviewed = reviewedIds.has(slip.slipId);

    return (
        <>
            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Review Bank Slip</h1>
                        <p className="text-muted-foreground">
                            Verify and approve customer bank slips
                        </p>
                    </div>

                    <Button variant="secondary" onClick={() => navigate("/admin/payments")}>
                        Back
                    </Button>
                </div>

                {/* MAIN */}
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                    {/* LEFT */}
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

                            {/* Zoom */}
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

                    {/* RIGHT */}
                    <div className="lg:w-[40%] h-[calc(100vh-260px)]">
                        <div className="bg-card p-6 rounded-xl h-full flex flex-col">

                            {/* DETAILS */}
                            <div>
                                <h3 className="font-semibold mb-4">Slip Details</h3>

                                <div className="space-y-4 text-sm">

                                    <div className="flex justify-between">
                                        <span>Customer</span>
                                        <span>{slip.accountHolderName}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Subscription</span>
                                        <span>{slip.subscriptionNumber}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Reference</span>
                                        <span>{slip.bankReference}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Amount</span>
                                        <span className="font-bold">
                                            Rs. {slip.amount.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Uploaded At</span>
                                        <span>{slip.uploadedAt}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Bank Payment Date</span>
                                        <span>{slip.bankPaymentDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="mt-8 flex gap-3">
                                <Button
                                    onClick={handleApprove}
                                    disabled={isReviewed}
                                    className="flex-1"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => setRejectOpen(true)}
                                    disabled={isReviewed}
                                    className="flex-1"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                {isReviewAll && (
                    <div className="flex justify-center items-center gap-6 pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => goTo(currentIndex - 1)}
                            disabled={!hasPrev}
                            className="hover:bg-primary/10 hover:text-primary"
                        >
                            &lt;
                        </Button>

                        <span>
                            Slip {currentIndex + 1} of {pendingSlips.length}
                        </span>

                        <Button
                            variant="ghost"
                            onClick={() => goTo(currentIndex + 1)}
                            disabled={!hasNext}
                            className="hover:bg-primary/10 hover:text-primary"
                        >
                            &gt;
                        </Button>
                    </div>
                )}
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
                            onClick={handleReject}
                        >
                            Reject & Notify
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};