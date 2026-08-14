import api from "@/lib/api";
import { SystemDetailsResponse, SystemDetailsRequest } from "@/types/systemSettings";

export const getSystemDetails = async (): Promise<SystemDetailsResponse> => {
    const res = await api.get("/system-settings/get");
    return res.data;
}

export const updateSystemDetails = async (payload: SystemDetailsRequest): Promise<SystemDetailsResponse> => {
    const res = await api.put("/system-settings/update", payload);
    return res.data;
}