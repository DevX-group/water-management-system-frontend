import '@/index.css';
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { MeterReadingForm } from '@/components/meter-reading/MeterReadingForm';
import { MeterReadingInstructions } from '@/components/meter-reading/MeterReadingInstructions';
import { MeterReadingsTable } from '@/components/meter-reading/MeterReadingsTable';

import { useMeterReading } from '@/hooks/useMeterReading';
import { useTranslation } from 'react-i18next';

import { useAdmin } from '@/contexts/AdminContext';

export const MeterReadingPage = () => {
  const { currentAdmin } = useAdmin();
  const { t } = useTranslation('meterReading');
  const {
    formData,
    todaysReadings,
    loadingReadings,
    submitting,
    isOnline,
    pendingCount,
    selectedDate,
    setSelectedDate,
    setFormData,
    handleSubmit,
    clearForm,
    fetchTodaysReadings,
    fetchPreviousReading,
    validateSubscription,
    handleEdit
  } = useMeterReading();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('page.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${isOnline
            ? 'bg-green-500/10 text-green-600 border-green-500/20'
            : 'bg-red-500/10 text-red-600 border-red-500/20'
            }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>{t('network.online')}</span>
                {pendingCount > 0 && <span className="ml-2 text-xs opacity-80">({t('network.syncing', { count: pendingCount })})</span>}
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>{t('network.offlineMode')}</span>
                {pendingCount > 0 && <span className="ml-2 text-xs font-bold">({t('network.saved', { count: pendingCount })})</span>}
              </>
            )}
          </div>
        </div>
      </div>

      {currentAdmin.role === 'METER_READER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MeterReadingForm
            formData={formData} submitting={submitting}
            onChange={setFormData} onSubmit={handleSubmit}
            onClear={clearForm}
            onMeterNumberBlur={fetchPreviousReading}
            onSubscriptionNumberBlur={validateSubscription}
          />
          <MeterReadingInstructions />
        </div>
      )}

      <MeterReadingsTable
        readings={todaysReadings as unknown as any}
        loading={loadingReadings}
        onRefresh={() => fetchTodaysReadings()}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onEdit={handleEdit}
      />
    </div>
  );
};

