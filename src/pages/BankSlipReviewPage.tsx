import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBankSlips } from "@/data/mockData";

export const BankSlipReviewPage: React.FC = () => {
    const navigate = useNavigate();
    const { slipId } = useParams<{ slipId: string }>();

    const slip = useMemo(() => {
        return mockBankSlips.find((s) => s.id === slipId) || null;
    }, [slipId]);

    const [zoom, setZoom] = useState(1);

    const handleApprove = () => {
        window.alert("Slip approved (mock).");
        navigate("/admin/payments");
    };

    const handleReject = () => {
        window.alert("Slip rejected (mock).");
        navigate("/admin/payments");
    };

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
                <div className="lg:w-[60%] bg-card rounded-2xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Slip Image</h3>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
                            >
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setZoom((z) => Math.min(2, Number((z + 0.1).toFixed(2))))}
                            >
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground w-[52px] text-right">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-secondary/20">
                        {imageUrl ? (
                            <div className="w-full overflow-auto rounded-xl border border-border bg-background">
                                <div className="flex justify-center p-4">
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
                                No image URL available for this slip. Add <span className="font-medium text-foreground">slipImageUrl</span>{" "}
                                to mock data.
                            </div>
                        )}
                    </div>
                </div>

                {/* Details and actions */}
                <div className="lg:w-[40%] space-y-6">
                    {/* Slip details */}
                    <div className="bg-card rounded-2xl p-6 shadow-md">
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
    );
};
