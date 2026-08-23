import axios from 'axios';
import api from "@/lib/api";
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/utils/authUtils';
import { SystemDetailsResponse, SystemDetailsRequest } from "@/types/systemSettings";

export const getSystemDetails = async (): Promise<SystemDetailsResponse> => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await axios.get(`${API_BASE_URL}/system-settings/get`, { headers });
    return res.data;
}

export const updateSystemDetails = async (payload: SystemDetailsRequest): Promise<SystemDetailsResponse> => {
    const res = await api.put("/system-settings/update", payload);
    return res.data;
}