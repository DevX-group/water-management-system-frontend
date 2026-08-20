import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Database,
  Download,
  RotateCcw,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
  AlertTriangle,
  FileArchive,
} from 'lucide-react';
import {
  createBackup,
  listBackups,
  downloadBackupFile,
  deleteBackup,
  restoreBackup,
  triggerFileDownload,
} from '@/services/backupService';
import type { BackupFileInfo } from '@/types/backup';

export const BackupManagementCard: React.FC = () => {
  const [backups, setBackups] = useState<BackupFileInfo[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // Modal state for restore & delete
  const [restoreModalFile, setRestoreModalFile] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [deleteModalFile, setDeleteModalFile] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoadingList(true);
      const data = await listBackups();
      setBackups(Array.isArray(data) ? data : []);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to load backup files list';
      toast.error(msg);
    } finally {
      setLoadingList(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      const response = await createBackup();
      if (response.success !== false) {
        toast.success(response.message || 'System backup created successfully');
        await fetchBackups();
      } else {
        toast.error(response.message || 'Failed to create system backup');
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to create system backup';
      toast.error(msg);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      setDownloadingFile(fileName);
      const blob = await downloadBackupFile(fileName);
      triggerFileDownload(fileName, blob);
      toast.success(`Downloaded ${fileName}`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to download backup file';
      toast.error(msg);
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleConfirmRestore = async () => {
    if (!restoreModalFile) return;

    try {
      setRestoring(true);
      const response = await restoreBackup(restoreModalFile);
      if (response.success !== false) {
        toast.success(response.message || `System restored from ${restoreModalFile}`);
      } else {
        toast.error(response.message || 'System restoration failed');
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to restore backup';
      toast.error(msg);
    } finally {
      setRestoring(false);
      setRestoreModalFile(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalFile) return;

    try {
      setDeleting(true);
      await deleteBackup(deleteModalFile);
      toast.success(`Deleted ${deleteModalFile}`);
      setBackups((prev) => prev.filter((b) => b.fileName !== deleteModalFile));
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to delete backup file';
      toast.error(msg);
    } finally {
      setDeleting(false);
      setDeleteModalFile(null);
    }
  };

  const formatBytes = (bytes?: number): string => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (backup: BackupFileInfo): string => {
    const rawDate = backup.createdAt || backup.lastModified;
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
    return 'N/A';
  };

  return (
    <>
      <Card className="border-primary/10 shadow-soft hover:shadow-lg transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-secondary/30 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2.5 rounded-xl gradient-primary text-white shadow-sm">
                  <Database className="h-5 w-5" />
                </div>
                System Backups
              </CardTitle>

              <CardDescription className="text-base ml-14 mt-1">
                Manage database backup archives and restore system data.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2.5 ml-14 sm:ml-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchBackups}
                disabled={loadingList || creatingBackup}
                className="rounded-xl border-primary/20 hover:bg-primary/10 h-10 px-3.5"
              >
                <RefreshCw className={`h-4 w-4 ${loadingList ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                type="button"
                onClick={handleCreateBackup}
                disabled={creatingBackup || loadingList}
                className="h-10 px-5 rounded-xl gradient-primary text-white shadow-md transition-all gap-2"
              >
                {creatingBackup ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Create Backup</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Backups Table */}
          <div className="rounded-2xl border border-primary/10 overflow-hidden bg-background">
            {loadingList ? (
              <div className="flex flex-col justify-center items-center h-[200px] gap-2 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <span className="text-sm">Loading backups...</span>
              </div>
            ) : backups.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col justify-center items-center py-12 px-4 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-3 text-primary">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No backups found
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1 mb-4">
                  Create a system backup to safeguard your data.
                </p>
                <Button
                  onClick={handleCreateBackup}
                  disabled={creatingBackup}
                  size="sm"
                  className="rounded-xl gradient-primary text-white gap-2"
                >
                  {creatingBackup ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create Backup
                </Button>
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-secondary/40 sticky top-0 z-10 backdrop-blur-md">
                    <TableRow className="hover:bg-transparent border-b border-primary/10">
                      <TableHead className="pl-6 font-semibold text-foreground">
                        File Name
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Size
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Created Date
                      </TableHead>
                      <TableHead className="w-[180px] text-right pr-6 font-semibold text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow
                        key={backup.fileName}
                        className="group border-b border-border/50 hover:bg-primary/[0.03] transition-colors"
                      >
                        {/* File Name */}
                        <TableCell className="pl-6 py-3.5 font-medium text-foreground text-sm">
                          <div className="flex items-center gap-3">
                            <FileArchive className="h-4 w-4 text-primary shrink-0" />
                            <span className="font-mono text-xs">{backup.fileName}</span>
                          </div>
                        </TableCell>

                        {/* Size */}
                        <TableCell className="text-sm text-muted-foreground">
                          {backup.sizeFormatted || formatBytes(backup.fileSize)}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(backup)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            {/* Download */}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Download"
                              onClick={() => handleDownload(backup.fileName)}
                              disabled={downloadingFile === backup.fileName}
                              className="h-8 px-2.5 text-muted-foreground hover:text-primary rounded-lg gap-1.5"
                            >
                              {downloadingFile === backup.fileName ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                              <span className="hidden lg:inline text-xs">Download</span>
                            </Button>

                            {/* Restore */}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Restore"
                              onClick={() => setRestoreModalFile(backup.fileName)}
                              className="h-8 px-2.5 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 rounded-lg gap-1.5"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline text-xs">Restore</span>
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete"
                              onClick={() => setDeleteModalFile(backup.fileName)}
                              className="h-8 px-2.5 text-muted-foreground hover:text-destructive rounded-lg gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline text-xs">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={!!restoreModalFile}
        onOpenChange={(open) => {
          if (!open && !restoring) setRestoreModalFile(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Restore System Backup?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm pt-2 space-y-2">
              <span>Are you sure you want to restore the system state from:</span>
              <span className="block font-mono text-xs font-semibold bg-secondary p-2 rounded-lg text-foreground break-all">
                {restoreModalFile}
              </span>
              <span className="block text-xs text-muted-foreground">
                This will replace the current database state with the data from this backup.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={restoring} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={restoring}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Restoring...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  <span>Restore</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteModalFile}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteModalFile(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup File?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm pt-2 space-y-2">
              <span>This will permanently delete the backup file:</span>
              <span className="block font-mono text-xs font-semibold bg-secondary p-2 rounded-lg text-foreground break-all">
                {deleteModalFile}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={deleting} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
