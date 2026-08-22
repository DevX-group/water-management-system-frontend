import { api } from './api';
import { BackupScheduleRequest, BackupScheduleResponse } from '../types/backup';

export const backupScheduleService = {
    // Get active schedule settings
    getScheduleSettings: async (): Promise<BackupScheduleResponse> => {
        const response = await api.get<BackupScheduleResponse>('/settings/backups/schedule');
        return response.data;
    },

    // Update schedule settings
    updateScheduleSettings: async (
        payload: BackupScheduleRequest
    ): Promise<BackupScheduleResponse> => {
        const response = await api.put<BackupScheduleResponse>(
            '/settings/backups/schedule',
            payload
        );
        return response.data;
    },
};
