import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Send, CheckCircle, Clock, Inbox, 
  Users, BarChart2, Zap, MessageSquare, 
  Filter, ChevronDown, BellRing, Loader2,
  Eye, Download
} from 'lucide-react';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Inquiry, InquiryStatus } from '../types/inquiry';
import { InquiryChatMessage } from '../components/ui/InquiryChatMessage';
import { InquiryAvatar } from '../components/ui/InquiryAvatar';
import { useInquiries } from '../hooks/useInquiries';
import { inquiryService } from '../services/inquiryService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AdminInquiriesPage: React.FC = () => {
  const { inquiries, loading } = useInquiries(1500);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showQuick, setShowQuick] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    const matchStatus = filter === 'all' || t.status === filter;
    const q = search.toLowerCase();
    return matchStatus && (t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  });

  const sendReply = () => {
    if (!replyText.trim() || !selectedId) return;
    inquiryService.addMessage(selectedId, {
      id: inquiryService.genMsgId(),
      from: 'admin',
      text: replyText.trim(),
      time: inquiryService.formatTime(),
    });
    setReplyText('');
  };

  return (
    
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-0.5">
                Customer <span className="text-gradient">Inquiries</span>
              </h1>
           
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="px-4 py-2 text-sm">{stats.open} Open</Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm text-emerald-500 border-emerald-500/20">{stats.resolved} Resolved</Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
            
            {/* Sidebar: Ticket List */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
              <Card className="shadow-card border-none flex flex-col h-full overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search tickets..." 
                      className="pl-10 h-11 rounded-xl"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {['all', 'open', 'pending', 'resolved'].map((tab) => (
                      <Button 
                        key={tab}
                        variant={filter === tab ? "default" : "ghost"}
                        size="sm"
                        className="capitalize rounded-full px-4"
                        onClick={() => setFilter(tab)}
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto px-3">
                  {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : filtered.map((inq) => (
                    <button
                      key={inq.id}
                      onClick={() => setSelectedId(inq.id)}
                      className={`w-full text-left p-4 rounded-xl mb-2 transition-all border ${
                        selectedId === inq.id 
                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                        : "border-transparent hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm truncate">{inq.name}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {inq.messages[inq.messages.length - 1]?.time}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium mb-1">{inq.id}</p>
                      <p className="text-xs text-muted-foreground truncate line-clamp-1">
                        {inq.messages[inq.messages.length - 1]?.text}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Chat Area */}
            <motion.div variants={itemVariants} className="lg:col-span-8 overflow-hidden">
              <Card className="shadow-card border-none h-full flex flex-col overflow-hidden">
                {!selectedInquiry ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                    <MessageSquare size={48} className="opacity-10 mb-4" />
                    <h3 className="text-lg font-medium">No Inquiry Selected</h3>
                    <p className="text-sm max-w-xs">Select a conversation from the list to view history and respond.</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b flex items-center justify-between bg-secondary/20">
                      <div className="flex items-center gap-3">
                        <InquiryAvatar name={selectedInquiry.name} size="sm" variant="user" />
                        <div>
                          <p className="font-bold text-sm">{selectedInquiry.name}</p>
                          <p className="text-[10px] text-muted-foreground">{selectedInquiry.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => inquiryService.setStatus(selectedId!, 'resolved')}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Resolve
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                      {selectedInquiry.messages.map((msg) => (
                        <InquiryChatMessage 
                          key={msg.id} 
                          message={msg} 
                          customerName={selectedInquiry.name} 
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t bg-secondary/10">
                      <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your response..."
                            rows={2}
                            className="w-full rounded-xl border-none bg-background p-3 text-sm focus:ring-2 focus:ring-primary/20 resize-none shadow-inner"
                          />
                        </div>
                        <Button 
                          className="h-12 w-12 rounded-xl" 
                          disabled={!replyText.trim()}
                          onClick={sendReply}
                        >
                          <Send size={18} />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

          </div>
        </motion.div>
      </div>
    
  );
};