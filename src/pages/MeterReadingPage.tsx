import React, { useState } from 'react';
import { Gauge, Calendar, FileText, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockMeterReadings, mockCustomers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const MeterReadingPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    meterNumber: '',
    previousReading: '',
    currentReading: '',
    readingDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const usage = formData.previousReading && formData.currentReading 
    ? Math.max(0, Number(formData.currentReading) - Number(formData.previousReading))
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reading Submitted",
      description: `Meter reading for ${formData.meterNumber} has been recorded. Usage: ${usage} units`,
    });
    // Reset form
    setFormData({
      meterNumber: '',
      previousReading: '',
      currentReading: '',
      readingDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleClear = () => {
    setFormData({
      meterNumber: '',
      previousReading: '',
      currentReading: '',
      readingDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Meter Reading</h1>
        <p className="text-muted-foreground">Submit your water meter reading</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reading Form */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meterNumber">Meter Number</Label>
                <Input
                  id="meterNumber"
                  placeholder="e.g., MTR-001"
                  value={formData.meterNumber}
                  onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readingDate">Reading Date</Label>
                <Input
                  id="readingDate"
                  type="date"
                  value={formData.readingDate}
                  onChange={(e) => setFormData({ ...formData, readingDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previousReading">Previous Reading</Label>
                <Input
                  id="previousReading"
                  type="number"
                  placeholder="0"
                  value={formData.previousReading}
                  onChange={(e) => setFormData({ ...formData, previousReading: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentReading">Current Reading</Label>
                <Input
                  id="currentReading"
                  type="number"
                  placeholder="0"
                  value={formData.currentReading}
                  onChange={(e) => setFormData({ ...formData, currentReading: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Usage (units)</Label>
                <div className="h-10 px-3 py-2 rounded-lg bg-secondary flex items-center">
                  <span className="text-lg font-semibold text-primary">{usage}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any observations or issues..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={handleClear}>
                Clear form
              </Button>
              <Button type="submit">
                <Check className="w-4 h-4 mr-2" />
                Submit Reading
              </Button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">How to read your meter</h3>
          </div>
          <ul className="space-y-3">
            {[
              'Record all visible digits including zeros',
              'Ignore the red dial if present',
              'Read from left to right',
              'Take a photo for your records',
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {index + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Today's Readings */}
      <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Readings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 text-sm font-medium text-muted-foreground">Meter No.</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Previous</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Current</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Usage</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockMeterReadings.map((reading) => {
                const customer = mockCustomers.find(c => c.id === reading.customerId);
                return (
                  <tr key={reading.id} className="border-b border-border/50 last:border-0">
                    <td className="py-4 text-sm font-medium text-foreground">{reading.meterNumber}</td>
                    <td className="py-4 text-sm text-foreground">{customer?.name || '-'}</td>
                    <td className="py-4 text-sm text-muted-foreground">{reading.previousReading}</td>
                    <td className="py-4 text-sm text-muted-foreground">{reading.currentReading}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {reading.usage} units
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{reading.readingDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};