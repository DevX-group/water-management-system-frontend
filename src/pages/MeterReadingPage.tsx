import '@/index.css';
import React from 'react';
import { MeterReadingForm }         from '@/components/meter-reading/MeterReadingForm';
import { MeterReadingInstructions } from '@/components/meter-reading/MeterReadingInstructions';
import { MeterReadingsTable }       from '@/components/meter-reading/MeterReadingsTable';

import { useMeterReading } from '@/hooks/useMeterReading';

export const MeterReadingPage = () => {
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
        <h1 className="text-2xl font-bold text-foreground">Meter Reading</h1>
        <p className="text-muted-foreground">Submit a water meter reading</p>
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
        readings={todaysReadings}
        loading={loadingReadings}
        onRefresh={fetchTodaysReadings}
      />
    </div>
  );
};