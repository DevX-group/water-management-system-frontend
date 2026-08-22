export type BackupFrequency = 'DISABLE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type BackupStatus = 'RUNNING' | 'SUCCESS' | 'FAILED' | null;

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface BackupScheduleResponse {
  id: number;
  frequency: BackupFrequency;
  time: string | null; // e.g. "14:30"
  dayOfWeek: DayOfWeek | null;
  dayOfMonth: number | null; // 1 to 31
  cronExpression: string | null; // e.g. "30 14 * * 1"
  lastBackupStatus: BackupStatus;
  lastSuccessfulBackupDate: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackupScheduleRequest {
  frequency: BackupFrequency;
  time?: string | null;
  dayOfWeek?: DayOfWeek | null;
  dayOfMonth?: number | null;
}

export interface BackupFileInfo {
  fileName: string;
  fileSize?: number;
  sizeFormatted?: string;
  createdAt?: string;
  lastModified?: string;
}

export interface BackupResponse {
  success: boolean;
  message: string;
  fileName?: string;
  fileSize?: number;
  timestamp?: string;
}
