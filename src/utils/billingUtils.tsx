import React from 'react';
import { Zap, ToggleLeft } from 'lucide-react';
import type { ConnectionType, ConnectionRate, BillBreakdown } from '@/types/billing';

export const API_BASE = 'http://localhost:8081/api';

export const INITIAL_RATES: Record<ConnectionType, ConnectionRate> = {
  metered: {
    connectionType: 'metered',
    baseRate:       0,
    unitRateTier1:  0,
    unitRateTier2:  0,
    unitRateTier3:  0,
    tier1Limit:     0,
    tier2Limit:     0,
    taxRate:        0,
  },
  non_metered: {
    connectionType: 'non_metered',
    baseRate:       0,
    unitRateTier1:  0,
    unitRateTier2:  0,
    unitRateTier3:  0,
    tier1Limit:     0,
    tier2Limit:     0,
    taxRate:        0,
  },
};

export const STATUS_STYLES: Record<string, string> = {
  PAID:    'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

export const TYPE_META: Record<ConnectionType, { label: string; icon: React.ReactNode; description: string }> = {
  metered: {
    label:       'Metered',
    icon:        <Zap className="w-4 h-4" />,
    description: 'Usage-based billing with tiered unit rates',
  },
  non_metered: {
    label:       'Non-Metered',
    icon:        <ToggleLeft className="w-4 h-4" />,
    description: 'Fixed-rate billing regardless of usage',
  },
};

export const calculateBill = (
  selectedRate: ConnectionRate,
  selectedType: ConnectionType,
  usage: number
): BillBreakdown => {
  const r = selectedRate;
  let usageCharge = 0;
  if (selectedType === 'metered') {
    const t1 = Math.min(usage, r.tier1Limit);
    const t2 = Math.min(Math.max(usage - r.tier1Limit, 0), r.tier2Limit - r.tier1Limit);
    const t3 = Math.max(usage - r.tier2Limit, 0);
    usageCharge = t1 * r.unitRateTier1 + t2 * r.unitRateTier2 + t3 * r.unitRateTier3;
  }
  const subtotal = r.baseRate + usageCharge;
  const tax      = subtotal * r.taxRate;
  return { baseCharge: r.baseRate, usageCharge, tax, subtotal, total: subtotal + tax };
};
