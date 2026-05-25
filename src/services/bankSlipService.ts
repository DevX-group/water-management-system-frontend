import { AdminBankSlipResponse, BankSlipActionRequest, BankSlipUploadRequest, BankSlipUploadResponse, PageResponse } from '@/types/bankSlip';
import api from "@/lib/api";
import { SlipStatus } from '@/types/payment';


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