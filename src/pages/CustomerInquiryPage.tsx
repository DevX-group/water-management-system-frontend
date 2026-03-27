
import React, { useState, useRef, useEffect } from 'react';
import {
  Send, ChevronDown, Loader2, MessageCircle,
  CheckCircle, ArrowRight, HeadphonesIcon,
} from 'lucide-react';
import clsx from 'clsx';
import type { Inquiry, InquiryCategory, InquiryFormData, InquiryMessage } from '../types/inquiry';
import { InquiryChatMessage } from '../components/ui/InquiryChatMessage';
import { InquiryTypingIndicator } from '../components/ui/InquiryTypingIndicator';
import { InquiryAvatar } from '../components/ui/InquiryAvatar';
import { InquiryStatusBadge } from '../components/ui/InquiryStatusBadge';
import { InquiryCategoryBadge}  from '../components/ui/InquiryCategoryBadge';
import { inquiryService } from '../services/inquiryService';
import { useInquiry } from '../hooks/useInquiries';

const CATEGORIES: { value: InquiryCategory; label: string; icon: string }[] = [
  { value: 'Billing',   label: 'Billing & Payments',   icon: '💳' },
  { value: 'Technical', label: 'Technical Issue',       icon: '🔧' },
  { value: 'Account',   label: 'Account & Access',      icon: '👤' },
  { value: 'Refund',    label: 'Refunds & Returns',     icon: '↩️' },
  { value: 'General',   label: 'General Inquiry',       icon: '💬' },
];

type FormErrors = Partial<Record<keyof InquiryFormData, string>>;

const FIELD_CLS = (err?: string) =>
  clsx(
    'w-full bg-white/5 border text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all',
    err
      ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  );

// ─────────────────────────────────────────────────────────────────────────────

export const CustomerInquiryPage: React.FC = () => {
  const [form, setForm] = useState<InquiryFormData>({ name: '', email: '', category: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [shakeBtn, setShakeBtn] = useState(false);

  // After submission
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);

  const { inquiry } = useInquiry(activeId, 1500);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inquiry?.messages.length, showTyping]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
                               e.email   = 'A valid email is required';
    if (!form.message.trim()) e.message = 'Please describe your issue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const setField = (field: keyof InquiryFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  // ── Submit inquiry ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) {
      setShakeBtn(true);
      setTimeout(() => setShakeBtn(false), 500);
      return;
    }
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 500)); // UX delay

    const id = inquiryService.genId();
    const firstMsg: InquiryMessage = {
      id:   inquiryService.genMsgId(),
      from: 'user',
      text: form.message.trim(),
      time: inquiryService.formatTime(),
    };
    const newInquiry: Inquiry = {
      id,
      name:      form.name.trim(),
      email:     form.email.trim(),
      category:  (form.category || 'General') as InquiryCategory,
      messages:  [firstMsg],
      status:    'open',
      createdAt: new Date().toISOString(),
    };
    inquiryService.create(newInquiry);
    setActiveId(id);
    setSubmitting(false);

    // Auto-reply from support
    setShowTyping(true);
    await new Promise((r) => setTimeout(r, 2000));
    setShowTyping(false);
    inquiryService.addMessage(id, {
      id:     inquiryService.genMsgId(),
      from:   'admin',
      text:   `Hi <strong>${form.name.split(' ')[0]}</strong> 👋 — thanks for reaching out! Your inquiry has been logged under <strong style="color:#93c5fd">${id}</strong>. Our water management support team will review this and get back to you shortly.`,
      time:   inquiryService.formatTime(),
      isHtml: true,
    });
  };

  // ── Send chat message ──────────────────────────────────────────────────────
  const sendMessage = () => {
    if (!chatInput.trim() || !activeId) return;
    inquiryService.addMessage(activeId, {
      id:   inquiryService.genMsgId(),
      from: 'user',
      text: chatInput.trim(),
      time: inquiryService.formatTime(),
    });
    setChatInput('');
  };

  const handleChatKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── CHAT VIEW (after submission) ───────────────────────────────────────────
  if (activeId && inquiry) {
    return (
      <div className="min-h-screen bg-blue-200 flex flex-col">
       

       

        {/* Chat window */}
        <div className="relative z-10 flex-1 flex justify-center px-4 py-6">
          <div
            className="w-full max-w-2xl flex flex-col bg-blue-200 border border-white/10 rounded-2xl "
            style={{ maxHeight: 'calc(100vh - 130px)' }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-white/3 flex-shrink-0">
              <InquiryAvatar name="S" size="md" variant="admin" />
              <div>
                <p className="text-sm font-semibold text-slate-100">Support Team</p>
                <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online — typically replies in minutes
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
              {inquiry.messages.map((msg) => (
                <InquiryChatMessage key={msg.id} message={msg} customerName={inquiry.name} />
              ))}
              {showTyping && <InquiryTypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-white/8 bg-white/3 px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKey}
                  rows={1}
                  placeholder="Type a message… (Enter to send)"
                  className="flex-1 bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[46px] max-h-[120px]"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── INQUIRY FORM ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
         
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
           
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
             How can we help you?
            </span>
          </h1>

           <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 border border-blue-500/30 bg-white-600 px-3.5 py-1.5 rounded-full mb-1">
            <MessageCircle size={11} />
            Submit an Inquiry
          </div>
          
        </div>

        {/* Features strip */}
        <div className="flex items-center gap-6 mb-10 text-[12px] text-slate-500">
          {[
            { icon: <CheckCircle size={12} className="text-emerald-400" />, label: 'Fast response' },
            { icon: <CheckCircle size={12} className="text-emerald-400" />, label: 'Live chat' },
            { icon: <CheckCircle size={12} className="text-emerald-400" />, label: '24/7 support' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-1.5">{f.icon}{f.label}</div>
          ))}
        </div>

        {/* Form card */}
        <div
          className={clsx(
            'w-full max-w-xl bg-[#111827]/90 border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] transition-transform duration-75',
            shakeBtn && 'animate-[shake_0.4s_ease]'
          )}
        >
          {/* Card header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8 bg-white/3">
            <InquiryAvatar name="S" size="md" variant="admin" />
            <div>
              <p className="text-sm font-semibold text-slate-100">Water Management Support</p>
              <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Online — typically replies in minutes
              </p>
            </div>
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Jane Cooper"
                  className={FIELD_CLS(errors.name)}
                />
                {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="jane@company.com"
                  className={FIELD_CLS(errors.email)}
                />
                {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Issue Category
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                >
                  <option value="" style={{ background: '#111827' }}>Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} style={{ background: '#111827' }}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Describe Your Issue
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                rows={4}
                placeholder="Please provide as much detail as possible about the issue you're experiencing…"
                className={clsx(FIELD_CLS(errors.message), 'resize-none')}
              />
              {errors.message && <p className="text-[11px] text-red-400">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(59,130,246,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                : <><Send size={14} /> Submit Inquiry <ArrowRight size={13} /></>}
            </button>

            <p className="text-center text-[11px] text-slate-600">
              By submitting you agree to our support terms. Your ticket ID will be provided instantly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
