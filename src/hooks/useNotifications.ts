import { useState, useEffect } from 'react';
import type { Notification } from '@/types/notification';

export const useNotifications = () => {
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDismiss = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/alerts/${id}/dismiss`, { method: 'PATCH' });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
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
