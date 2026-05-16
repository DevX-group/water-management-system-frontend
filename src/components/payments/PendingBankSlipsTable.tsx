import '@/index.css';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { AdminBankSlipResponse, getAllPendingSlips, getPendingSlips } from '@/services/bankSlipService';
import { connectAdminSlipSocket, disconnectAdminSlipSocket } from '@/services/websocketService';
import { formatDateTime } from "@/util/dateUtils";

export const PendingBankSlipsTable = () => {
  const navigate = useNavigate();
  const [slipPage, setSlipPage] = useState(0);
  const [slipSearch, setSlipSearch] = useState('');
  const [slipData, setSlipData] = useState<AdminBankSlipResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingSlips, setLoadingSlips] = useState(false);
  const [showSlipSearch, setShowSlipSearch] = useState(false);

  const handleReviewAll = async () => {
    try {
      const data = await getAllPendingSlips();

      if (!data || data.length === 0) {
        toast.info("No pending slips to review.");
        return;
      }

      // navigate with first slip + pass data (state)
      navigate(`/admin/payments/slip/${data[0].slipId}?mode=all`, {
        state: { slips: data }
      });

    } catch (err) {
      console.error("Failed to load slips for review:", err);
      toast.error("Failed to load slips for review");
    }
  };

  useEffect(() => {
    const loadPendingSlips = async () => {
      setLoadingSlips(true);
      try {
        const data = await getPendingSlips(slipPage, 10, slipSearch);

        setSlipData(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 0);

      } catch (err) {
        console.error("Failed to load pending slips:", err);
        toast.error("Failed to load pending slips");
      } finally {
        setLoadingSlips(false);
      }
    };

    loadPendingSlips();
  }, [slipPage, slipSearch]);

  const handleNewSlip = (newSlip: AdminBankSlipResponse) => {
    setSlipData((prev) => {
      const exists = prev.some(s => s.slipId === newSlip.slipId);
      if (exists) return prev;
      return [newSlip, ...prev].slice(0, 10);
    });
  };

  useEffect(() => {
    connectAdminSlipSocket(handleNewSlip);

    return () => {
      disconnectAdminSlipSocket();
    };
  }, []);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Pending Bank Slips
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Review uploaded customer bank slips
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Expandable Search */}
          <div
            className={`
              flex items-center h-11 rounded-xl border border-border bg-background
              overflow-hidden transition-all duration-300 shadow-sm
              ${showSlipSearch ? "w-72 px-3" : "w-11 justify-center"}
            `}
          >
            <Search
              className="w-4 h-4 text-muted-foreground cursor-pointer shrink-0"
              onClick={() => setShowSlipSearch(true)}
            />

            {showSlipSearch && (
              <input
                autoFocus
                type="text"
                value={slipSearch}
                onChange={(e) => {
                  setSlipSearch(e.target.value);
                  setSlipPage(0);
                }}
                onBlur={() => {
                  if (!slipSearch.trim()) {
                    setShowSlipSearch(false);
                  }
                }}
                placeholder="Enter Name / Subscription Number"
                className="ml-3 w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            )}
          </div>

          {/* Review All Button */}
          <Button
            variant="outline"
            onClick={handleReviewAll}
            className="rounded-xl h-11 px-4 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Review All
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3 bg-secondary/50 text-xs font-semibold text-muted-foreground">
          <div className="col-span-4">Customer</div>
          <div className="col-span-3">Ref No</div>
          <div className="col-span-2 text-left">Amount</div>
          <div className="col-span-3 text-center">Action</div>
        </div>

        {/* Table Body */}
        <div>
          {loadingSlips && (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              Loading pending slips...
            </div>
          )}

          {!loadingSlips && slipData.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              No pending slips found
            </div>
          )}

          {!loadingSlips &&
            slipData.length > 0 &&
            slipData.map((slip) => (
              <div
                key={slip.slipId}
                className="grid grid-cols-12 px-6 py-4 border-t border-border hover:bg-secondary/30 transition-colors text-sm items-center"
              >
                {/* Customer */}
                <div className="col-span-4">
                  <p className="font-medium text-foreground">
                    {slip.accountHolderName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {slip.subscriptionNumber}
                  </p>

                  <p className="text-[11px] text-muted-foreground mt-1">
                    {formatDateTime(slip.uploadedAt)}
                  </p>
                </div>

                {/* Ref No */}
                <div className="col-span-3 text-muted-foreground">
                  {slip.bankReference}
                </div>

                {/* Amount */}
                <div className="col-span-2 text-left font-semibold text-foreground pr-4">
                  Rs. {slip.amount.toLocaleString()}
                </div>

                {/* Action */}
                <div className="col-span-3 flex justify-center">
                  <Button
                    size="sm"
                    className="px-5 rounded-xl"
                    onClick={() =>
                      navigate(`/admin/payments/slip/${slip.slipId}`)
                    }
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-5">
          <button
            onClick={() => setSlipPage((p) => p - 1)}
            disabled={slipPage === 0}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center
    text-muted-foreground hover:text-foreground hover:bg-secondary
    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            &lt;
          </button>

          <span className="text-sm font-medium text-foreground">
            Page {slipPage + 1} of {totalPages}
          </span>

          <button
            onClick={() => setSlipPage((p) => p + 1)}
            disabled={slipPage + 1 >= totalPages}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center
    text-muted-foreground hover:text-foreground hover:bg-secondary
    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};
