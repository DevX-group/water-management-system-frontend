import { useEffect, useState } from 'react';
import { getMessageFailures, getMessageHistory } from '@/services/messageService';
import type { FailedRecipient, MessageHistoryRow } from '@/types/messaging';

export const useMessageHistory = () => {
  // Main history table state.
  const [rows, setRows] = useState<MessageHistoryRow[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  // Failed-recipient dialog state.
  const [failedRecipients, setFailedRecipients] = useState<FailedRecipient[]>([]);
  const [failuresPage, setFailuresPage] = useState(0);
  const [failuresSize, setFailuresSize] = useState(5);
  const [failuresTotalPages, setFailuresTotalPages] = useState(0);
  const [failuresTotalElements, setFailuresTotalElements] = useState(0);
  
  const [loadingFailuresFor, setLoadingFailuresFor] = useState<string | null>(null);
  const [failuresError, setFailuresError] = useState<string | null>(null);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
  const [openFailuresId, setOpenFailuresId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch paged message history; cancel updates on unmount.
    let active = true;
    getMessageHistory(page, size)
      .then(data => {
        if (!active) return;
        setRows(data.rows);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .catch(console.error);
    return () => {
      active = false;
    };
  }, [page, size]);

  useEffect(() => {
    // Fetch failures only when the dialog is open.
    if (!openFailuresId) return;
    let active = true;
    setLoadingFailuresFor(openFailuresId);
    setFailuresError(null);
    getMessageFailures(openFailuresId, failuresPage, failuresSize)
      .then(data => {
        if (!active) return;
        setFailedRecipients(data.rows);
        setFailuresTotalPages(data.totalPages);
        setFailuresTotalElements(data.totalElements);
        setFailuresPage(data.page);
        setFailuresSize(data.size);
      })
      .catch(() => {
        if (active) setFailuresError('Failed to load failed recipients');
      })
      .finally(() => {
        if (active) setLoadingFailuresFor(null);
      });
    return () => {
      active = false;
    };
  }, [openFailuresId, failuresPage, failuresSize]);

  const handleViewFailed = (id: string) => {
    // Reset failures paging whenever switching to a new message.
    setFailuresPage(0);
    setFailuresSize(5);
    setFailedRecipients([]);
    setOpenDetailsId(null);
    setOpenFailuresId(id);
  };

  const closeDetails = () => setOpenDetailsId(null);
  const closeFailures = () => setOpenFailuresId(null);
  const openDetails = (id: string) => setOpenDetailsId(id);
  const backToDetails = (id: string) => {
    // Return to details while keeping the selected message.
    setOpenFailuresId(null);
    setOpenDetailsId(id);
  };

  const selectedRow       = rows.find(r => r.id === openDetailsId) ?? null;
  const selectedFailedRow = rows.find(r => r.id === openFailuresId) ?? null;

  const updateSize = (nextSize: number) => {
    // Reset page whenever the page size changes.
    setSize(nextSize);
    setPage(0);
  };

  const updateFailuresSize = (nextSize: number) => {
    // Reset failures page whenever the page size changes.
    setFailuresSize(nextSize);
    setFailuresPage(0);
  };

  return {
    rows,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize: updateSize,
    failedRecipients,
    failuresPage,
    failuresSize,
    failuresTotalPages,
    failuresTotalElements,
    setFailuresPage,
    setFailuresSize: updateFailuresSize,
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
