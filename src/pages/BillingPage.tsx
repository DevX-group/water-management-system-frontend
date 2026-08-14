import '@/index.css';
import React from 'react';
import { Calculator, FileText, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '@/contexts/AdminContext';
import { useBilling } from '@/hooks/useBilling';
import { calculateBill, TYPE_META } from '@/utils/billingUtils';
import { BillCalculatorCard } from '@/components/billing/BillCalculatorCard';
import { BillBreakdownCard } from '@/components/billing/BillBreakdownCard';
import { RateCard } from '@/components/billing/RateCard';
import { BillSearchResults } from '@/components/billing/BillSearchResults';

export const BillingPage = () => {
  const { currentAdmin } = useAdmin();
  const billing = useBilling();
  const { t } = useTranslation('billing');
  const bill = calculateBill(billing.selectedRate, billing.selectedType, billing.usage);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-3">
        {(['calculator', 'view_bills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => billing.setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              billing.activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/50 text-foreground hover:bg-secondary'
            }`}
          >
            {tab === 'calculator' ? <Calculator className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {tab === 'calculator' ? t('tabs.calculator') : t('tabs.viewBills')}
          </button>
        ))}
      </div>

      {/* Calculator Tab */}
      {billing.activeTab === 'calculator' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: calculator + breakdown */}
            <div className="space-y-6">
              <BillCalculatorCard
                selectedType={billing.selectedType}
                setSelectedType={billing.setSelectedType}
                usage={billing.usage}
                setUsage={billing.setUsage}
                selectedRate={billing.selectedRate}
              />
              <BillBreakdownCard
                selectedType={billing.selectedType}
                selectedRate={billing.selectedRate}
                usage={billing.usage}
                bill={bill}
              />
            </div>
            
            {currentAdmin.role === 'SUPER_ADMIN' && (
              <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{t('manageRates')}</h3>
                </div>
                <div className="space-y-4">
                  {(['metered', 'non_metered'] as const).map((type) => (
                    <RateCard
                      key={type}
                      type={type}
                      rates={billing.rates}
                      editingType={billing.editingType}
                      editDraft={billing.editDraft}
                      onStartEdit={billing.startEditing}
                      onCancelEdit={billing.cancelEditing}
                      onSetDraft={billing.setDraftField}
                      onSave={(t) => billing.handleSaveRates(t, TYPE_META[t])}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Bills Tab */}
      {billing.activeTab === 'view_bills' && (
        <BillSearchResults
          searchQuery={billing.searchQuery}
          setSearchQuery={billing.setSearchQuery}
          loadingBills={billing.loadingBills}
          hasSearched={billing.hasSearched}
          searchedSub={billing.searchedSub}
          bills={billing.bills}
          billIndex={billing.billIndex}
          setBillIndex={billing.setBillIndex}
          billsPerPage={billing.billsPerPage}
          onSearch={billing.handleSearch}
          onDownload={billing.handleDownload}
        />
      )}
    </div>
  );
};
