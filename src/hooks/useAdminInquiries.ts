import { useState, useRef, useEffect } from 'react';
import type { Inquiry } from '@/types/inquiry';

const API_BASE_URL = 'http://localhost:8081/api/inquiries';

export const useAdminInquiries = () => {
  const [inquiries, setInquiries]   = useState<Inquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter]         = useState<string>('all');
  const [search, setSearch]         = useState('');
  const [replyText, setReplyText]   = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const selectedInquiry = inquiries.find((t) => t.id === selectedId) ?? null;

  const fetchAllInquiries = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInquiries();
    const interval = setInterval(fetchAllInquiries, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedInquiry?.messages.length]);

  const sendReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    const newMessage = {
      msgId: `MSG-${Date.now()}`,
      user: 'admin',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      if (response.ok) {
        setReplyText('');
        fetchAllInquiries();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const resolveInquiry = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status?status=resolved`, { method: 'PATCH' });
      if (response.ok) fetchAllInquiries();
    } catch (error) {
      console.error('Error resolving inquiry:', error);
    }
  };

  const stats = {
    total:    inquiries.length,
    open:     inquiries.filter((t) => t.status === 'open').length,
    pending:  inquiries.filter((t) => t.status === 'pending').length,
    resolved: inquiries.filter((t) => t.status === 'resolved').length,
  };

  const filtered = inquiries.filter((t) => {
    const matchStatus = filter === 'all' || t.status === filter;
    const q = search.toLowerCase();
    return matchStatus && (t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  });

  return {
    inquiries,
    loading,
    selectedId,
    filter,
    search,
    replyText,
    currentIndex,
    itemsPerPage,
    messagesEndRef,
    selectedInquiry,
    setSearch,
    setFilter,
    setSelectedId,
    setCurrentIndex,
    setReplyText,
    sendReply,
    resolveInquiry,
    stats,
    filtered
  };
};
