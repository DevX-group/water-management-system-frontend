import { useState, useRef, useEffect } from 'react';
import type { InquiryFormData, InquiryFormErrors } from '@/types/inquiry';
import { useInquiry, useInquiries } from '@/hooks/useInquiries';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'http://localhost:8081/api/inquiries';

export const useCustomerInquiryPage = () => {
  const [form, setForm] = useState<InquiryFormData>({ name: '', email: '', category: '', message: '' });
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  const [historyIndex, setHistoryIndex] = useState(0);
  const itemsPerPage = 5;

  const { inquiry } = useInquiry(activeId, 1500);
  const { inquiries } = useInquiries(3000);
  const { inquiry: historyInquiry } = useInquiry(viewingHistoryId, 5000);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [inquiry?.messages.length, showTyping, historyInquiry?.messages.length]);

  const { t } = useTranslation('inquiry');

  const validate = (): boolean => {
    const e: InquiryFormErrors = {};
    if (!form.name.trim()) e.name = t('validation.nameRequired');
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t('validation.emailRequired');
    if (!form.message.trim()) e.message = t('validation.messageRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

 
  // Generates a local INQ ID 
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const id = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      id, 
      name: form.name.trim(), 
      email: form.email.trim(), 
      category: form.category || 'General',
      messages: [{ 
        msgId: `MSG-${Date.now()}`, 
        user: 'user', 
        text: form.message.trim(), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }],
      status: 'open'
    };
    try {
      const res = await fetch(API_BASE_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      if (res.ok) { 
        setActiveId(id); 
        setViewingHistoryId(null); 
        setForm({ name: '', email: '', category: '', message: '' }); 
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setSubmitting(false); 
    }
  };


  // Push the message to the backend which will appear on the Admin's screen.
  const sendMessage = async () => {
    if (!chatInput.trim() || !activeId) return;
    const newMsg = { 
      msgId: `MSG-${Date.now()}`, 
      user: 'user', 
      text: chatInput.trim(), 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    try {
      const res = await fetch(`${API_BASE_URL}/${activeId}/messages`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(newMsg) 
      });
      if (res.ok) setChatInput('');
    } catch (err) { 
      console.error(err); 
    }
  };

  const setFormValue = (name: keyof InquiryFormData, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return {
    form,
    errors,
    submitting,
    activeId,
    chatInput,
    showTyping,
    viewingHistoryId,
    historyIndex,
    itemsPerPage,
    inquiry,
    inquiries,
    historyInquiry,
    messagesEndRef,
    setForm,
    setErrors,
    setActiveId,
    setChatInput,
    setViewingHistoryId,
    setHistoryIndex,
    handleSubmit,
    sendMessage,
    setFormValue
  };
};
