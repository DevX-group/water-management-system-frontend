import '@/index.css';
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { MeterReadingForm } from '@/components/meter-reading/MeterReadingForm';
import { MeterReadingInstructions } from '@/components/meter-reading/MeterReadingInstructions';
import { MeterReadingsTable } from '@/components/meter-reading/MeterReadingsTable';

import { useMeterReading } from '@/hooks/useMeterReading';

export const MeterReadingPage = () => {
  const {
    formData,
    todaysReadings,
    loadingReadings,
    submitting,
    isOnline,
    pendingCount,
    setFormData,
    handleSubmit,
    clearForm,
    fetchTodaysReadings
  } = useMeterReading();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meter Reading</h1>
          <p className="text-muted-foreground">Submit a water meter reading</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Network Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${isOnline
            ? 'bg-green-500/10 text-green-600 border-green-500/20'
            : 'bg-red-500/10 text-red-600 border-red-500/20'
            }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>Online</span>
                {pendingCount > 0 && <span className="ml-2 text-xs opacity-80">(Syncing {pendingCount}...)</span>}
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Offline Mode</span>
                {pendingCount > 0 && <span className="ml-2 text-xs font-bold">({pendingCount} Saved)</span>}
              </>
            )}
          </div>
        </div>
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