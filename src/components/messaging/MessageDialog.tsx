import '@/index.css';
import React, { useState, useEffect } from 'react';
import { PlusCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type {
  ScheduledMessage, TriggeredMessage, TriggerType,
  MessageChannel, MessageTemplate,
} from '@/types/messaging';
import { replacePlaceholders } from '@/utils/messagingUtils';

interface MessageDialogProps {
  isOpen:      boolean;
  mode:        'scheduled' | 'triggered';
  onClose:     () => void;
  initialData: ScheduledMessage | TriggeredMessage | null;
  onSave:      (m: ScheduledMessage | TriggeredMessage) => void;
  placeholders: string[];
}

const defaultScheduledMessage: ScheduledMessage = {
  id: '',
  name: '',
  channels: ['SMS'],
  schedule: { type: 'One-Time', time: '10:00', date: new Date().toISOString().split('T')[0] },
  recipients: 'All Customers',
  templates: {
    sms:   { isCustom: true, sections: [], content: '' },
    email: { isCustom: true, sections: [], content: '' },
  },
  isDefault: false,
};

const defaultTriggeredMessage: TriggeredMessage = {
  id: '',
  name: '',
  channels: ['SMS'],
  recipients: 'All Customers',
  templates: {
    sms:   { isCustom: true, sections: [], content: '' },
    email: { isCustom: true, sections: [], content: '' },
  },
  isDefault: false,
  triggerType: 'PAYMENT_CONFIRMED',
  active: true,
};

export const MessageDialog: React.FC<MessageDialogProps> = ({
  isOpen, mode, onClose, initialData, onSave, placeholders,
}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<ScheduledMessage | TriggeredMessage>(
    initialData ? JSON.parse(JSON.stringify(initialData)) : (mode === 'scheduled' ? defaultScheduledMessage : defaultTriggeredMessage)
  );
  const [activeTab, setActiveTab]             = useState<'SMS' | 'Email'>('SMS');
  const [lastFocusedInput, setLastFocusedInput] = useState<{
    sectionId: string | null;
    templateType: 'sms' | 'email';
  } | null>(null);

  useEffect(() => {
    const seed = initialData
      ? JSON.parse(JSON.stringify(initialData))
      : (mode === 'scheduled' ? defaultScheduledMessage : defaultTriggeredMessage);
    setFormData(seed);
    setActiveTab('SMS');
    setLastFocusedInput(null);
  }, [initialData, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScheduleChange = (field: string, value: any) => {
    if (mode !== 'scheduled') return;
    const scheduled = formData as ScheduledMessage;
    setFormData({ ...scheduled, schedule: { ...scheduled.schedule, [field]: value } });
  };

  const handleTriggeredChange = (field: 'triggerType' | 'active', value: any) => {
    if (mode !== 'triggered') return;
    const triggered = formData as TriggeredMessage;
    setFormData({ ...triggered, [field]: value });
  };

  const handleChannelChange = (channel: MessageChannel, checked: boolean) => {
    let newChannels = [...formData.channels];
    if (checked) {
      if (!newChannels.includes(channel)) newChannels.push(channel);
    } else {
      newChannels = newChannels.filter(c => c !== channel);
      if (newChannels.length === 0) newChannels = channel === 'SMS' ? ['Email'] : ['SMS'];
    }
    setFormData({ ...formData, channels: newChannels });
  };

  const updateTemplate = (type: 'sms' | 'email', updates: Partial<MessageTemplate>) => {
    setFormData({
      ...formData,
      templates: {
        ...formData.templates,
        [type]: { ...formData.templates[type], ...updates } as MessageTemplate,
      },
    });
  };

  const moveSection = (type: 'sms' | 'email', fromIndex: number, toIndex: number) => {
    const sections = [...(formData.templates[type]?.sections || [])];
    if (toIndex < 0 || toIndex >= sections.length) return;
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    updateTemplate(type, { sections });
  };

  const insertPlaceholder = (placeholder: string) => {
    const templateType = activeTab === 'SMS' ? 'sms' : 'email';
    const template = formData.templates[templateType];
    if (template?.isCustom) {
      const content = template.content || '';
      updateTemplate(templateType, { content: content + `{${placeholder}}` });
    } else {
      if (lastFocusedInput && lastFocusedInput.templateType === templateType && lastFocusedInput.sectionId) {
        const sections = template?.sections || [];
        const newSections = sections.map(s => {
          if (s.id === lastFocusedInput.sectionId) {
            return { ...s, content: s.content + `{${placeholder}}` };
          }
          return s;
        });
        updateTemplate(templateType, { sections: newSections });
      } else {
        toast({ description: 'Please click on a text area first.' });
      }
    }
  };

  const renderEditor = (type: 'sms' | 'email') => {
    const t = formData.templates[type];
    if (!t) return null;
    if (t.isCustom) {
      return (
        <Textarea
          placeholder="Type your message here..."
          value={t.content}
          onChange={(e) => updateTemplate(type, { content: e.target.value })}
          className="min-h-[200px]"
          onFocus={() => setLastFocusedInput({ sectionId: null, templateType: type })}
        />
      );
    }
    return (
      <div className="space-y-4">
        {t.sections?.map((section, idx) => (
          <div key={section.id} className="border p-2 rounded relative group">
            <div className="flex justify-between items-center mb-1">
              <Input
                className="h-6 w-1/2 text-xs font-bold border-none p-0 focus-visible:ring-0"
                value={section.name}
                onChange={(e) => {
                  const newSections = [...(t.sections || [])];
                  newSections[idx].name = e.target.value;
                  updateTemplate(type, { sections: newSections });
                }}
              />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => moveSection(type, idx, idx - 1)} disabled={idx === 0} title="Move up">
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => moveSection(type, idx, idx + 1)} disabled={idx === (t.sections?.length || 0) - 1} title="Move down">
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400"
                  onClick={() => {
                    const newSections = t.sections?.filter(s => s.id !== section.id);
                    updateTemplate(type, { sections: newSections });
                  }} title="Delete section">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Textarea
              value={section.content}
              onChange={(e) => {
                const newSections = [...(t.sections || [])];
                newSections[idx].content = e.target.value;
                updateTemplate(type, { sections: newSections });
              }}
              className="text-sm min-h-[60px]"
              onFocus={() => setLastFocusedInput({ sectionId: section.id, templateType: type })}
            />
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full border-dashed"
          onClick={() => {
            const newSections = [...(t.sections || []), { id: Date.now().toString(), name: 'New Section', content: '' }];
            updateTemplate(type, { sections: newSections });
          }}>
          <PlusCircle className="mr-2 h-3 w-3" /> Add Section
        </Button>
      </div>
    );
  };

  const renderPreview = (type: 'sms' | 'email') => {
    const t = formData.templates[type];
    if (!t) return <div className="text-muted-foreground italic">No template configured</div>;
    if (t.isCustom) {
      return (
        <div>
          {type === 'email' && t.subject && (
            <div className="mb-3 pb-2 border-b">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Subject: </span>
              <span className="font-semibold text-sm">{replacePlaceholders(t.subject)}</span>
            </div>
          )}
          <div className="whitespace-pre-wrap">{replacePlaceholders(t.content || '')}</div>
        </div>
      );
    }
    return (
      <div>
        {type === 'email' && t.subject && (
          <div className="mb-3 pb-2 border-b">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Subject: </span>
            <span className="font-semibold text-sm">{replacePlaceholders(t.subject)}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap space-y-2">
          {t.sections?.map(s => (
            <div key={s.id}>{replacePlaceholders(s.content)}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-full flex flex-col p-0 gap-0">
        <div className="flex-none p-6 pb-2 border-b">
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Message' : 'Create New Message'}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          <Tabs defaultValue="details" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 flex-none">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#161E54] data-[state=active]:text-white">Message Details</TabsTrigger>
              <TabsTrigger value="template" className="data-[state=active]:bg-[#161E54] data-[state=active]:text-white">Template Editor</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="py-4 flex-none">
              <div className="space-y-4 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Message Name</Label>
                  <Input id="name" value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Monthly Bill" />
                </div>

                <div className="space-y-2">
                  <Label>Send As</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="chk-sms" checked={formData.channels.includes('SMS')}
                        onCheckedChange={(c) => handleChannelChange('SMS', c as boolean)} />
                      <Label htmlFor="chk-sms">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="chk-email" checked={formData.channels.includes('Email')}
                        onCheckedChange={(c) => handleChannelChange('Email', c as boolean)} />
                      <Label htmlFor="chk-email">Email</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select value={formData.recipients} onValueChange={(val) => handleInputChange('recipients', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Customers">All Customers</SelectItem>
                      <SelectItem value="Overdue Customers">Overdue Customers</SelectItem>
                      <SelectItem value="Selected Customers">Selected Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {mode === 'scheduled' && (
                  <>
                    <div className="space-y-2">
                      <Label>Schedule Type</Label>
                      <Select value={(formData as ScheduledMessage).schedule.type}
                        onValueChange={(val) => handleScheduleChange('type', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Recurring">Recurring</SelectItem>
                          <SelectItem value="One-Time">One-Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(formData as ScheduledMessage).schedule.type === 'Recurring' ? (
                      <div className="space-y-2">
                        <Label>Day of Month</Label>
                        <Select value={(formData as ScheduledMessage).schedule.dayOfMonth?.toString()}
                          onValueChange={(val) => handleScheduleChange('dayOfMonth', parseInt(val))}>
                          <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                          <SelectContent className="max-h-48">
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                              <SelectItem key={d} value={d.toString()}>{d}th of every month</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={(formData as ScheduledMessage).schedule.date}
                          onChange={(e) => handleScheduleChange('date', e.target.value)} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input type="time" value={(formData as ScheduledMessage).schedule.time}
                        onChange={(e) => handleScheduleChange('time', e.target.value)} />
                    </div>
                  </>
                )}

                {mode === 'triggered' && (
                  <>
                    <div className="space-y-2">
                      <Label>Trigger Type</Label>
                      <Select value={(formData as TriggeredMessage).triggerType}
                        onValueChange={(val) => handleTriggeredChange('triggerType', val as TriggerType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAYMENT_CONFIRMED">Payment Confirmed</SelectItem>
                          <SelectItem value="EMAIL_VERIFICATION">Email Verification</SelectItem>
                          <SelectItem value="PHONE_VERIFICATION">Phone Verification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <Label htmlFor="trigger-active" className="text-sm font-medium">Active</Label>
                        <div className="text-xs text-muted-foreground">Whether this trigger is enabled.</div>
                      </div>
                      <Switch id="trigger-active"
                        checked={(formData as TriggeredMessage).active}
                        onCheckedChange={(chk) => handleTriggeredChange('active', chk)} />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="template" className="py-4 flex-1 min-h-0 flex flex-col">
              <div className="flex flex-col border rounded-md bg-card h-full">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'SMS' | 'Email')} className="flex flex-col flex-1 min-h-0">
                  <div className="bg-slate-50 p-2 border-b flex justify-between items-center flex-none">
                    <TabsList>
                      <TabsTrigger value="SMS" disabled={!formData.channels.includes('SMS')}>SMS</TabsTrigger>
                      <TabsTrigger value="Email" disabled={!formData.channels.includes('Email')}>Email</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="custom-mode" className="text-xs">Custom Mode</Label>
                      <Switch id="custom-mode"
                        checked={formData.templates[activeTab === 'SMS' ? 'sms' : 'email']?.isCustom}
                        onCheckedChange={(chk) => updateTemplate(activeTab === 'SMS' ? 'sms' : 'email', { isCustom: chk })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-card flex-1 overflow-y-auto">
                    {/* Editor */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Placeholders (Click to copy/insert)</Label>
                        <div className="flex flex-wrap gap-2">
                          {placeholders.length === 0 ? (
                            <div className="text-xs text-muted-foreground">No placeholders available.</div>
                          ) : (
                            placeholders.map(p => (
                              <Button key={p} variant="outline" size="sm"
                                onClick={() => insertPlaceholder(p)} className="h-6 text-[10px] px-2">
                                {p}
                              </Button>
                            ))
                          )}
                        </div>
                      </div>
                      {activeTab === 'Email' && (
                        <div className="space-y-2">
                          <Label htmlFor="email-subject" className="text-xs font-medium">Subject</Label>
                          <Input id="email-subject" placeholder="e.g. Your Monthly Water Bill"
                            value={formData.templates.email?.subject || ''}
                            onChange={(e) => updateTemplate('email', { subject: e.target.value })} />
                        </div>
                      )}
                      <div className="h-[300px] border rounded-md p-2">
                        <TabsContent value="SMS" className="mt-0 h-full">
                          <ScrollArea className="h-full">{renderEditor('sms')}</ScrollArea>
                        </TabsContent>
                        <TabsContent value="Email" className="mt-0 h-full">
                          <ScrollArea className="h-full">{renderEditor('email')}</ScrollArea>
                        </TabsContent>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="border rounded-md bg-stone-50 p-4 h-[440px] flex flex-col">
                      <Label className="mb-2 block text-muted-foreground flex-none">{activeTab} Preview</Label>
                      <div className="bg-card p-4 rounded shadow-sm border text-sm flex-1 overflow-y-auto w-full break-words">
                        {renderPreview(activeTab === 'SMS' ? 'sms' : 'email')}
                      </div>
                    </div>
                  </div>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-none p-6 pt-2 border-t mt-auto">
          <DialogFooter>
            <Button variant="outline" onClick={onClose} className="border-[#168D9C] text-[#168D9C] hover:bg-[#168D9C] hover:text-white">Cancel</Button>
            <Button onClick={() => onSave(formData)} className="bg-[#168D9C] hover:bg-[#127a87] text-white">Save Message</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
