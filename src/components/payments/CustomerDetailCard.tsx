import '@/index.css';
import React from 'react';

interface Customer {
  name:           string;
  subscriptionNo: string;
  nic:            string;
  region:         string;
  customerType:   string;
}

interface CustomerDetailCardProps {
  customer: Customer;
}

export const CustomerDetailCard: React.FC<CustomerDetailCardProps> = ({ customer }) => (
  <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        customer.customerType === 'with_meter' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
      }`}>
        {customer.customerType === 'with_meter' ? 'With Meter' : 'No Meter'}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Name',            value: customer.name },
        { label: 'Subscription No.', value: customer.subscriptionNo },
        { label: 'NIC',             value: customer.nic },
        { label: 'Region',          value: customer.region, capitalize: true },
      ].map(({ label, value, capitalize }) => (
        <div key={label}>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`font-medium text-foreground ${capitalize ? 'capitalize' : ''}`}>{value}</p>
        </div>
      ))}
    </div>
  </div>
);
