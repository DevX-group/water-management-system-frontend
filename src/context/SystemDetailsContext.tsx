import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSystemDetails } from '@/services/systemSettingsService';
import type { SystemDetailsResponse } from '@/types/systemSettings';

interface SystemDetailsContextValue {
  systemDetails: SystemDetailsResponse | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SystemDetailsContext = createContext<SystemDetailsContextValue>({
  systemDetails: null,
  loading: true,
  refresh: async () => {},
});

export const useSystemDetails = () => useContext(SystemDetailsContext);

export const SystemDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemDetails, setSystemDetails] = useState<SystemDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getSystemDetails();
      setSystemDetails(data);
    } catch {
      // Silently fail — consumers fall back to hardcoded defaults gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDetails();
  }, []);

  return (
    <SystemDetailsContext.Provider value={{ systemDetails, loading, refresh: fetchDetails }}>
      {children}
    </SystemDetailsContext.Provider>
  );
};
