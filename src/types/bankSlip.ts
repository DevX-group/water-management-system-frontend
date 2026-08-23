export type PaymentStatus = "FULL" | "PARTIAL";
export type PaymentType = "MONTHLY" | "OUTSTANDING";
export type PaymentMethod = "ONLINE" | "BANK_TRANSFER" | "MANUAL";
export type SlipStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface BankSlipUploadRequest {
    amount: number;
    bankPaymentDate: string;
    bankReference: string;
    file: File;
}

export interface BankSlipUploadResponse {
    message: string;
    slipId: number;
    amount: number;
    status: SlipStatus;
    bankReference: string;
    filePath: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
    bankPaymentDate: string;
}

export interface AdminBankSlipResponse {
    slipId: number;
    subscriptionNumber: string;
    accountHolderName: string;
    status: SlipStatus;
    amount: number;
    bankReference: string;
    filePath: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
    bankPaymentDate: string;
}

export interface CustomerBankSlipResponse {
    slipId: number;
    amount: number;
    bankReference: string;
    filePath: string;
    fileName: string;
    fileType: string;
    status: SlipStatus;
    uploadedAt: string;
    bankPaymentDate: string;
    reviewedAt: string;
    rejectionReason?: string;
}

export interface BankSlipActionRequest {
    slipId: number;
    action: SlipStatus;
    rejectionReason?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface BankSlipExtractResponse {
    amount: number | null;
    bankPaymentDate: string | null;
    bankReference: string | null;
    extracted: boolean;
    message: string;
}