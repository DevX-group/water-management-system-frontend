// src/hooks/useInquiries.ts

import { useState, useEffect, useCallback } from 'react';
import type { Inquiry } from '../types/inquiry';
import { inquiryService } from '../services/inquiryService';

/** Polls all inquiries — use in admin dashboard */
export function useInquiries(pollMs = 1500) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const refresh = useCallback(() => {
    setInquiries(inquiryService.getAll());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { inquiries, refresh };
}

/** Polls a single inquiry by ID — use in customer chat view */
export function useInquiry(id: string | null, pollMs = 1500) {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);

  const refresh = useCallback(() => {
    if (!id) { setInquiry(null); return; }
    setInquiry(inquiryService.getById(id) ?? null);
  }, [id]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollMs);
    return () => clearInterval(interval);
  }, [refresh, pollMs]);

  return { inquiry, refresh };
}
