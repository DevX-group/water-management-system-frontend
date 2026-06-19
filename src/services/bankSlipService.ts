import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8081/api",
    //baseURL: "http://water-management-system-backend-0p2e.onrender.com/api",
    headers: { "Content-Type": "application/json" },
});

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
    uploadedAt: string;
    bankPaymentDate: string;
}

export interface CustomerBankSlipResponse {
    slipId: number;
    amount: number;
    bankReference: string;
    filePath: string;
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

export const uploadBankSlip = async (payload: BankSlipUploadRequest): Promise<BankSlipUploadResponse> => {
    const formData = new FormData();

    formData.append("amount", payload.amount.toString());
    formData.append("bankPaymentDate", payload.bankPaymentDate.toString());
    formData.append("bankReference", payload.bankReference);
    formData.append("file", payload.file);

    const res = await api.post("/slips/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export const getMySlips = async (page = 0, size = 6, year?: number, status?: SlipStatus) => {
    let url = `/slips/my?page=${page}&size=${size}`;

    if (year !== undefined) {
        url += `&year=${year}`;
    }

    if (status) {
        url += `&status=${status}`;
    }
    const res = await api.get(url);
    return res.data;
}

export const getPendingSlips = async (page: number, size: number, search?: string): Promise<PageResponse<AdminBankSlipResponse>> => {
    const res = await api.get("/slips/pending", {
        params: { page, size, search }
    });

    return res.data;
};

export const getAllPendingSlips = async (): Promise<AdminBankSlipResponse[]> => {
    const res = await api.get("/slips/pending/all");
    return res.data;
}

export const processBankSlipReview = async (payload: BankSlipActionRequest): Promise<{ message: string }> => {
    const res = await api.post("/slips/review", payload);
    return res.data;
}

export const deleteSlip = async (slipId: number): Promise<{ message: string }> => {
    const res = await api.delete(`/slips/delete/${slipId}`);
    return res.data;
}

export const getSlipById = async (slipId: number): Promise<AdminBankSlipResponse> => {
    const res = await api.get(`/slips/${slipId}`);
    return res.data;
}