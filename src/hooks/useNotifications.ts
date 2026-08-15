import { useState, useEffect } from 'react';
import type { Notification } from '@/types/notification';
import { api } from '@/services/api';

export const useNotifications = () => {
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  // Retrieves  system alerts and notifications from the backend API.
 
  const fetchAlerts = async () => {
    try {
      const res = await api.get<Notification[]>('/alerts');
      setAlerts(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  // Dismisses a specific alert by ID 
  
  const handleDismiss = async (id: number) => {
    try {
      await api.patch(`/alerts/${id}/dismiss`);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const counts = {
    critical: alerts.filter(a => a.severity.toLowerCase() === "critical").length,
    high:     alerts.filter(a => a.severity.toLowerCase() === "high").length,
    medium:   alerts.filter(a => a.severity.toLowerCase() === "medium").length,
    info:     alerts.filter(a => a.severity.toLowerCase() === "info").length,
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.severity.toLowerCase() === filter);

  return {
    alerts,
    filter,
    loading,
    currentIndex,
    itemsPerPage,
    setFilter,
    setCurrentIndex,
    handleDismiss,
    counts,
    filteredAlerts,
    fetchAlerts
  };
};
