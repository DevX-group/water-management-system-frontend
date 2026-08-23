import { useState, useRef, useEffect } from 'react';
import type { Inquiry } from '@/types/inquiry';
import { api } from '@/services/api';

export const useAdminInquiries = () => {
  const [inquiries, setInquiries]   = useState<Inquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter]         = useState<string>('all');
  const [search, setSearch]         = useState('');
  const [replyText, setReplyText]   = useState('');
  const [pageIndex, setPageIndex]   = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 5;

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const selectedInquiry = inquiries.find((t) => t.id === selectedId) ?? null;

  // Fetches all customer support inquiries from the backend database.
  const fetchAllInquiries = async () => {
    try {
      const response = await api.get<{ content: Inquiry[], totalPages: number, totalElements: number }>(`/inquiries/paginated?page=${pageIndex}&size=${itemsPerPage}`);
      setInquiries(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
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
  }, [pageIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedInquiry?.messages.length]);

  // Posts an admin reply message to the currently selected inquiry chat.
 
  const sendReply = async (attachmentUrl?: string) => {
    if (!replyText.trim() && !attachmentUrl || !selectedId) return;
    const newMessage = {
      msgId: `MSG-${Date.now()}`,
      user: 'admin',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentUrl
    };
    try {
      await api.post(`/inquiries/${selectedId}/messages`, newMessage);
      setReplyText('');
      fetchAllInquiries();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // Marks a support ticket as resolved by hitting the backend PATCH endpoint.
  const resolveInquiry = async (id: string) => {
    try {
      await api.patch(`/inquiries/${id}/status?status=resolved`);
      fetchAllInquiries();
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
    pageIndex,
    totalPages,
    totalElements,
    itemsPerPage,
    messagesEndRef,
    selectedInquiry,
    setSearch,
    setFilter,
    setSelectedId,
    setPageIndex,
    setReplyText,
    sendReply,
    resolveInquiry,
    stats,
    filtered
  };
};
