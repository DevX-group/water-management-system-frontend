import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type {
  MessageChannel,
  MessageTemplate,
  RecipientType,
  ScheduleType,
  ScheduledMessage,
  TriggeredMessage,
  TriggerType,
} from '@/types/messaging';

type MessageFormMode = 'scheduled' | 'triggered';

type UseMessageFormParams = {
  initialData: ScheduledMessage | TriggeredMessage | null;
  mode: MessageFormMode;
  recipientOptions: RecipientType[];
  scheduleTypeOptions: ScheduleType[];
  triggerTypeOptions: TriggerType[];
};

const defaultScheduledMessage: ScheduledMessage = {
  id: '',
  name: '',
  channels: ['SMS'],
  schedule: { type: 'One-Time', time: '10:00', date: new Date().toISOString().split('T')[0] },
  recipients: 'All Customers',
  templates: {
    sms: { isCustom: true, sections: [], content: '' },
    email: { isCustom: true, sections: [], content: '' },
  },
  isDefault: false,
};

const defaultTriggeredMessage: TriggeredMessage = {
  id: '',
  name: '',
  channels: ['SMS', 'Email'],
  recipients: 'All Customers',
  templates: {
    sms: { isCustom: true, sections: [], content: '' },
    email: { isCustom: true, sections: [], content: '' },
  },
  isDefault: false,
  triggerType: 'PAYMENT_CONFIRMED',
  active: true,
};

const cloneMessage = <T extends ScheduledMessage | TriggeredMessage>(message: T): T => {
  return JSON.parse(JSON.stringify(message)) as T;
};

export const useMessageForm = ({
  initialData,
  mode,
  recipientOptions,
  scheduleTypeOptions,
  triggerTypeOptions,
}: UseMessageFormParams) => {
  const { toast } = useToast();
  const seed = initialData
    ? cloneMessage(initialData)
    : (mode === 'scheduled' ? defaultScheduledMessage : defaultTriggeredMessage);

  const [formData, setFormData] = useState<ScheduledMessage | TriggeredMessage>(seed);
  const [activeTab, setActiveTab] = useState<'SMS' | 'Email'>('SMS');
  const [lastFocusedInput, setLastFocusedInput] = useState<{
    sectionId: string | null;
    templateType: 'sms' | 'email';
  } | null>(null);

  const selectedScheduleType = mode === 'scheduled'
    ? (formData as ScheduledMessage).schedule?.type
    : undefined;

  useEffect(() => {
    const nextSeed = initialData
      ? cloneMessage(initialData)
      : (mode === 'scheduled' ? defaultScheduledMessage : defaultTriggeredMessage);
    setFormData(nextSeed);
    setActiveTab('SMS');
    setLastFocusedInput(null);
  }, [initialData, mode]);

  useEffect(() => {
    if (!recipientOptions.length) return;
    if (!recipientOptions.includes(formData.recipients as RecipientType)) {
      setFormData(prev => ({ ...prev, recipients: recipientOptions[0] }));
    }
  }, [recipientOptions, formData.recipients]);

  useEffect(() => {
    if (mode !== 'scheduled' || !scheduleTypeOptions.length) return;
    if (!scheduleTypeOptions.includes(selectedScheduleType as ScheduleType)) {
      setFormData(prev => ({
        ...(prev as ScheduledMessage),
        schedule: { ...(prev as ScheduledMessage).schedule, type: scheduleTypeOptions[0] },
      }));
    }
  }, [mode, scheduleTypeOptions, selectedScheduleType]);

  useEffect(() => {
    // Keep the default triggerType in sync with what the backend exposes.
    if (mode !== 'triggered' || !triggerTypeOptions.length) return;
    const current = (formData as TriggeredMessage).triggerType;
    if (!triggerTypeOptions.includes(current as TriggerType)) {
      setFormData(prev => ({
        ...(prev as TriggeredMessage),
        triggerType: triggerTypeOptions[0],
      } as TriggeredMessage));
    }
  }, [mode, triggerTypeOptions]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScheduleChange = (field: string, value: unknown) => {
    if (mode !== 'scheduled') return;
    const scheduled = formData as ScheduledMessage;
    setFormData({ ...scheduled, schedule: { ...scheduled.schedule, [field]: value } });
  };

  const handleTriggeredChange = (field: 'triggerType' | 'active', value: unknown) => {
    if (mode !== 'triggered') return;
    const triggered = formData as TriggeredMessage;
    setFormData({ ...triggered, [field]: value } as TriggeredMessage);
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
        const newSections = sections.map(section => {
          if (section.id === lastFocusedInput.sectionId) {
            return { ...section, content: section.content + `{${placeholder}}` };
          }
          return section;
        });
        updateTemplate(templateType, { sections: newSections });
      } else {
        toast({ description: 'Please click on a text area first.' });
      }
    }
  };

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    lastFocusedInput,
    setLastFocusedInput,
    handleInputChange,
    handleScheduleChange,
    handleTriggeredChange,
    handleChannelChange,
    updateTemplate,
    moveSection,
    insertPlaceholder,
  };
};
