import { useEffect, useState } from 'react';
import { getMessageFailures, getMessageHistory } from '@/services/messageService';
import type { FailedRecipient, MessageHistoryRow } from '@/types/messaging';

export const useMessageHistory = () => {
  const [rows, setRows]                   = useState<MessageHistoryRow[]>([]);
  const [failedRecipients, setFailedRecipients] = useState<Record<string, FailedRecipient[]>>({});
  const [loadingFailuresFor, setLoadingFailuresFor] = useState<string | null>(null);
  const [failuresError, setFailuresError] = useState<string | null>(null);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
  const [openFailuresId, setOpenFailuresId] = useState<string | null>(null);

  useEffect(() => {
    getMessageHistory().then(setRows).catch(console.error);
  }, []);

  const loadFailures = async (id: string) => {
    if (failedRecipients[id]) return;
    setLoadingFailuresFor(id); 
    setFailuresError(null);
    try {
      const data = await getMessageFailures(id);
      setFailedRecipients(prev => ({ ...prev, [id]: data }));
    } catch {
      setFailuresError('Failed to load failed recipients');
    } finally {
      setLoadingFailuresFor(null);
    }
  };

  const handleViewFailed = async (id: string) => {
    await loadFailures(id);
    setOpenDetailsId(null);
    setOpenFailuresId(id);
  };

  const closeDetails = () => setOpenDetailsId(null);
  const closeFailures = () => setOpenFailuresId(null);
  const openDetails = (id: string) => setOpenDetailsId(id);
  const backToDetails = (id: string) => {
    setOpenFailuresId(null);
    setOpenDetailsId(id);
  };

  const selectedRow       = rows.find(r => r.id === openDetailsId) ?? null;
  const selectedFailedRow = rows.find(r => r.id === openFailuresId) ?? null;

  return {
    rows,
    failedRecipients,
    loadingFailuresFor,
    failuresError,
    openDetailsId,
    openFailuresId,
    selectedRow,
    selectedFailedRow,
    handleViewFailed,
    closeDetails,
    closeFailures,
    openDetails,
    backToDetails
  };
};
