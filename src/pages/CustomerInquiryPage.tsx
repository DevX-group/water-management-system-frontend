import '@/index.css';
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { InquiryHistoryList } from '@/components/inquiry/InquiryHistoryList';
import { InquiryFormCard } from '@/components/inquiry/InquiryFormCard';
import { InquiryChatPanels } from '@/components/inquiry/InquiryChatPanels';


const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };



import { useCustomerInquiryPage } from '@/hooks/useCustomerInquiryPage';
import { useTranslation } from 'react-i18next';

export const CustomerInquiryPage: React.FC = () => {
  const { t } = useTranslation('inquiry');
  const {
    form,
    errors,
    submitting,
    activeId,
    chatInput,
    showTyping,
    viewingHistoryId,
    historyIndex,
    totalPages,
    totalElements,
    itemsPerPage,
    inquiry,
    inquiries,
    historyInquiry,
    messagesEndRef,
    setForm,
    setChatInput,
    setViewingHistoryId,
    setHistoryIndex,
    handleSubmit,
    sendMessage
  } = useCustomerInquiryPage();

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')} {t('titleHighlight')}</h1>
            <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {inquiries.length > 0 && (
              <motion.div variants={itemVariants} className="lg:col-span-4">
                <InquiryHistoryList inquiries={inquiries} historyIndex={historyIndex} totalPages={totalPages} totalElements={totalElements} itemsPerPage={itemsPerPage} viewingHistoryId={viewingHistoryId} setViewingHistoryId={setViewingHistoryId} setHistoryIndex={setHistoryIndex} />
              </motion.div>
            )}
            <motion.div variants={itemVariants} className={inquiries.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
              <AnimatePresence mode="wait">
                {viewingHistoryId && historyInquiry ? (
                  <motion.div key="history-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <InquiryChatPanels inquiry={historyInquiry} isHistory onBack={() => setViewingHistoryId(null)} messagesEndRef={messagesEndRef} chatInput={chatInput} setChatInput={setChatInput} onSendMessage={sendMessage} showTyping={showTyping} />
                  </motion.div>
                ) : !viewingHistoryId && activeId && inquiry ? (
                  <motion.div key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <InquiryChatPanels inquiry={inquiry} chatInput={chatInput} setChatInput={setChatInput} onSendMessage={sendMessage} showTyping={showTyping} messagesEndRef={messagesEndRef} />
                  </motion.div>
                ) : (
                  <motion.div key="form" variants={itemVariants}>
                    <InquiryFormCard form={form} setForm={setForm} errors={errors} submitting={submitting} onSubmit={handleSubmit} />
                    <p className="text-center text-xs text-muted-foreground mt-6 italic">{t('avgResponseTime')}</p>
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

