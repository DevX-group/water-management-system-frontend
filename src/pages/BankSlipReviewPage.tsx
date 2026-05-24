import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { getAllPendingSlips, getSlipById, processBankSlipReview } from "@/services/bankSlipService";
import type { AdminBankSlipResponse } from "@/types/bankSlip";

import { SlipImageViewer, SlipDetailsCard, RejectDialog } from "@/components/payments/SlipReviewComponents";

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
                    Back
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
                    <SlipImageViewer
                        imageUrl={imageUrl}
                        zoom={zoom}
                        setZoom={setZoom}
                    />

                    <SlipDetailsCard
                        slip={slip}
                        isReviewed={isReviewed}
                        handleApprove={handleApprove}
                        onRejectClick={() => setRejectOpen(true)}
                    />
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

            <RejectDialog
                rejectOpen={rejectOpen}
                setRejectOpen={setRejectOpen}
                comment={comment}
                setComment={setComment}
                handleReject={handleReject}
            />
        </>
    );
};