import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ChevronDown, Loader2, MessageCircle,
  CheckCircle, ArrowRight, HeadphonesIcon, History, ChevronLeft, ArrowLeft,
} from 'lucide-react';
import clsx from 'clsx';
import type { Inquiry, InquiryCategory, InquiryFormData, InquiryMessage } from '../types/inquiry';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InquiryChatMessage } from '../components/ui/InquiryChatMessage';
import { InquiryTypingIndicator } from '../components/ui/InquiryTypingIndicator';
import { InquiryAvatar } from '../components/ui/InquiryAvatar';
import { inquiryService } from '../services/inquiryService';
import { useInquiry, useInquiries } from '../hooks/useInquiries';

// API base URL
const API_BASE_URL = 'http://localhost:8081/api/inquiries';

const CATEGORIES: { value: InquiryCategory; label: string; icon: string }[] = [
  { value: 'Billing',   label: 'Billing & Payments',   icon: '💳' },
  { value: 'Technical', label: 'Technical Issue',       icon: '🔧' },
  { value: 'Account',   label: 'Account & Access',      icon: '👤' },
  { value: 'General',   label: 'General Inquiry',       icon: '💬' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

type FormErrors = Partial<Record<keyof InquiryFormData, string>>;

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    open:     { label: 'Open',     className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    pending:  { label: 'Pending',  className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    resolved: { label: 'Resolved', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  }[status] ?? { label: status, className: 'bg-secondary text-muted-foreground' };

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.className}`}>
      {config.label}
    </span>
  );
};

export const CustomerInquiryPage: React.FC = () => {
  const [form, setForm] = useState<InquiryFormData>({ name: '', email: '', category: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  const [historyIndex, setHistoryIndex] = useState(0);
  const itemsPerPage = 5;

  const { inquiry } = useInquiry(activeId, 1500);
  const { inquiries } = useInquiries(3000);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { inquiry: historyInquiry } = useInquiry(viewingHistoryId, 5000);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inquiry?.messages.length, showTyping, historyInquiry?.messages.length]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Please describe your issue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- CONNECTED TO DATABASE ---
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const id = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const firstMsg = {
      msgId: `MSG-${Date.now()}`,
      user: 'user', // Maps to sender_role in DB
      text: form.message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const payload = {
      id,
      name: form.name.trim(),
      email: form.email.trim(),
      category: (form.category || 'General'),
      messages: [firstMsg],
      status: 'open'
    };

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setActiveId(id);
        setViewingHistoryId(null);
        setForm({ name: '', email: '', category: '', message: '' });
      }
    } catch (err) {
      console.error("Submission error", err);
    } finally {
      setSubmitting(false);
    }
  };

  // --- CONNECTED TO DATABASE ---
  const sendMessage = async () => {
    if (!chatInput.trim() || !activeId) return;

    const newMsg = {
      msgId: `MSG-${Date.now()}`,
      user: 'user',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/${activeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });

      if (res.ok) {
        setChatInput('');
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const showHistory = viewingHistoryId && historyInquiry;
  const showChat = !viewingHistoryId && activeId && inquiry;

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support <span className="text-gradient">Center</span>
            </h1>
            <p className="text-muted-foreground text-lg">We're here to help with your water management needs</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {inquiries.length > 0 && (
              <motion.div variants={itemVariants} className="lg:col-span-4">
                <Card className="shadow-card border-none overflow-hidden bg-white">
                  <div className="p-4 bg-primary/5 border-b flex items-center gap-2 text-primary font-semibold text-sm">
                    <History size={16} />
                    My Previous Inquiries
                  </div>
                  <CardContent className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
                    {inquiries.slice(historyIndex, historyIndex + itemsPerPage).map((inq) => (
                      <button
                        key={inq.id}
                        onClick={() => setViewingHistoryId(inq.id)}
                        className={clsx(
                          "w-full text-left p-3 rounded-xl transition-all border",
                          viewingHistoryId === inq.id
                            ? "bg-primary/5 border-primary/20 shadow-sm"
                            : "border-transparent hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="text-xs font-semibold truncate">{inq.category || 'General'}</span>
                          <StatusBadge status={inq.status} />
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {inq.messages[inq.messages.length - 1]?.text}
                        </p>
                        <p className="text-[10px] text-primary/60 mt-1">{inq.id}</p>
                      </button>
                    ))}

                    {inquiries.length > itemsPerPage && (
                      <div className="flex justify-center items-center gap-2 mt-4 pb-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setHistoryIndex(prev => Math.max(0, prev - itemsPerPage))}
                          disabled={historyIndex === 0}
                        >
                          <ArrowLeft size={14} />
                        </Button>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {historyIndex + 1}-{Math.min(historyIndex + itemsPerPage, inquiries.length)} / {inquiries.length}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setHistoryIndex(prev => Math.min(inquiries.length - itemsPerPage, prev + itemsPerPage))}
                          disabled={historyIndex + itemsPerPage >= inquiries.length}
                        >
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className={inquiries.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}
            >
              <AnimatePresence mode="wait">

                {showHistory ? (
                  <motion.div
                    key="history-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="shadow-card border-none overflow-hidden h-[600px] flex flex-col bg-white">
                      <CardHeader className="bg-secondary/20 border-b flex flex-row items-center gap-3 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setViewingHistoryId(null)}
                        >
                          <ChevronLeft size={16} />
                        </Button>
                        <div className="flex-1">
                          <CardTitle className="text-base">{historyInquiry.category} Inquiry</CardTitle>
                          <p className="text-xs text-muted-foreground">{historyInquiry.id}</p>
                        </div>
                        <StatusBadge status={historyInquiry.status} />
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                        {historyInquiry.messages.map((msg) => (
                          <InquiryChatMessage key={msg.id} message={msg} customerName={historyInquiry.name} />
                        ))}
                        <div ref={messagesEndRef} />
                      </CardContent>
                      {historyInquiry.status === 'resolved' ? (
                        <div className="p-4 bg-emerald-500/5 border-t flex items-center justify-center gap-2 text-emerald-500">
                          <CheckCircle size={16} />
                          <span className="text-xs font-medium">This inquiry has been resolved.</span>
                        </div>
                      ) : (
                        <div className="p-4 bg-secondary/10 border-t">
                          <p className="text-xs text-muted-foreground text-center italic">
                            This inquiry is currently <strong>{historyInquiry.status}</strong>. Our team will respond shortly.
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>

                ) : showChat ? (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="shadow-card border-none overflow-hidden h-[600px] flex flex-col bg-white">
                      <CardHeader className="bg-secondary/20 border-b flex flex-row items-center gap-4 py-4">
                        <InquiryAvatar name="S" size="sm" variant="admin" />
                        <div>
                          <CardTitle className="text-base">Live Support Session</CardTitle>
                          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Connected with Support Team
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">ID: {activeId}</Badge>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 ">
                        {inquiry.messages.map((msg) => (
                          <InquiryChatMessage key={msg.id} message={msg} customerName={inquiry.name} />
                        ))}
                        {showTyping && <InquiryTypingIndicator />}
                        <div ref={messagesEndRef} />
                      </CardContent>
                      <div className="p-4 bg-secondary/10 border-t">
                        <div className="flex gap-2">
                          <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white border border-input rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none min-h-[50px] shadow-inner"
                          />
                          <Button onClick={sendMessage} disabled={!chatInput.trim()} className="h-auto px-6 rounded-xl gradient-primary">
                            <Send size={18} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                ) : (
                  <motion.div 
                    key="form"
                    variants={itemVariants}
                  >
                    <Card className="shadow-card border-none overflow-hidden bg-white">
                      <div className="p-6 bg-primary/5 border-b flex items-center gap-4 text-primary font-semibold">
                        <HeadphonesIcon size={20} />
                        Submit a Support Inquiry
                      </div>
                      <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                            <Input 
                              placeholder="kaweesha weerasinghe" 
                              value={form.name} 
                              onChange={(e) => setForm({...form, name: e.target.value})}
                              className={errors.name ? "border-destructive/50" : ""}
                            />
                            {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                            <Input 
                              type="email"
                              placeholder="kaweesha@example.com" 
                              value={form.email} 
                              onChange={(e) => setForm({...form, email: e.target.value})}
                              className={errors.email ? "border-destructive/50" : ""}
                            />
                            {errors.email && <p className="text-[10px] text-destructive font-medium">{errors.email}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Issue Category</label>
                          <select
                            value={form.category}
                            onChange={(e) => setForm({...form, category: e.target.value})}
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none"
                          >
                            <option value="">Select a category...</option>
                            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message Details</label>
                          <textarea
                            value={form.message}
                            onChange={(e) => setForm({...form, message: e.target.value})}
                            rows={4}
                            placeholder="Please provide details about the issue..."
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                          />
                          {errors.message && <p className="text-[10px] text-destructive font-medium">{errors.message}</p>}
                        </div>

                        <Button 
                          onClick={handleSubmit} 
                          disabled={submitting}
                          className="w-full h-14 text-base font-bold rounded-xl gradient-primary transition-transform active:scale-[0.98]"
                        >
                          {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                          {submitting ? "Sending Inquiry..." : "Submit Support Request"}
                        </Button>
                      </CardContent>
                    </Card>
                    <p className="text-center text-xs text-muted-foreground mt-6 italic">
                      Average response time: 5-10 minutes during business hours.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};