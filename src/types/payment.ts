export type PaymentStatus = "FULL" | "PARTIAL";
export type PaymentType = "MONTHLY" | "OUTSTANDING";
export type PaymentMethod = "ONLINE" | "BANK_TRANSFER" | "MANUAL";
export type SlipStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AddPaymentRequest {
    subscriptionNumber: string;
    amount: number;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
}

export interface AddPaymentResponse {
    message: string;
    subscriptionNumber: string;
    oldBalance: number;
    newBalance: number;
    paymentId: string;
    status: PaymentStatus;
    paymentType: PaymentType;
    createdAt: string;
}

export interface CustomerPaymentSummaryResponse {
    subscriptionNumber: string;
    monthlyDue: number;
    outstandingBalance: number;
    totalDue: number;
    billStatus: string;
}

export interface CurrentBillResponse {
    billId: number;
    billingPeriod: string;
    billDate: string;
    totalAmount: number;
    alreadyPaid: number;
    balanceDue: number;
    status: string;
}

export interface OutstandingBillResponse {
    billId: number;
    billingPeriod: string;
    billDate: string;
    balanceDue: number;
    status: string;
    totalAmount: number;
    paidAmount: number;
}

export interface OutstandingBillsSummaryResponse {
    outstandingBills: OutstandingBillResponse[];
    totalOutstandingAmount: number;
}

export interface PaymentHistoryItemResponse {
    paymentId: string;
    subscriptionNumber: string;
    amount: number;
    status: PaymentStatus;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
    createdAt: string;
}

export interface PaymentCustomerInfoResponse {
    subscriptionNumber: string;
    accountHolderName: string;
    nic: string;
    region: string;
    connectionType: string;
}

export interface RecentPaymentResponse {
    paymentId: string;
    subscriptionNumber: string;
    accountHolderName: string;
    amountPaid: number;
    status: string;
    createdAt: string;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
}

export interface CustomerAddPaymentRequest {
    amount: number;
    paymentMethod: PaymentMethod;
}

export interface CustomerPaymentResponse {
    merchant_id: string;
    order_id: string;
    amount: number;
    currency: string;
    hash: string;

    first_name: string;
    last_name: string;
    email: string;
    phone: string;

    address?: string;
    city?: string;
    country?: string;

    return_url: string;
    cancel_url: string;
    notify_url: string;
}

export interface BankDetailsResponse {
    bankName: string;
    branch: string;
    accountNumber: string;
    accountName: string;
}