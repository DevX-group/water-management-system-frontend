import '@/index.css';
import React from 'react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Loader2, Download, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WaterBillTemplate } from './WaterBillTemplate';
import type { CustomerProfile } from '@/components/profile/ProfileForm';

interface Bill {
  billId: string;
  billingPeriod: string;
  totalAmount: number;
  usageUnits: number;
  status: string;
  dueDate: string;
}

interface BillImageViewerProps {
  bill: Bill | null;
  profile: CustomerProfile | null;
  zoom: number;
  rotation: number;
  imageLoading: boolean;
  imageError: boolean;
  onClose: () => void;
  onDownload: (bill: Bill) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onImageLoad: () => void;
  onImageError: () => void;
}

export const BillImageViewer: React.FC<BillImageViewerProps> = ({
  bill, profile, zoom, rotation, imageLoading, imageError,
  onClose, onDownload, onZoomIn, onZoomOut, onRotate, onImageLoad, onImageError,
}) => {
  const { t } = useTranslation('billing');

  useEffect(() => {
    if (bill) {
      // instantly dismiss loading state since we generate locally
      onImageLoad();
    }
  }, [bill, onImageLoad]);

  return createPortal(
    <AnimatePresence>
      {bill && (
        <motion.div
          key="bill-modal"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10 flex-shrink-0">
            <div>
              <p className="text-white font-bold text-base">{t('history.viewer.bill')} — {bill.billingPeriod}</p>
              <p className="text-white/50 text-xs mt-0.5">{t('currency')} {bill.totalAmount?.toLocaleString()} · {bill.usageUnits} {t('history.viewer.units')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={onZoomOut}><ZoomOut className="w-4 h-4" /></Button>
              <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={onZoomIn}><ZoomIn className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={onRotate}><RotateCw className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => onDownload(bill)}><Download className="w-4 h-4" /></Button>
              <Button variant="destructive" className="ml-4 px-4" onClick={onClose}>
                <X className="w-4 h-4 mr-2" /> Close
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex p-6 relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Loader2 className="w-10 h-10 animate-spin text-white/40" />
              </div>
            )}
            {imageError ? (
              <div className="m-auto text-center text-white/40">
                <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t('history.viewer.imageNotAvailable')}</p>
              </div>
            ) : (
              <motion.div
                key={bill.billId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="m-auto shrink-0"
                style={{
                  transform: `scale(${zoom * 0.8}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  backgroundColor: 'white',
                  borderRadius: '8px', 
                  boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                  overflow: 'hidden'
                }}
              >
                <WaterBillTemplate bill={bill as any} profile={profile} />
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 px-6 py-3 bg-black/60 border-t border-white/10 flex-shrink-0">
            <Badge variant="secondary" className={`rounded-full px-3 py-1 ${bill.status?.toLowerCase() === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>{bill.status ? t(`status.${bill.status.toUpperCase()}`, { defaultValue: bill.status }) : ''}</Badge>
            <span className="text-white/40 text-xs">{t('history.viewer.due')} {bill.dueDate}</span>
            <span className="text-white/40 text-xs">{t('history.viewer.id')} {bill.billId}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
