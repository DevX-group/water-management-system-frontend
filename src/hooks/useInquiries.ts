// src/hooks/useInquiries.ts

import { useState, useEffect, useCallback } from 'react';
import type { Inquiry } from '../types/inquiry';

const API_BASE_URL = 'http://localhost:8081/api/inquiries';

/** Polls all inquiries — use in admin dashboard */
export function useInquiries(pollMs = 1500) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
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

  const refresh = useCallback(async () => {
    if (!id) { setInquiry(null); return; }
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data: Inquiry[] = await response.json();
        const found = data.find(t => t.id === id);
        setInquiry(found || null);
      } else {
        setInquiry(null);
      }
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
