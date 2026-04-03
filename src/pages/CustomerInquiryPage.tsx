import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ChevronDown, Loader2, MessageCircle,
  CheckCircle, ArrowRight, HeadphonesIcon,
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
import { useInquiry } from '../hooks/useInquiries';

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

export const CustomerInquiryPage: React.FC = () => {
  const [form, setForm] = useState<InquiryFormData>({ name: '', email: '', category: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);

  const { inquiry } = useInquiry(activeId, 1500);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inquiry?.messages.length, showTyping]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Please describe your issue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const id = inquiryService.genId();
    const firstMsg: InquiryMessage = {
      id: inquiryService.genMsgId(),
      from: 'user',
      text: form.message.trim(),
      time: inquiryService.formatTime(),
    };
    
    inquiryService.create({
      id,
      name: form.name.trim(),
      email: form.email.trim(),
      category: (form.category || 'General') as InquiryCategory,
      messages: [firstMsg],
      status: 'open',
      createdAt: new Date().toISOString(),
    });

    setActiveId(id);
    setSubmitting(false);

    setShowTyping(true);
    await new Promise((r) => setTimeout(r, 2000));
    setShowTyping(false);
    inquiryService.addMessage(id, {
      id: inquiryService.genMsgId(),
      from: 'admin',
      text: `Hi ${form.name.split(' ')[0]}, thanks for reaching out! Our team will assist you shortly.`,
      time: inquiryService.formatTime(),
    });
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !activeId) return;
    inquiryService.addMessage(activeId, {
      id: inquiryService.genMsgId(),
      from: 'user',
      text: chatInput.trim(),
      time: inquiryService.formatTime(),
    });
    setChatInput('');
  };

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support <span className="text-gradient">Center</span>
            </h1>
            <p className="text-muted-foreground text-lg">We're here to help with your water management needs</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeId && inquiry ? (
              /* --- Chat View --- */
              <motion.div 
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="shadow-card border-none overflow-hidden h-[600px] flex flex-col">
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
                        className="flex-1 bg-black border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none min-h-[50px] shadow-inner"
                      />
                      <Button onClick={sendMessage} disabled={!chatInput.trim()} className="h-auto px-6 rounded-xl">
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              /* --- Form View --- */
              <motion.div 
                key="form"
                variants={itemVariants}
                className="max-w-2xl mx-auto"
              >
                <Card className="shadow-card border-none overflow-hidden">
                  <div className="p-6 bg-primary/5 border-b flex items-center gap-4 text-primary font-semibold">
                    <HeadphonesIcon size={20} />
                    Submit a Support Inquiry
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                        <Input 
                          placeholder="John Doe" 
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
                          placeholder="john@example.com" 
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
    </MainLayout>
  );
};