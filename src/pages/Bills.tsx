import '@/index.css';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { BillsSummaryStats } from '@/components/bills/BillsSummaryStats';
import { BillsFilterBar } from '@/components/bills/BillsFilterBar';
import { BillsTable } from '@/components/bills/BillsTable';
import { BillImageViewer } from '@/components/bills/BillImageViewer';

import { useBills } from '@/hooks/useBills';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Bills = () => {
  const { t } = useTranslation('billing');
  const {
    bills,
    loading,
    profile,
    searchTerm,
    statusFilter,
    viewingBill,
    zoom,
    rotation,
    imageLoading,
    imageError,
    currentIndex,
    itemsPerPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentIndex,
    setZoom,
    setRotation,
    setImageLoading,
    setImageError,
    filteredBills,
    handleDownload,
    handleCloseView,
    handleView,
    SUBSCRIPTION_NUMBER
  } = useBills();

  if (loading) return (
    <MainLayout isAuthenticated={true}>
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('history.title')} <span className="text-gradient">{t('history.titleHighlight')}</span>
            </h1>
          </motion.div>

          {/* normalize billId to string to satisfy BillsSummaryStats Bill type */}
          <motion.div variants={itemVariants}>
            <BillsSummaryStats bills={bills.map(b => ({ ...b, billId: String(b.billId) }))} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <BillsFilterBar
              searchTerm={searchTerm} statusFilter={statusFilter}
              setSearchTerm={setSearchTerm} setStatusFilter={setStatusFilter}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <BillsTable
              bills={filteredBills.map(b => ({ ...b, billId: String(b.billId) }))}
              currentIndex={currentIndex}
              itemsPerPage={itemsPerPage}
              setCurrentIndex={setCurrentIndex}
              // BillsTable expects a Bill type; adapt BillResponse to Bill by picking required fields
              onView={(billParam) => {
                // find original source item (has billDate) by id, fall back to passed item
                const source = bills.find(b => String(b.billId) === String((billParam as any).billId));
                handleView({ ...(source ?? billParam), billDate: (source as any)?.billDate ?? '' } as any);
              }}
              onDownload={(bill) => { void handleDownload(bill as any); }}
            />
          </motion.div>

        </motion.div>
      </div>

      <BillImageViewer
        bill={viewingBill ? { ...viewingBill, billId: String((viewingBill as any).billId) } : null}
        profile={profile}
        zoom={zoom} rotation={rotation}
        imageLoading={imageLoading} imageError={imageError}
        onClose={handleCloseView}
        onDownload={(bill) => { void handleDownload(bill as any); }}
        onZoomIn={() => setZoom(z => Math.min(3, z + 0.25))}
        onZoomOut={() => setZoom(z => Math.max(0.5, z - 0.25))}
        onRotate={() => setRotation(r => (r + 90) % 360)}
        onImageLoad={() => setImageLoading(false)}
        onImageError={() => { setImageLoading(false); setImageError(true); }}
      />
    </MainLayout>
  );
};

export default Bills;