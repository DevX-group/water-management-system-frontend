import '@/index.css';
import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import type {
  MessagingEnumResponse,
  RecipientType,
  ScheduleType,
  ScheduledMessage,
  TriggeredMessage,
  TriggerType,
  MessageChannel,
} from '@/types/messaging';
import { TemplateEditor } from './TemplateEditor';
import { useMessageForm } from '../../hooks/useMessageForm';

interface MessageDialogProps {
  isOpen:      boolean;
  mode:        'scheduled' | 'triggered';
  onClose:     () => void;
  initialData: ScheduledMessage | TriggeredMessage | null;
  onSave:      (m: ScheduledMessage | TriggeredMessage) => void;
  enumOptions?: MessagingEnumResponse | null;
}

export const MessageDialog: React.FC<MessageDialogProps> = ({
  isOpen, mode, onClose, initialData, onSave, enumOptions,
}) => {
  const channelOptions: MessageChannel[] = (enumOptions?.channels?.length
    ? enumOptions.channels
    : ['SMS', 'Email']);
  const recipientOptions: RecipientType[] = (enumOptions?.recipientTypes?.length
    ? enumOptions.recipientTypes
    : ['All Customers', 'Overdue Customers']);
  const scheduleTypeOptions: ScheduleType[] = (enumOptions?.scheduleTypes?.length
    ? enumOptions.scheduleTypes
    : ['Recurring', 'One-Time']);
  const triggerTypeOptions: TriggerType[] = (enumOptions?.triggerTypes?.length
    ? enumOptions.triggerTypes
    : ['PAYMENT_CONFIRMED', 'EMAIL_VERIFICATION', 'PHONE_VERIFICATION']);
  const placeholders = enumOptions?.placeholders ?? [];
  const {
    formData,
    activeTab,
    setActiveTab,
    setLastFocusedInput,
    handleInputChange,
    handleScheduleChange,
    handleTriggeredChange,
    handleChannelChange,
    updateTemplate,
    moveSection,
    insertPlaceholder,
  } = useMessageForm({
    initialData,
    mode,
    recipientOptions,
    scheduleTypeOptions,
    triggerTypeOptions,
  });

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
                    {channelOptions.map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox id={`chk-${channel.toLowerCase()}`} checked={formData.channels.includes(channel)}
                          onCheckedChange={(c) => handleChannelChange(channel, c as boolean)} />
                        <Label htmlFor={`chk-${channel.toLowerCase()}`}>{channel}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select value={formData.recipients} onValueChange={(val) => handleInputChange('recipients', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {recipientOptions.map((recipient) => (
                        <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
                      ))}
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
                          {scheduleTypeOptions.map((scheduleType) => (
                            <SelectItem key={scheduleType} value={scheduleType}>{scheduleType}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(formData as ScheduledMessage).schedule.type === 'Recurring' ? (
                      <div className="space-y-2">
                        <Label>Recurring Day of Each Month</Label>
                        <Select value={(formData as ScheduledMessage).schedule.dayOfMonth?.toString()}
                          onValueChange={(val) => handleScheduleChange('dayOfMonth', parseInt(val))}>
                          <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                          <SelectContent className="max-h-48">
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                              <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
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
                          {triggerTypeOptions.map((trigger) => (
                            <SelectItem key={trigger} value={trigger}>
                              {trigger.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                            </SelectItem>
                          ))}
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
              <TemplateEditor
                formData={formData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                placeholders={placeholders}
                onInsertPlaceholder={insertPlaceholder}
                onUpdateTemplate={updateTemplate}
                onMoveSection={moveSection}
                onFocusSection={setLastFocusedInput}
              />
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
