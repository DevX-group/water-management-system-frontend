import '@/index.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import {
  Check,
  CheckCheck,
  ChevronUp,
  CircleAlert,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { internalChatService } from '@/services/internalChatService';
import { InternalChatSocket, type InternalChatSocketState } from '@/services/internalChatSocket';
import type { AdminRole } from '@/types/admin';
import type {
  ConversationSummary,
  InternalChatMessage,
  InternalChatReadReceipt,
  InternalChatRoleFilter,
  InternalChatUser,
} from '@/types/internalChat';

const ROLE_TABS: Array<{ value: InternalChatRoleFilter; label: string }> = [
  { value: 'ALL', label: 'All staff' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'SYSTEM_ADMIN', label: 'System Admin' },
  { value: 'CUSTOMER_HANDLER', label: 'Customer Handler' },
  { value: 'METER_READER', label: 'Meter Reader' },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  SYSTEM_ADMIN: 'System Admin',
  CUSTOMER_HANDLER: 'Customer Handler',
  //PAYMENT_HANDLER: 'Customer Handler',
  METER_READER: 'Meter Reader',
};

const PAGE_SIZE = 30;

const getRoleLabel = (role: AdminRole) => ROLE_LABELS[role] ?? role;

const getInitials = (name?: string | null) => (name || 'Admin')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('');

const formatMessageTime = (value: string) => {
  const date = new Date(value);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, h:mm a');
};

const formatConversationTime = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return isToday(date) ? format(date, 'h:mm a') : format(date, 'MMM d');
};

const mergeMessage = (messages: InternalChatMessage[], incoming: InternalChatMessage) => {
  if (messages.some((message) => message.id === incoming.id)) return messages;
  return [...messages, incoming].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
};

export const InternalChatPage = () => {
  const { toast } = useToast();
  const [roleFilter, setRoleFilter] = useState<InternalChatRoleFilter>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [staff, setStaff] = useState<InternalChatUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<InternalChatMessage[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending] = useState(false);
  const [composer, setComposer] = useState('');
  const [messagePage, setMessagePage] = useState(0);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [socketState, setSocketState] = useState<InternalChatSocketState>('DISCONNECTED');
  const selectedConversationRef = useRef<ConversationSummary | null>(null);
  const filtersRef = useRef<{ role?: AdminRole; search: string }>({ search: '' });
  const socketRef = useRef<InternalChatSocket | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const selectedRole = roleFilter === 'ALL' ? undefined : roleFilter;
  const selectedConversationId = selectedConversation?.id;

  filtersRef.current = { role: selectedRole, search: debouncedSearch };

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    Promise.allSettled([
      internalChatService.listConversations({ role: selectedRole, search: debouncedSearch }),
      internalChatService.findStaff({ role: selectedRole, search: debouncedSearch }),
    ])
      .then(([conversationResult, staffResult]) => {
        if (cancelled) return;
        if (conversationResult.status === 'fulfilled') {
          setConversations(conversationResult.value);
          setSelectedConversation((current) => {
            if (!current) return null;
            return conversationResult.value.find((conversation) => conversation.id === current.id) ?? current;
          });
        }
        if (staffResult.status === 'fulfilled') setStaff(staffResult.value);
        if (conversationResult.status === 'rejected' && staffResult.status === 'rejected') {
          toast({ title: 'Unable to load chat', description: 'Please try again.', variant: 'destructive' });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => { cancelled = true; };
  }, [debouncedSearch, selectedRole, toast]);

  useEffect(() => {
    // REST remains the source of truth when a broker user-destination frame is missed.
    const reconcile = async () => {
      try {
        const conversationData = await internalChatService.listConversations(filtersRef.current);
        setConversations(conversationData);
        setSelectedConversation((current) => current
          ? conversationData.find((conversation) => conversation.id === current.id) ?? current
          : current);
      } catch {
        // Background reconciliation must not erase usable data or interrupt search.
      }
    };

    const interval = window.setInterval(() => void reconcile(), 3000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    const socket = new InternalChatSocket();
    socketRef.current = socket;
    socket.connect(setSocketState, (frame) => {
      try {
        const payload = JSON.parse(frame.body) as Partial<InternalChatMessage & InternalChatReadReceipt>;
        if (payload.readerId && payload.readAt && payload.conversationId) {
          const receipt = payload as InternalChatReadReceipt;
          setMessages((current) => current.map((message) => (
            message.conversationId === receipt.conversationId && message.senderId !== receipt.readerId
              ? { ...message, read: true }
              : message
          )));
          return;
        }

        const incoming = payload as InternalChatMessage;
        // Every saved message can create a conversation for the recipient, so refresh the
        // filtered list even when no conversation is currently selected.
        if (incoming.conversationId) {
          void internalChatService.listConversations(filtersRef.current)
            .then((conversationData) => {
              setConversations(conversationData);
              setSelectedConversation((current) => current
                ? conversationData.find((conversation) => conversation.id === current.id) ?? current
                : current);
            })
            .catch(() => undefined);
        }
        const openConversation = selectedConversationRef.current;
        if (!openConversation || incoming.conversationId !== openConversation.id) return;

        setMessages((current) => mergeMessage(current, incoming));
        setConversations((current) => current.map((conversation) => (
          conversation.id === incoming.conversationId
            ? {
                ...conversation,
                latestMessagePreview: incoming.content,
                latestMessageTime: incoming.createdAt,
                unreadCount: 0,
              }
            : conversation
        )));
        void internalChatService.markAsRead(incoming.conversationId);
      } catch {
        toast({ title: 'Message update failed', description: 'A real-time message could not be read.', variant: 'destructive' });
      }
    }, () => {
      socket.subscribeUserQueue();
      socket.subscribeReadQueue();
      if (selectedConversationRef.current?.id) {
        socket.subscribe(selectedConversationRef.current.id);
      }
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [toast]);

  useEffect(() => {
    if (socketState !== 'CONNECTED') return;
    socketRef.current?.subscribeUserQueue();
    socketRef.current?.subscribeReadQueue();
    if (selectedConversationId) socketRef.current?.subscribe(selectedConversationId);
  }, [selectedConversationId, socketState]);

  useEffect(() => {
    if (!selectedConversationId) return;
    setLoadingMessages(true);
    setMessagePage(0);
    setHasOlderMessages(false);
    internalChatService.getMessages(selectedConversationId, 0, PAGE_SIZE)
      .then((data) => {
        if (selectedConversationRef.current?.id !== selectedConversationId) return;
        setMessages(data);
        setHasOlderMessages(data.length === PAGE_SIZE);
        void internalChatService.markAsRead(selectedConversationId);
        setConversations((current) => current.map((conversation) => (
          conversation.id === selectedConversationId ? { ...conversation, unreadCount: 0 } : conversation
        )));
      })
      .catch(() => toast({ title: 'Unable to load messages', description: 'Please try again.', variant: 'destructive' }))
      .finally(() => setLoadingMessages(false));
  }, [selectedConversationId, toast]);

  useEffect(() => {
    if (!selectedConversationId) return;

    // Reconcile the open thread so read receipts update even if the STOMP receipt
    // was missed by the browser or the recipient opened the conversation elsewhere.
    const reconcileMessages = async () => {
      try {
        const data = await internalChatService.getMessages(selectedConversationId, 0, PAGE_SIZE);
        if (selectedConversationRef.current?.id !== selectedConversationId) return;
        setMessages((current) => {
          const olderMessages = current.filter((message) => !data.some((item) => item.id === message.id));
          return [...olderMessages, ...data].sort(
            (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
          );
        });
      } catch {
        // The active thread remains usable during a temporary background failure.
      }
    };

    const interval = window.setInterval(() => void reconcileMessages(), 3000);
    return () => window.clearInterval(interval);
  }, [selectedConversationId]);

  const loadOlderMessages = async () => {
    if (!selectedConversationId || loadingOlder || !hasOlderMessages) return;
    const list = messageListRef.current;
    const previousHeight = list?.scrollHeight ?? 0;
    setLoadingOlder(true);
    try {
      const nextPage = messagePage + 1;
      const older = await internalChatService.getMessages(selectedConversationId, nextPage, PAGE_SIZE);
      setMessages((current) => [...older, ...current.filter((message) => !older.some((item) => item.id === message.id))]);
      setMessagePage(nextPage);
      setHasOlderMessages(older.length === PAGE_SIZE);
      requestAnimationFrame(() => {
        if (list) list.scrollTop = list.scrollHeight - previousHeight;
      });
    } catch {
      toast({ title: 'Unable to load older messages', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoadingOlder(false);
    }
  };

  const selectConversation = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setMessages([]);
  };

  const startConversation = async (user: InternalChatUser) => {
    try {
      const conversation = await internalChatService.createConversation({ targetUserId: user.id });
      setConversations((current) => [conversation, ...current.filter((item) => item.id !== conversation.id)]);
      setSelectedConversation(conversation);
      setSearch('');
    } catch {
      toast({ title: 'Unable to start conversation', description: 'This staff member may no longer be available.', variant: 'destructive' });
    }
  };

  const sendMessage = async () => {
    const content = composer.trim();
    if (!selectedConversationId || !content || sending) return;
    setSending(true);
    try {
      const sent = await internalChatService.sendMessage(selectedConversationId, { content });
      setMessages((current) => mergeMessage(current, sent));
      setConversations((current) => current.map((conversation) => (
        conversation.id === selectedConversationId
          ? { ...conversation, latestMessagePreview: sent.content, latestMessageTime: sent.createdAt, unreadCount: 0 }
          : conversation
      )));
      setComposer('');
    } catch {
      toast({ title: 'Message was not sent', description: 'Check your connection and try again.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const emptyConversationText = useMemo(() => {
    if (debouncedSearch.trim()) return 'No conversations match this search.';
    if (roleFilter !== 'ALL') return `No conversations with ${getRoleLabel(roleFilter)}s.`;
    return 'No conversations yet. Search for an admin to start one.';
  }, [debouncedSearch, roleFilter]);

  return (
    <div className="space-y-5 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-4 w-4" /> Staff workspace
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Internal Admin Chat</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">A focused channel for quick coordination across the water management team.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {socketState === 'CONNECTED' ? <Wifi className="h-3.5 w-3.5 text-emerald-600" /> : <WifiOff className="h-3.5 w-3.5" />}
          {socketState === 'CONNECTED' ? 'Live connection' : socketState === 'CONNECTING' ? 'Connecting' : 'Offline mode'}
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-muted/35 px-3 py-3 sm:px-5">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setRoleFilter(tab.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${roleFilter === tab.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid min-h-[620px] lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-b border-border bg-muted/15 lg:border-b-0 lg:border-r">
            <div className="border-b border-border p-4 sm:p-5">
              <label htmlFor="chat-search" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Find a colleague</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="chat-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name" className="h-11 rounded-xl bg-background pl-9" />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversations</h2>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              {loadingList ? (
                <div className="space-y-2">{[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-muted" />)}</div>
              ) : conversations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{emptyConversationText}</div>
              ) : (
                <div className="space-y-1.5">
                  {conversations.map((conversation) => (
                    <button key={conversation.id} type="button" onClick={() => selectConversation(conversation)} className={`w-full rounded-xl p-3 text-left transition ${selectedConversationId === conversation.id ? 'bg-primary/10 ring-1 ring-primary/25' : 'hover:bg-background'}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">{getInitials(conversation.otherParticipantName)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold text-foreground">{conversation.otherParticipantName}</p>
                            <span className="shrink-0 text-[10px] text-muted-foreground">{formatConversationTime(conversation.latestMessageTime)}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] font-semibold text-primary">{getRoleLabel(conversation.otherParticipantRole)}</p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="truncate text-xs text-muted-foreground">{conversation.latestMessagePreview || 'No messages yet'}</p>
                            {conversation.unreadCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">{conversation.unreadCount}</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mb-3 mt-7 flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Staff directory</h2>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              {staff.length === 0 ? (
                <p className="px-1 text-sm text-muted-foreground">No admins found.</p>
              ) : (
                <div className="space-y-1.5">
                  {staff.map((user) => (
                    <button key={user.id} type="button" onClick={() => void startConversation(user)} className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-background">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">{getInitials(user.fullName)}</div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.fullName}</p><p className="text-[11px] text-muted-foreground">{getRoleLabel(user.role)}</p></div>
                      <ChevronUp className="h-4 w-4 rotate-90 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-[620px] min-w-0 flex-col bg-background">
            {selectedConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
                  <div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-bold text-white">{getInitials(selectedConversation.otherParticipantName)}</div><div className="min-w-0"><h2 className="truncate font-bold">{selectedConversation.otherParticipantName}</h2><p className="text-xs text-muted-foreground">{getRoleLabel(selectedConversation.otherParticipantRole)} <span className="mx-1">·</span> Direct conversation</p></div></div>
                  <Button variant="ghost" size="icon" aria-label="Conversation options"><MoreHorizontal className="h-5 w-5" /></Button>
                </div>
                <div ref={messageListRef} className="flex-1 overflow-y-auto px-5 py-5 sm:px-8">
                  {hasOlderMessages && <div className="mb-4 text-center"><Button variant="outline" size="sm" onClick={() => void loadOlderMessages()} disabled={loadingOlder}><ChevronUp className="h-4 w-4" />{loadingOlder ? 'Loading older messages' : 'Load older messages'}</Button></div>}
                  {loadingMessages ? <div className="space-y-3"><div className="h-12 w-2/3 animate-pulse rounded-2xl bg-muted" /><div className="ml-auto h-12 w-1/2 animate-pulse rounded-2xl bg-primary/10" /></div> : messages.length === 0 ? <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"><div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary"><MessageCircle className="h-8 w-8" /></div><h3 className="font-bold">Start the conversation</h3><p className="mt-1 text-sm text-muted-foreground">Send a message to {selectedConversation.otherParticipantName}.</p></div> : <div className="space-y-3">{messages.map((message) => { const mine = message.senderId !== selectedConversation.otherParticipantId; return <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[min(78%,540px)] ${mine ? 'items-end' : 'items-start'} flex flex-col`}><div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border border-border bg-card text-foreground'}`}>{message.content}</div><div className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground"><span>{mine ? 'You' : message.senderName}</span><span>·</span><span>{formatMessageTime(message.createdAt)}</span>{mine && (message.read ? <CheckCheck className="h-3 w-3 text-primary" aria-label="Read" /> : <Check className="h-3 w-3" aria-label="Sent" />)}</div></div></div>; })}</div>}
                </div>
                <div className="border-t border-border bg-card p-4 sm:p-5"><div className="flex items-end gap-2"><Input value={composer} maxLength={2000} onChange={(event) => setComposer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Type a message..." className="min-h-11 rounded-xl bg-background" /><Button type="button" size="icon" aria-label="Send message" disabled={!composer.trim() || sending} onClick={() => void sendMessage()}><Send className="h-4 w-4" /></Button></div><div className="mt-1 flex justify-between px-1 text-[10px] text-muted-foreground"><span>Press Enter to send</span><span>{composer.length}/2000</span></div></div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center"><div className="mb-5 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/20 p-5 text-primary"><MessageCircle className="h-10 w-10" /></div><h2 className="text-xl font-bold">Your team, in sync</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Choose a conversation or find a colleague in the staff directory to begin.</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><CircleAlert className="h-4 w-4" />Messages are saved securely in the system.</div></div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default InternalChatPage;
