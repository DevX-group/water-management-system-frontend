// src/hooks/useInquiries.ts

import { useState, useEffect, useCallback } from 'react';
import type { Inquiry } from '../types/inquiry';
import { api } from '@/services/api';

// Polls all inquiries - use in admin dashboard 
export function useInquiries(pollMs = 1500, pageIndex = 0, size = 5) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await api.get<{ content: Inquiry[], totalPages: number, totalElements: number }>(`/inquiries/paginated?page=${pageIndex}&size=${size}`);
      setInquiries(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  }, [pageIndex, size]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { inquiries, refresh, totalPages, totalElements };
}

// Polls a single inquiry by ID — use in customer chat view 
export function useInquiry(id: string | null, pollMs = 1500) {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);

  const refresh = useCallback(async () => {
    if (!id) { setInquiry(null); return; }
    try {
      const response = await api.get<Inquiry[]>('/inquiries');
      const found = response.data.find(t => t.id === id);
      setInquiry(found || null);
    } catch (error) {
      console.error("Error fetching inquiry:", error);
    }
  }, [id]);

  useEffect(() => {
    refresh();
    if (!id) return;
    const interval = setInterval(refresh, pollMs);
    return () => clearInterval(interval);
  }, [refresh, pollMs, id]);

  return { inquiry, refresh };
}
