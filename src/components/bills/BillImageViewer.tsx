import '@/index.css';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Loader2, Download, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Bill {
  billId:        string;
  billingPeriod: string;
  totalAmount:   number;
  usageUnits:    number;
  status:        string;
  dueDate:       string;
}

interface BillImageViewerProps {
  bill:         Bill | null;
  zoom:         number;
  rotation:     number;
  imageLoading: boolean;
  imageError:   boolean;
  onClose:      () => void;
  onDownload:   (bill: Bill) => void;
  onZoomIn:     () => void;
  onZoomOut:    () => void;
  onRotate:     () => void;
  onImageLoad:  () => void;
  onImageError: () => void;
}

const getBillImageUrl = (billId: string) =>
  `http://localhost:8081/api/bills/${billId}/image`;   // Replace with actual API endpoint

export const BillImageViewer: React.FC<BillImageViewerProps> = ({
  bill, zoom, rotation, imageLoading, imageError,
  onClose, onDownload, onZoomIn, onZoomOut, onRotate, onImageLoad, onImageError,
}) => {
  const { t } = useTranslation('billing');
  return (
  <AnimatePresence>
    {bill && (
      <motion.div
        key="bill-modal"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
         // Header
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
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 ml-2" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
        </div>

        // Image Container
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-white/40" />
            </div>
          )}
          {imageError ? (
            <div className="text-center text-white/40">
              <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t('history.viewer.imageNotAvailable')}</p>
            </div>
          ) : (
            <motion.img
              key={bill.billId}
              src={getBillImageUrl(bill.billId)}
              alt={`Bill ${bill.billingPeriod}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: imageLoading ? 0 : 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                borderRadius: '8px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              }}
              onLoad={onImageLoad}
              onError={onImageError}
            />
          )}
        </div>

        // Footer 
        <div className="flex items-center justify-center gap-6 px-6 py-3 bg-black/60 border-t border-white/10 flex-shrink-0">
          <Badge variant="secondary" className={`rounded-full px-3 py-1 ${
            bill.status?.toLowerCase() === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>{bill.status ? t(`status.${bill.status.toUpperCase()}`, { defaultValue: bill.status }) : ''}</Badge>
          <span className="text-white/40 text-xs">{t('history.viewer.due')} {bill.dueDate}</span>
          <span className="text-white/40 text-xs">{t('history.viewer.id')} {bill.billId}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};
