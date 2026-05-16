import '@/index.css';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { searchCustomersApi } from '@/services/customerService';
import { getPaymentCustomerInfo, PaymentCustomerInfoResponse } from '@/services/paymentService';

export const PaymentCustomerSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<PaymentCustomerInfoResponse | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await searchCustomersApi(searchQuery);
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error searching customers:", err);
      }
    }, 400);

    return () => clearTimeout(timeout);

  }, [searchQuery]);

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

  return (
    <>
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
        <div className="bg-card rounded-2xl p-6 shadow-md animate-scale-in mt-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Customer Details
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCustomer.connectionType === 'metered'
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
                }`}
            >
              {selectedCustomer.connectionType === 'metered'
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
    </>
  );
};
