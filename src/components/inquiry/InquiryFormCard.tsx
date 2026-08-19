import '@/index.css';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, HeadphonesIcon } from 'lucide-react';
import type { InquiryFormData, InquiryCategory } from '@/types/inquiry';

const CATEGORIES: { value: InquiryCategory; icon: string }[] = [
  { value: 'Billing',   icon: '💳' },
  { value: 'Technical', icon: '🔧' },
  { value: 'Account',   icon: '👤' },
  { value: 'General',   icon: '💬' },
];

interface InquiryFormCardProps {
  form:       InquiryFormData;
  setForm:    (form: InquiryFormData) => void;
  errors:     Partial<Record<keyof InquiryFormData, string>>;
  submitting: boolean;
  onSubmit:   () => void;
}

import { useTranslation } from 'react-i18next';

export const InquiryFormCard: React.FC<InquiryFormCardProps> = ({ form, setForm, errors, submitting, onSubmit }) => {
  const { t } = useTranslation('inquiry');
  
  return (
  <Card className="shadow-card border-none overflow-hidden bg-card">
    <div className="p-6 bg-primary/5 border-b flex items-center gap-4 text-primary font-semibold">
      <HeadphonesIcon size={20} /> {t('form.title')}
    </div>
    <CardContent className="p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('form.fullName')}</label>
          <Input placeholder={t('form.namePlaceholder')} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={errors.name ? "border-destructive/50" : ""} />
          {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('form.email')}</label>
          <Input type="email" placeholder={t('form.emailPlaceholder')} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={errors.email ? "border-destructive/50" : ""} />
          {errors.email && <p className="text-[10px] text-destructive font-medium">{errors.email}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('form.category')}</label>
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value as "" | InquiryCategory})} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none">
          <option value="">{t('form.categorySelect')}</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {t(`categories.${c.value}`)}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('form.message')}</label>
        <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={4} placeholder={t('form.messagePlaceholder')} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
        {errors.message && <p className="text-[10px] text-destructive font-medium">{errors.message}</p>}
      </div>
      <Button onClick={onSubmit} disabled={submitting} className="w-full h-14 text-base font-bold rounded-xl gradient-primary transition-transform active:scale-[0.98]">
        {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
        {submitting ? t('form.submitting') : t('form.submit')}
      </Button>
    </CardContent>
  </Card>
  );
};
