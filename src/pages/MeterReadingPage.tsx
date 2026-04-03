import React, { useState, useEffect } from 'react';
import { Info, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:8081/api';

interface TodayReading {
  readingId: number;
  meterNumber: string;
  customerName: string;
  subscriptionNumber: string;
  previousReading: number;
  currentReading: number;
  usageUnits: number;
  readingDate: string;
  billId: number | null;
  totalAmount: number | null;
  billStatus: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID:    'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

export const MeterReadingPage = () => {

  return (
    <div></div>
  );
};
