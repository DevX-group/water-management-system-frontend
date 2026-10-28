import '@/index.css';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Inquiry } from '@/types/inquiry';
import { InquiryList } from '@/components/inquiries/InquiryList';
import { InquiryChatPanel } from '@/components/inquiries/InquiryChatPanel';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

import { useAdminInquiries } from '@/hooks/useAdminInquiries';
import { useTranslation } from 'react-i18next';

export const AdminInquiriesPage: React.FC = () => {
  const { t } = useTranslation('inquiry');
  const {
    loading,
    selectedId,
    filter,
    search,
    replyText,
    pageIndex,
    totalPages,
    totalElements,
    itemsPerPage,
    messagesEndRef,
    selectedInquiry,
    setSearch,
    setFilter,
    setSelectedId,
    setPageIndex,
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
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t('admin.title')} {t('admin.titleHighlight')}
            </h1><p className="mt-1 text-muted-foreground">{t('admin.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-4 py-2 text-sm">{stats.open} {t('admin.open')}</Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm text-success border-success/20">{stats.resolved} {t('admin.resolved')}</Badge>
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
              pageIndex={pageIndex}
              totalPages={totalPages}
              totalElements={totalElements}
              itemsPerPage={itemsPerPage}
              setSearch={setSearch}
              setFilter={setFilter}
              setSelectedId={setSelectedId}
              setPageIndex={setPageIndex}
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

