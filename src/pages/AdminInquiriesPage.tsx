import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Send, CheckCircle, Clock, Inbox,
  Users, BarChart2, Zap, MessageSquare, Filter,
  ChevronDown, BellRing,
} from 'lucide-react';
import clsx from 'clsx';
import type { Inquiry, InquiryStatus, InquiryMessage } from '../types/inquiry';
import { InquiryChatMessage } from '../components/ui/InquiryChatMessage';
import { InquiryAvatar } from '../components/ui/InquiryAvatar';
import { InquiryStatusBadge } from '../components/ui/InquiryStatusBadge';
import { InquiryCategoryBadge } from '../components/ui/InquiryCategoryBadge';
import { useInquiries } from '../hooks/useInquiries';
import { inquiryService } from '../services/inquiryService';


type FilterTab = 'all' | InquiryStatus;

interface ToastItem { id: string; title: string; body: string }

const QUICK_REPLIES = [
  { label: '👋 Acknowledge', text: "Thank you for reaching out! We're reviewing your inquiry and will update you shortly." },
  { label: '🔍 Need info',   text: 'Could you please provide more details about the issue you are experiencing?' },
  { label: '✅ Resolved',    text: 'Your issue has been resolved. Please let us know if you need any further assistance.' },
  { label: '🙏 Apologize',   text: 'We apologize for any inconvenience caused. Our team is working on this as a priority.' },
  { label: '📅 Follow-up',   text: 'We will follow up with you within 24 hours with a full update on your inquiry.' },
];

export const AdminInquiriesPage: React.FC = () => {
  const { inquiries } = useInquiries(1500);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [filter,    setFilter]        = useState<FilterTab>('all');
  const [search,    setSearch]        = useState('');
  const [replyText, setReplyText]     = useState('');
  const [toasts,    setToasts]        = useState<ToastItem[]>([]);
  const [showQuick, setShowQuick]     = useState(false);

  const prevCountRef   = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef  = useRef<HTMLTextAreaElement>(null);

  const selectedInquiry = inquiries.find((t) => t.id === selectedId) ?? null;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedInquiry?.messages.length]);

  // Toast on new inquiry arrival
  useEffect(() => {
    if (inquiries.length > prevCountRef.current && prevCountRef.current > 0) {
      const newest = inquiries[inquiries.length - 1];
      pushToast(`New Inquiry — ${newest.id}`, `${newest.name} · ${newest.category}`);
    }
    prevCountRef.current = inquiries.length;
  }, [inquiries.length]);

  const pushToast = (title: string, body: string) => {
    const id = inquiryService.genMsgId();
    setToasts((t) => [...t, { id, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const stats = {
    total:    inquiries.length,
    open:     inquiries.filter((t) => t.status === 'open').length,
    pending:  inquiries.filter((t) => t.status === 'pending').length,
    resolved: inquiries.filter((t) => t.status === 'resolved').length,
  };

  const filtered = inquiries
    .filter((t) => {
      const matchStatus = filter === 'all' || t.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q
        || t.name.toLowerCase().includes(q)
        || t.id.toLowerCase().includes(q)
        || t.category.toLowerCase().includes(q)
        || t.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    })
    .slice()
    .reverse();

  const sendReply = () => {
    if (!replyText.trim() || !selectedId) return;
    inquiryService.addMessage(selectedId, {
      id:   inquiryService.genMsgId(),
      from: 'admin',
      text: replyText.trim(),
      time: inquiryService.formatTime(),
    });
    setReplyText('');
    replyInputRef.current?.focus();
  };

  const setStatus = (status: InquiryStatus) => {
    if (!selectedId) return;
    inquiryService.setStatus(selectedId, status);
  };

  const handleReplyKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); }
  };

  const TABS: { value: FilterTab; label: string; count: number }[] = [
    { value: 'all',      label: 'All',      count: stats.total },
    { value: 'open',     label: 'Open',     count: stats.open },
    { value: 'pending',  label: 'Pending',  count: stats.pending },
    { value: 'resolved', label: 'Resolved', count: stats.resolved },
  ];

  
  return (
    <div className="h-screen bg-[#161E54] flex flex-col overflow-hidden">

     
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-[#111827] border border-blue-500/30 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto max-w-[280px]"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <BellRing size={11} className="text-blue-400" />
              <p className="text-xs font-semibold text-slate-100">{t.title}</p>
            </div>
            <p className="text-[11px] text-slate-400 pl-[19px]">{t.body}</p>
          </div>
        ))}
      </div>

      
      

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <div className="flex border-b border-white/8 bg-[#0d1424] flex-shrink-0">
        {[
          { icon: <BarChart2 size={12} />, label: 'Total',    val: stats.total },
          { icon: <Inbox     size={12} />, label: 'Open',     val: stats.open },
          { icon: <Clock     size={12} />, label: 'Pending',  val: stats.pending },
          { icon: <CheckCircle size={12}/>, label: 'Resolved', val: stats.resolved },
        ].map((s, i, arr) => (
          <div
            key={s.label}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2.5',
              i < arr.length - 1 && 'border-r border-white/8'
            )}
          >
            <span className="text-slate-500">{s.icon}</span>
            <span className="font-bold text-sm text-slate-100">{s.val}</span>
            <span className="text-[10px] text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Workspace ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="w-[280px] flex-shrink-0 border-r border-white/8 bg-[#0d1424] flex flex-col overflow-hidden">
          {/* Search + filter tabs */}
          <div className="p-3 border-b border-white/8 flex flex-col gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets…"
                className="w-full bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 text-xs outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15 transition-all"
              />
            </div>
            <div className="flex gap-0.5 p-0.5 bg-white/5 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={clsx(
                    'flex-1 text-[10px] font-semibold py-1.5 rounded-lg transition-all',
                    filter === tab.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  )}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={clsx('ml-1', filter === tab.value ? 'text-blue-200' : 'text-slate-600')}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket list */}
          <div className="flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                <Inbox size={28} className="opacity-25" />
                <p className="text-xs text-center leading-relaxed px-4">
                  {inquiries.length === 0
                    ? 'No inquiries yet.\nCustomer submissions will appear here.'
                    : 'No tickets match your filter.'}
                </p>
              </div>
            ) : (
              filtered.map((inq) => (
                <SidebarTicketCard
                  key={inq.id}
                  inquiry={inq}
                  isActive={inq.id === selectedId}
                  onClick={() => setSelectedId(inq.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Chat panel ────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selectedInquiry ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-slate-500 p-12">
              <div className="w-20 h-20 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                <Users size={32} className="opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-slate-400 mb-1">Select a conversation</p>
                <p className="text-sm max-w-xs leading-relaxed">
                  Click any inquiry from the sidebar to view the conversation and respond.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/8 bg-[#0d1424] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <InquiryAvatar name={selectedInquiry.name} size="md" variant="user" />
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{selectedInquiry.name}</p>
                    <p className="text-[11px] text-slate-500">{selectedInquiry.email} · {selectedInquiry.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <InquiryCategoryBadge category={selectedInquiry.category} />
                  <InquiryStatusBadge status={selectedInquiry.status} size="md" />
                  <button
                    onClick={() => setStatus('pending')}
                    className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-all"
                  >
                    <Clock size={11} /> Pending
                  </button>
                  <button
                    onClick={() => setStatus('resolved')}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-all"
                  >
                    <CheckCircle size={11} /> Resolve
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
                {/* Date divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/6" />
                  <span className="text-[10px] text-slate-600">
                    {new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'short', day: 'numeric',
                    })}
                  </span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>

                {selectedInquiry.messages.map((msg) => (
                  <InquiryChatMessage
                    key={msg.id}
                    message={msg}
                    customerName={selectedInquiry.name}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              <div className="border-t border-white/8 bg-[#0d1424] px-4 py-2 flex-shrink-0">
                <button
                  onClick={() => setShowQuick((v) => !v)}
                  className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors mb-1.5"
                >
                  <Zap size={11} />
                  Quick replies
                  <ChevronDown size={10} className={clsx('transition-transform', showQuick && 'rotate-180')} />
                </button>
                {showQuick && (
                  <div className="flex gap-1.5 flex-wrap pb-1">
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.label}
                        onClick={() => { setReplyText(qr.text); replyInputRef.current?.focus(); setShowQuick(false); }}
                        className="text-[11px] text-slate-400 border border-white/10 rounded-lg px-2.5 py-1 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/8 transition-all"
                      >
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply input */}
              <div className="flex items-end gap-2 px-4 py-3 border-t border-white/8 bg-[#0a0f1e] flex-shrink-0">
                <div className="flex-1 relative">
                  <textarea
                    ref={replyInputRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleReplyKey}
                    rows={1}
                    placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
                    className="w-full bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15 transition-all resize-none min-h-[46px] max-h-[140px]"
                  />
                </div>
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar Ticket Card ──────────────────────────────────────────────────────

interface SidebarTicketCardProps {
  inquiry: Inquiry;
  isActive: boolean;
  onClick: () => void;
}

const SidebarTicketCard: React.FC<SidebarTicketCardProps> = ({ inquiry, isActive, onClick }) => {
  const lastMsg = inquiry.messages[inquiry.messages.length - 1];
  const preview = lastMsg
    ? lastMsg.text.replace(/<[^>]+>/g, '').slice(0, 52) + (lastMsg.text.length > 52 ? '…' : '')
    : 'No messages yet';

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-3 py-3 rounded-xl border mb-1 transition-all',
        isActive
          ? 'bg-blue-600/10 border-blue-500/30'
          : 'border-transparent hover:bg-white/4 hover:border-white/8'
      )}
    >
      <div className="flex items-start gap-2.5">
        <InquiryAvatar name={inquiry.name} size="sm" variant="user" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs font-semibold text-slate-100 truncate">{inquiry.name}</p>
            <p className="text-[10px] text-slate-600 flex-shrink-0 ml-1">{lastMsg?.time ?? '—'}</p>
          </div>
          <p className="text-[10px] text-blue-400 font-medium mb-1">{inquiry.id}</p>
          <p className="text-[11px] text-slate-500 truncate mb-2">{preview}</p>
          <div className="flex items-center gap-1.5">
            <InquiryStatusBadge status={inquiry.status} />
            <InquiryCategoryBadge category={inquiry.category} />
          </div>
        </div>
      </div>
    </button>
  );
};
