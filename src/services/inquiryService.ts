// src/services/inquiryService.ts
// Drop-in service — swap localStorage calls with your real API later

import type { Inquiry, InquiryMessage } from '../types/inquiry';

const STORAGE_KEY = 'wms_inquiries';

export const inquiryService = {
  getAll(): Inquiry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  getById(id: string): Inquiry | undefined {
    return this.getAll().find((t) => t.id === id);
  },

  save(inquiries: Inquiry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  },

  create(inquiry: Inquiry): void {
    const all = this.getAll();
    all.push(inquiry);
    this.save(all);
  },

  update(updated: Inquiry): void {
    const all = this.getAll();
    const idx = all.findIndex((t) => t.id === updated.id);
    if (idx !== -1) {
      all[idx] = updated;
      this.save(all);
    }
  },

  addMessage(inquiryId: string, message: InquiryMessage): Inquiry | null {
    const all = this.getAll();
    const idx = all.findIndex((t) => t.id === inquiryId);
    if (idx === -1) return null;
    all[idx].messages.push(message);
    this.save(all);
    return all[idx];
  },

  setStatus(inquiryId: string, status: Inquiry['status']): void {
    const all = this.getAll();
    const idx = all.findIndex((t) => t.id === inquiryId);
    if (idx !== -1) {
      all[idx].status = status;
      this.save(all);
    }
  },

  genId(): string {
    return 'INQ-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  },

  genMsgId(): string {
    return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);
  },

  formatTime(date = new Date()): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
};
