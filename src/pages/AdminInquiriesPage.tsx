import '@/index.css';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Inquiry } from '@/types/inquiry';
import { InquiryList } from '@/components/inquiries/InquiryList';
import { InquiryChatPanel } from '@/components/inquiries/InquiryChatPanel';

const API_BASE_URL = 'http://localhost:8081/api/inquiries';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

import { useAdminInquiries } from '@/hooks/useAdminInquiries';

export const AdminInquiriesPage: React.FC = () => {
  const {
    loading,
    selectedId,
    filter,
    search,
    replyText,
    currentIndex,
    itemsPerPage,
    messagesEndRef,
    selectedInquiry,
    setSearch,
    setFilter,
    setSelectedId,
    setCurrentIndex,
    setReplyText,
    sendReply,
    resolveInquiry,
    stats,
    filtered
  } = useAdminInquiries();

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
            <Badge variant="outline" className="px-4 py-2 text-sm text-success border-success/20">{stats.resolved} Resolved</Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">

          <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
            <InquiryList
              loading={loading}
              filtered={filtered}
              selectedId={selectedId}
              search={search}
              filter={filter}
              currentIndex={currentIndex}
              itemsPerPage={itemsPerPage}
              setSearch={setSearch}
              setFilter={setFilter}
              setSelectedId={setSelectedId}
              setCurrentIndex={setCurrentIndex}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-8 overflow-hidden">
            <InquiryChatPanel
              selectedInquiry={selectedInquiry}
              replyText={replyText}
              setReplyText={setReplyText}
              messagesEndRef={messagesEndRef}
              onSendReply={sendReply}
              onResolve={resolveInquiry}
            />
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};