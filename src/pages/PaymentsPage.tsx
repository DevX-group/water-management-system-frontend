import { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { searchCustomersApi } from '@/services/customerService';
import { getPaymentCustomerInfo, getRecentPayments, RecentPaymentResponse } from '@/services/paymentService';
import { toast } from '@/components/ui/sonner';
import { AdminBankSlipResponse, getAllPendingSlips, getPendingSlips } from '@/services/bankSlipService';
import { connectAdminSlipSocket, disconnectAdminSlipSocket } from '@/services/websocketService';
import { formatDateTime } from "@/util/dateUtils";

console.log({ Search, AlertCircle, CheckCircle, Clock });
console.log({ Button, Input, toast });

export const PaymentsPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPaymentResponse[]>([]);
  const [pendingSlips, setPendingSlips] = useState<AdminBankSlipResponse[]>([]);

  const [slipPage, setSlipPage] = useState(0);
  const [slipSearch, setSlipSearch] = useState('');
  const [slipData, setSlipData] = useState<AdminBankSlipResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingSlips, setLoadingSlips] = useState(false);

  const [showSlipSearch, setShowSlipSearch] = useState(false);

  const statusStyles = {
    full: 'bg-success/10 text-success',
    partial: 'bg-warning/10 text-warning',
  } as const;

  const statusIcons = {
    full: CheckCircle,
    partial: Clock,
  } as const;

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
      toast.error("Failed to load slips for review");
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchCustomers = async () => {
      try {
        const data = await searchCustomersApi(searchQuery);
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error searching customers:", err);
      }
    }

    fetchCustomers();
  }, [searchQuery]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const data = await getRecentPayments(5);
        console.log("API RESPONSE:", data);
        setRecentPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load recent payments");
      }
    }

    loadRecent();
  }, []);

  useEffect(() => {
    const loadPendingSlips = async () => {
      setLoadingSlips(true);
      try {
        const data = await getPendingSlips(slipPage, 10, slipSearch);

        setSlipData(data.content);
        setTotalPages(data.totalPages);

      } catch (err) {
        toast.error("Failed to load pending slips");
      } finally {
        setLoadingSlips(false);
      }
    };

    loadPendingSlips();
  }, [slipPage, slipSearch]);

  useEffect(() => {
    const handleNewSlip = (newSlip: AdminBankSlipResponse) => {
      setPendingSlips((prev) => {
        const exists = prev.some(s => s.slipId === newSlip.slipId);
        if (exists) return prev;
        return [newSlip, ...prev];
      });
    };

    connectAdminSlipSocket(handleNewSlip);

    return () => {
      disconnectAdminSlipSocket();
    };
  }, []);

  const handleCustomerSelect = async (customer: any) => {
    try {
      const fullCustomer = await getPaymentCustomerInfo(customer.subscriptionNumber);
      setSelectedCustomer(fullCustomer);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error("Error fetching customer details:", err);
    }
  }

  const formatPaymentMethod = (method: string) => {
    return method
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Manage customer payments and collections</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search bar and Recently Added section */}
        <div className="lg:w-[40%] space-y-6">
          {/* Search */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Find Customer</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter Name / Subscription Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && searchResults.length > 0 && (
              <div className="mt-2 border border-border rounded-lg overflow-hidden">
                {Array.isArray(searchResults) && searchResults.slice(0, 5).map((customer) => (
                  <button
                    key={customer.subscriptionNumber}
                    onClick={() => handleCustomerSelect(customer)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-0"
                  >
                    <p className="font-medium text-foreground">{customer.accountHolderName}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.subscriptionNumber}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                No customers found
              </p>
            )}
          </div>

          {/* Customer Details*/}
          {selectedCustomer && (
            <div className="bg-card rounded-2xl p-6 shadow-md animate-scale-in">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Customer Details
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCustomer.customerType === 'with_meter'
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                    }`}
                >
                  {selectedCustomer.customerType === 'with_meter'
                    ? 'With Meter'
                    : 'No Meter'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.accountHolderName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Subscription No.
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.subscriptionNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">NIC</p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.nic}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="font-medium text-foreground">
                    {selectedCustomer.region}
                  </p>
                </div>

              </div>

              {/* Navigate to full payment page */}
              <Button className="w-full" onClick={() => navigate(`/admin/payments/customer/${selectedCustomer.subscriptionNumber}`)}>
                Add Payment
              </Button>
            </div>
          )}


          {/* Recently Added */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up bg-primary/5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recently Added</h3>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent payments.
              </p>
            ) : (
              <div className="space-y-3">
                {Array.isArray(recentPayments) && recentPayments.map((payment) => {
                  const statusKey = payment.status.toLowerCase();
                  const StatusIcon = statusIcons[statusKey] || Clock;
                  const statusClass = statusStyles[statusKey] || 'bg-muted text-muted-foreground';
                  const formattedStatus = statusKey.charAt(0).toUpperCase() + statusKey.slice(1);

                  return (
                    <div
                      key={payment.paymentId}
                      className="p-3 rounded-xl bg-primary/5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-foreground text-sm">{payment.accountHolderName}</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {formattedStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{payment.subscriptionNumber}</span>
                        <span className="font-medium text-foreground">
                          Rs. {payment.amountPaid.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(payment.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>)}
          </div>
        </div>

        {/* Pending Bank Slip Table */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up lg:w-[60%]">

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
              <div className="col-span-2 text-center">Amount</div>
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
                    <div className="col-span-2 text-right font-semibold text-foreground pr-4">
                      Rs. {slip.amount.toLocaleString()}
                    </div>

                    {/* Action */}
                    <div className="col-span-3 flex justify-center">
                      <Button
                        size="sm"
                        className="px-5 rounded-lg"
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

      </div>
    </div>
  );
};
