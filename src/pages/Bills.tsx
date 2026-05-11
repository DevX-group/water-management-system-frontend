import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { BillsSummaryStats } from '@/components/bills/BillsSummaryStats';
import { BillsFilterBar }   from '@/components/bills/BillsFilterBar';
import { BillsTable }       from '@/components/bills/BillsTable';
import { BillImageViewer }  from '@/components/bills/BillImageViewer';

import { useBills } from '@/hooks/useBills';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Bills = () => {
  const {
    bills,
    loading,
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
              Billing <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground text-lg">View and manage all your water bills for {SUBSCRIPTION_NUMBER}</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BillsSummaryStats bills={bills} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <BillsFilterBar
              searchTerm={searchTerm} statusFilter={statusFilter}
              setSearchTerm={setSearchTerm} setStatusFilter={setStatusFilter}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <BillsTable
              bills={filteredBills}
              currentIndex={currentIndex}
              itemsPerPage={itemsPerPage}
              setCurrentIndex={setCurrentIndex}
              onView={handleView}
              onDownload={handleDownload}
            />
          </motion.div>

        </motion.div>
      </div>

      <BillImageViewer
        bill={viewingBill} zoom={zoom} rotation={rotation}
        imageLoading={imageLoading} imageError={imageError}
        onClose={handleCloseView}
        onDownload={handleDownload}
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