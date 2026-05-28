import '@/index.css';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, HeadphonesIcon } from 'lucide-react';
import type { InquiryFormData, InquiryCategory } from '@/types/inquiry';

const CATEGORIES: { value: InquiryCategory; label: string; icon: string }[] = [
  { value: 'Billing',   label: 'Billing & Payments',   icon: '💳' },
  { value: 'Technical', label: 'Technical Issue',       icon: '🔧' },
  { value: 'Account',   label: 'Account & Access',      icon: '👤' },
  { value: 'General',   label: 'General Inquiry',       icon: '💬' },
];

interface InquiryFormCardProps {
  form:       InquiryFormData;
  setForm:    (form: InquiryFormData) => void;
  errors:     Partial<Record<keyof InquiryFormData, string>>;
  submitting: boolean;
  onSubmit:   () => void;
}

export const InquiryFormCard: React.FC<InquiryFormCardProps> = ({ form, setForm, errors, submitting, onSubmit }) => (
  <Card className="shadow-card border-none overflow-hidden bg-card">
    <div className="p-6 bg-primary/5 border-b flex items-center gap-4 text-primary font-semibold">
      <HeadphonesIcon size={20} /> Submit a Support Inquiry
    </div>
    <CardContent className="p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
          <Input placeholder="Kaweesha Weerasinghe" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={errors.name ? "border-destructive/50" : ""} />
          {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
          <Input type="email" placeholder="kawee@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={errors.email ? "border-destructive/50" : ""} />
          {errors.email && <p className="text-[10px] text-destructive font-medium">{errors.email}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Issue Category</label>
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value as "" | InquiryCategory})} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none">
          <option value="">Select a category...</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message Details</label>
        <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={4} placeholder="Please provide details about the issue..." className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
        {errors.message && <p className="text-[10px] text-destructive font-medium">{errors.message}</p>}
      </div>
      <Button onClick={onSubmit} disabled={submitting} className="w-full h-14 text-base font-bold rounded-xl gradient-primary transition-transform active:scale-[0.98]">
        {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
        {submitting ? "Sending Inquiry..." : "Submit Support Request"}
      </Button>
    </CardContent>
  </Card>
);
