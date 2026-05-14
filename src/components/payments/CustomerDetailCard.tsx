import { PaymentCustomerInfoResponse } from '@/services/paymentService';

export const CustomerDetailCard = ({ customerInfo }: { customerInfo: PaymentCustomerInfoResponse | null }) => {
  if (!customerInfo) return null;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md bg-primary/5">
      <h3 className="text-lg font-semibold text-foreground mb-5">
        Customer Details
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm text-muted-foreground">Name</span>
          <span className="font-medium text-foreground text-right">{customerInfo.accountHolderName}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm text-muted-foreground">Subscription No.</span>
          <span className="font-medium text-foreground">{customerInfo.subscriptionNumber}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm text-muted-foreground">NIC</span>
          <span className="font-medium text-foreground">{customerInfo.nic}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm text-muted-foreground">Region</span>
          <span className="font-medium text-foreground capitalize">{customerInfo.region}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-sm text-muted-foreground">Connection Type</span>
          <span className="font-medium text-foreground">
            {customerInfo.connectionType === "metered" ? "With Meter" : "No meter"}
          </span>
        </div>
      </div>
    </div>
  );
};
