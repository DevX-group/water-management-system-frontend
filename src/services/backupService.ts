import api from '@/lib/api';
import type { BackupFileInfo, BackupResponse } from '@/types/backup';

// Creates a new system/database backup.
export const createBackup = async (): Promise<BackupResponse> => {
  const res = await api.post<BackupResponse>('/settings/backups');
  return res.data;
};

// Retrieves the list of available system backups.
export const listBackups = async (): Promise<BackupFileInfo[]> => {
  const res = await api.get<BackupFileInfo[]>('/settings/backups');
  return res.data;
};

// Downloads a backup file by filename as a binary Blob.
export const downloadBackupFile = async (fileName: string): Promise<Blob> => {
  const res = await api.get(`/settings/backups/download/${encodeURIComponent(fileName)}`, {
    responseType: 'blob',
  });
  return res.data;
};

// Deletes a backup file from the system storage.
export const deleteBackup = async (fileName: string): Promise<void> => {
  await api.delete(`/settings/backups/${encodeURIComponent(fileName)}`);
};

// Restores the system state from a specified backup file.
export const restoreBackup = async (fileName: string): Promise<BackupResponse> => {
  const res = await api.post<BackupResponse>(`/settings/backups/restore/${encodeURIComponent(fileName)}`);
  return res.data;
};

// Helper utility to trigger a browser file download for a Blob object.
export const triggerFileDownload = (fileName: string, blob: Blob): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
