import '@/index.css';
import React from 'react';
import { MeterReadingForm }         from '@/components/meter-reading/MeterReadingForm';
import { MeterReadingInstructions } from '@/components/meter-reading/MeterReadingInstructions';
import { MeterReadingsTable }       from '@/components/meter-reading/MeterReadingsTable';

import { useMeterReading } from '@/hooks/useMeterReading';
import { useTranslation } from 'react-i18next';

export const MeterReadingPage = () => {
  const { t } = useTranslation('meterReading');
  const {
    formData,
    todaysReadings,
    loadingReadings,
    submitting,
    setFormData,
    handleSubmit,
    clearForm,
    fetchTodaysReadings
  } = useMeterReading();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">{t('page.title')}</h1>
        <p className="text-muted-foreground">{t('page.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MeterReadingForm
          formData={formData} submitting={submitting}
          onChange={setFormData} onSubmit={handleSubmit}
          onClear={clearForm}
        />
        <MeterReadingInstructions />
      </div>

      <MeterReadingsTable
        readings={todaysReadings as unknown as any}
        loading={loadingReadings}
        onRefresh={fetchTodaysReadings}
      />
    </div>
  );
};