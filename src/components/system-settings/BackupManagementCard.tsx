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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  CalendarClock,
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
import { BackupScheduleSettings } from './BackupScheduleSettings';
import { useTranslation } from 'react-i18next';

export const BackupManagementCard: React.FC = () => {
  const { t } = useTranslation('systemSettings');
  const [activeTab, setActiveTab] = useState<string>('instant');
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
        t('backups.loadFailed', { defaultValue: 'Failed to load backup files list' });
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
        toast.success(response.message || t('backups.createSuccess', { defaultValue: 'System backup created successfully' }));
        await fetchBackups();
      } else {
        toast.error(response.message || t('backups.createFailed', { defaultValue: 'Failed to create system backup' }));
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        t('backups.createFailed', { defaultValue: 'Failed to create system backup' });
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
      toast.success(t('backups.downloadSuccess', { defaultValue: `Downloaded ${fileName}`, fileName }));
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        t('backups.downloadFailed', { defaultValue: 'Failed to download backup file' });
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
        toast.success(response.message || t('backups.restoreSuccess', { defaultValue: `System restored from ${restoreModalFile}`, fileName: restoreModalFile }));
      } else {
        toast.error(response.message || t('backups.restoreFailed', { defaultValue: 'System restoration failed' }));
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        t('backups.restoreFailed', { defaultValue: 'Failed to restore backup' });
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
      toast.success(t('backups.deleteSuccess', { defaultValue: `Deleted ${deleteModalFile}`, fileName: deleteModalFile }));
      setBackups((prev) => prev.filter((b) => b.fileName !== deleteModalFile));
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        t('backups.deleteFailed', { defaultValue: 'Failed to delete backup file' });
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2.5 rounded-xl gradient-primary text-white shadow-sm">
                  <Database className="h-5 w-5" />
                </div>
                {t('backups.title')}
              </CardTitle>

              <CardDescription className="text-base ml-14 mt-1">
                {t('backups.description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs List */}
            <TabsList className="grid grid-cols-1 sm:grid-cols-2 max-w-xl w-full bg-secondary/60 p-1 rounded-xl h-auto min-h-11 border border-border/40 mb-6 gap-1">
              <TabsTrigger
                value="instant"
                className="rounded-lg gap-2 text-xs sm:text-sm font-semibold py-2 px-3 h-full min-h-[36px] data-[state=active]:gradient-primary data-[state=active]:text-white transition-all items-center justify-center text-center whitespace-normal"
              >
                <Database className="h-4 w-4 shrink-0" />
                <span>{t('backups.tabs.instant')}</span>
              </TabsTrigger>

              <TabsTrigger
                value="schedule"
                className="rounded-lg gap-2 text-xs sm:text-sm font-semibold py-2 px-3 h-full min-h-[36px] data-[state=active]:gradient-primary data-[state=active]:text-white transition-all items-center justify-center text-center whitespace-normal"
              >
                <CalendarClock className="h-4 w-4 shrink-0" />
                <span>{t('backups.tabs.schedule')}</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Instant Backup */}
            <TabsContent value="instant" className="space-y-6 mt-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-secondary/20 p-4 rounded-xl border border-border/40">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('backups.instant.title')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('backups.instant.description')}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchBackups}
                    disabled={loadingList || creatingBackup}
                    className="rounded-xl border-primary/20 hover:bg-primary/10 h-10 px-3.5"
                    title={t('backups.instant.refreshTooltip')}
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
                    <span>{t('backups.instant.createButton')}</span>
                  </Button>
                </div>
              </div>

              {/* Backups Table */}
              <div className="rounded-2xl border border-primary/10 overflow-hidden bg-background">
                {loadingList ? (
                  <div className="flex flex-col justify-center items-center h-[200px] gap-2 text-muted-foreground">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <span className="text-sm">{t('backups.loading')}</span>
                  </div>
                ) : backups.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col justify-center items-center py-12 px-4 text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-3 text-primary">
                      <Database className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t('backups.emptyTitle')}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1 mb-4">
                      {t('backups.emptyDescription')}
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
                      {t('backups.instant.createButtonShort')}
                    </Button>
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-secondary/40 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow className="hover:bg-transparent border-b border-primary/10">
                          <TableHead className="pl-6 font-semibold text-foreground">
                            {t('backups.table.fileName')}
                          </TableHead>
                          <TableHead className="font-semibold text-foreground">
                            {t('backups.table.size')}
                          </TableHead>
                          <TableHead className="font-semibold text-foreground">
                            {t('backups.table.createdDate')}
                          </TableHead>
                          <TableHead className="w-[180px] text-right pr-6 font-semibold text-foreground">
                            {t('backups.table.actions')}
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
                                  title={t('common.download')}
                                  onClick={() => handleDownload(backup.fileName)}
                                  disabled={downloadingFile === backup.fileName}
                                  className="h-8 px-2.5 text-muted-foreground hover:text-primary rounded-lg gap-1.5"
                                >
                                  {downloadingFile === backup.fileName ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Download className="h-3.5 w-3.5" />
                                  )}
                                  <span className="hidden lg:inline text-xs">{t('common.download')}</span>
                                </Button>

                                {/* Restore */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('common.restore')}
                                  onClick={() => setRestoreModalFile(backup.fileName)}
                                  className="h-8 px-2.5 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 rounded-lg gap-1.5"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span className="hidden lg:inline text-xs">{t('common.restore')}</span>
                                </Button>

                                {/* Delete */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={t('common.delete')}
                                  onClick={() => setDeleteModalFile(backup.fileName)}
                                  className="h-8 px-2.5 text-muted-foreground hover:text-destructive rounded-lg gap-1.5"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="hidden lg:inline text-xs">{t('common.delete')}</span>
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
            </TabsContent>

            {/* TAB 2: Scheduled Backup */}
            <TabsContent value="schedule" className="mt-0">
              <BackupScheduleSettings />
            </TabsContent>
          </Tabs>
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
              {t('backups.restoreModal.title')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm pt-2 space-y-2">
              <span>{t('backups.restoreModal.desc1')}</span>
              <span className="block font-mono text-xs font-semibold bg-secondary p-2 rounded-lg text-foreground break-all">
                {restoreModalFile}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t('backups.restoreModal.desc2')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={restoring} className="rounded-xl">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={restoring}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('backups.restoreModal.restoring')}</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  <span>{t('backups.restoreModal.confirm')}</span>
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
            <AlertDialogTitle>{t('backups.deleteModal.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm pt-2 space-y-2">
              <span>{t('backups.deleteModal.desc')}</span>
              <span className="block font-mono text-xs font-semibold bg-secondary p-2 rounded-lg text-foreground break-all">
                {deleteModalFile}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={deleting} className="rounded-xl">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('backups.deleteModal.deleting')}</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>{t('common.delete')}</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
