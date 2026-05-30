import '@/index.css';
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CustomerSearchCardProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredCustomers: any[];
  onCustomerSelect: (customer: any) => void;
}

export const CustomerSearchCard: React.FC<CustomerSearchCardProps> = ({
  searchQuery, setSearchQuery, filteredCustomers, onCustomerSelect,
}) => (
  <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
    <h3 className="text-lg font-semibold text-foreground mb-4">Find Customer</h3>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input placeholder="Enter Name / Subscription Number" value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
    </div>
    {searchQuery && filteredCustomers.length > 0 && (
      <div className="mt-2 border border-border rounded-lg overflow-hidden">
        {filteredCustomers.slice(0, 5).map((customer) => (
          <button key={customer.id} onClick={() => onCustomerSelect(customer)}
            className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-0">
            <p className="font-medium text-foreground">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.subscriptionNo} • {customer.region}</p>
          </button>
        ))}
      </div>
    )}
  </div>
);

interface CustomerDetailsCardProps {
  selectedCustomer: any;
  onNavigate: () => void;
}

export const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({ selectedCustomer, onNavigate }) => {
  if (!selectedCustomer) return null;
  const isMetered = selectedCustomer.customerType === 'with_meter';
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md animate-scale-in">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isMetered ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          {isMetered ? 'With Meter' : 'No Meter'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[{ label: 'Name', value: selectedCustomer.name }, { label: 'Subscription No.', value: selectedCustomer.subscriptionNo },
        { label: 'NIC', value: selectedCustomer.nic }, { label: 'Region', value: selectedCustomer.region }].map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <button className="w-full bg-primary text-primary-foreground h-10 rounded-md font-medium" onClick={onNavigate}>
        Add Payment
      </button>
    </div>
  );
};
