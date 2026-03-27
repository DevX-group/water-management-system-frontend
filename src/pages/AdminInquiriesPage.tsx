import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Send, CheckCircle, Clock, Inbox,
  Users, BarChart2, Zap, ChevronDown, BellRing,
} from 'lucide-react';
import clsx from 'clsx';
import type { Inquiry, InquiryStatus } from '../types/inquiry';
import { InquiryChatMessage } from '../components/ui/InquiryChatMessage';
import { InquiryAvatar } from '../components/ui/InquiryAvatar';
import { InquiryStatusBadge } from '../components/ui/InquiryStatusBadge';
import { InquiryCategoryBadge } from '../components/ui/InquiryCategoryBadge';
import { useInquiries } from '../hooks/useInquiries';
import { inquiryService } from '../services/inquiryService';

type FilterTab = 'all' | InquiryStatus;

const QUICK_REPLIES = [
  { label: '👋 Acknowledge', text: "Thank you! We're reviewing your inquiry." },
  { label: '🔍 Need info', text: 'Please provide more details about your issue.' },
  { label: '✅ Resolved', text: 'Your issue has been resolved.' },
  { label: '🙏 Apologize', text: 'We apologize for the inconvenience.' },
];

export const AdminInquiriesPage: React.FC = () => {
  const { inquiries } = useInquiries(1500);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showQuick, setShowQuick] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const selectedInquiry = inquiries.find((t) => t.id === selectedId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedInquiry?.messages.length]);

  const stats = {
    total: inquiries.length,
    open: inquiries.filter((t) => t.status === 'open').length,
    pending: inquiries.filter((t) => t.status === 'pending').length,
    resolved: inquiries.filter((t) => t.status === 'resolved').length,
  };

  const filtered = inquiries.filter((t) => {
    const q = search.toLowerCase();
    return (
      (filter === 'all' || t.status === filter) &&
      (!q ||
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q))
    );
  });

  const sendReply = () => {
    if (!replyText.trim() || !selectedId) return;
    inquiryService.addMessage(selectedId, {
      id: inquiryService.genMsgId(),
      from: 'admin',
      text: replyText,
      time: inquiryService.formatTime(),
    });
    setReplyText('');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#020617] flex flex-col text-white">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 p-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
        {[
          { icon: <BarChart2 size={14} />, label: 'Total', val: stats.total },
          { icon: <Inbox size={14} />, label: 'Open', val: stats.open },
          { icon: <Clock size={14} />, label: 'Pending', val: stats.pending },
          { icon: <CheckCircle size={14} />, label: 'Resolved', val: stats.resolved },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">{s.icon}</div>
            <div>
              <p className="text-sm font-bold">{s.val}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[300px] bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filtered.map((inq) => (
              <button
                key={inq.id}
                onClick={() => setSelectedId(inq.id)}
                className={clsx(
                  'w-full p-3 mb-2 rounded-xl text-left transition border',
                  selectedId === inq.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/40 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                )}
              >
                <p className="text-sm font-semibold">{inq.name}</p>
                <p className="text-xs text-slate-400">{inq.email}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <div className="flex-1 flex flex-col">

          {!selectedInquiry ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a conversation
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div>
                  <p className="font-semibold">{selectedInquiry.name}</p>
                  <p className="text-xs text-slate-400">{selectedInquiry.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => inquiryService.setStatus(selectedInquiry.id, 'pending')}
                    className="px-3 py-2 text-xs bg-yellow-500/20 rounded-lg"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => inquiryService.setStatus(selectedInquiry.id, 'resolved')}
                    className="px-3 py-2 text-xs bg-green-500/20 rounded-lg"
                  >
                    Resolve
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {selectedInquiry.messages.map((msg) => (
                  <InquiryChatMessage key={msg.id} message={msg} customerName={selectedInquiry.name} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-white/10">
                <button onClick={() => setShowQuick(!showQuick)} className="text-xs text-slate-400">
                  Quick Replies <ChevronDown size={12} />
                </button>
                {showQuick && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {QUICK_REPLIES.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => setReplyText(q.text)}
                        className="px-2 py-1 text-xs bg-white/5 rounded-lg"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2 p-3 border-t border-white/10">
                <textarea
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={sendReply}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};