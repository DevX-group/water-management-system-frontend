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
