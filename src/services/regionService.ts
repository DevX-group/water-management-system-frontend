import api from "@/lib/api";
import { AddRegionRequest, AddRegionResponse } from "@/types/region";

export const getAllActiveRegions = async () => {
    const res = await api.get("/regions");
    return res.data;
}

export const addRegion = async (payload: AddRegionRequest): Promise<AddRegionResponse> => {
    const res = await api.post("/regions", payload);
    return res.data;
};

export const deleteRegion = async (regionCode: string): Promise<void> => {
    await api.delete(`/regions/delete/${regionCode}`);
};
