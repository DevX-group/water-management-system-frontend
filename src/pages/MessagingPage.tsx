
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Mail, 
  Smartphone,
  Copy,
  PlusCircle,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Message, 
  MessageChannel, 
  MessageTemplate, 
  PLACEHOLDERS, 
  ScheduleType, 
  TemplateSection,
  RecipientType 
} from '../types/messaging';
import { mockMessages, defaultRecurringSmsTemplate } from '../data/messagingData';

import { MessageHistoryPage } from './MessageHistoryPage';

export const MessagingPage = () => {
  return (
    <div className="space-y-6 p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messaging</h1>
          <p className="text-muted-foreground">Manage automated and custom messages for customers.</p>
        </div>
      </div>

       <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="messages" className="mt-6">
          <MessagingList />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <MessageHistoryPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MessagingList = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    toast({
      title: "Message deleted",
      description: "The message has been successfully deleted.",
    });
  };

  const handleSave = (message: Message) => {
    if (editingMessage) {
      setMessages(messages.map(m => m.id === message.id ? message : m));
      toast({
        title: "Message updated",
        description: "Your changes have been saved.",
      });
    } else {
      setMessages([...messages, { ...message, id: Date.now().toString() }]);
      toast({
        title: "Message created",
        description: "New message has been created.",
      });
    }
    setIsDialogOpen(false);
    setEditingMessage(null);
  };

  const openNewMessage = () => {
    setEditingMessage(null);
    setIsDialogOpen(true);
  };

  const openEditMessage = (message: Message) => {
    setEditingMessage(message);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openNewMessage}>
          <Plus className="mr-2 h-4 w-4" /> New Message
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {messages.map((message) => (
          <MessageCard 
            key={message.id} 
            message={message} 
            onEdit={() => openEditMessage(message)} 
            onDelete={() => handleDelete(message.id)} 
          />
        ))}
      </div>

      {isDialogOpen && (
        <MessageDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          initialData={editingMessage}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const MessageCard = ({ message, onEdit, onDelete }: { message: Message, onEdit: () => void, onDelete: () => void }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {message.name}
        </CardTitle>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          message.schedule.type === 'Recurring' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message.schedule.type}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {message.schedule.type === 'Recurring' 
                ? (message.schedule.dayOfMonth ? `${message.schedule.dayOfMonth}th of Every Month` : 'Daily')
                : `${message.schedule.date}`
              }
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{message.schedule.time}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>{message.recipients}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message template.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

const MessageDialog = ({ 
  isOpen, 
  onClose, 
  initialData, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  initialData: Message | null, 
  onSave: (m: Message) => void 
}) => {
  // Defaults for new message
  const defaultMessage: Message = {
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

  const [formData, setFormData] = useState<Message>(initialData ? JSON.parse(JSON.stringify(initialData)) : defaultMessage);
  const [activeTab, setActiveTab] = useState<'SMS' | 'Email'>('SMS');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // We need to track the last focused textarea to insert placeholders
  const [lastFocusedInput, setLastFocusedInput] = useState<{
    sectionId: string | null; // null if custom content
    templateType: 'sms' | 'email';
  } | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScheduleChange = (field: string, value: any) => {
    setFormData({ ...formData, schedule: { ...formData.schedule, [field]: value } });
  };

  const handleChannelChange = (channel: MessageChannel, checked: boolean) => {
    let newChannels = [...formData.channels];
    if (checked) {
      if (!newChannels.includes(channel)) newChannels.push(channel);
    } else {
      newChannels = newChannels.filter(c => c !== channel);
      if (newChannels.length === 0) newChannels = channel === 'SMS' ? ['Email'] : ['SMS']; // prevent empty
    }
    setFormData({ ...formData, channels: newChannels });
  };

  const updateTemplate = (type: 'sms' | 'email', updates: Partial<MessageTemplate>) => {
    setFormData({
      ...formData,
      templates: {
        ...formData.templates,
        [type]: { ...formData.templates[type], ...updates } as MessageTemplate
      }
    });
  };

  const insertPlaceholder = (placeholder: string) => {
    const templateType = activeTab === 'SMS' ? 'sms' : 'email';
    const template = formData.templates[templateType];
    
    if (template?.isCustom) {
      // Custom content
      const content = template.content || '';
      // Simple append for now as we don't have ref to exact cursor pos easily without controlled ref
      updateTemplate(templateType, { content: content + `{${placeholder}}` });
    } else {
      // Structured sections
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
         toast({ description: "Please click on a text area first." });
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
    } else {
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-400 opacity-0 group-hover:opacity-100"
                  onClick={() => {
                     const newSections = t.sections?.filter(s => s.id !== section.id);
                     updateTemplate(type, { sections: newSections });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
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
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-dashed"
            onClick={() => {
              const newSections = [...(t.sections || []), { id: Date.now().toString(), name: 'New Section', content: '' }];
              updateTemplate(type, { sections: newSections });
            }}
          >
            <PlusCircle className="mr-2 h-3 w-3" /> Add Section
          </Button>
        </div>
      );
    }
  };

  // Helper to render preview
  const renderPreview = (type: 'sms' | 'email') => {
    const t = formData.templates[type];
    if (!t) return <div className="text-muted-foreground italic">No template configured</div>;
    
    // Replace placeholders with generic data for preview
    const replacePlaceholders = (text: string) => {
      let res = text || '';
      // Simple mock replacement
      res = res.replace(/{customer_name}/g, "John Doe");
      res = res.replace(/{customer_number}/g, "CUS-12345");
      res = res.replace(/{monthly_fee}/g, "1500.00");
      res = res.replace(/{outstanding_balance}/g, "500.00");
      res = res.replace(/{total_balance}/g, "2000.00");
      res = res.replace(/{overdue_threshold}/g, "800.00");
      res = res.replace(/{reconnection_fee}/g, "1000.00");
      res = res.replace(/{pradeshiya_sabha_acc_no}/g, "234207");
      res = res.replace(/{whatsApp_number}/g, "011 2241435");
      return res;
    };

    if (t.isCustom) {
      return <div className="whitespace-pre-wrap">{replacePlaceholders(t.content || '')}</div>;
    } else {
      return (
        <div className="whitespace-pre-wrap space-y-2">
          {t.sections?.map(s => (
            <div key={s.id}>{replacePlaceholders(s.content)}</div>
          ))}
        </div>
      );
    }
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
              <TabsTrigger value="details">Message Details</TabsTrigger>
              <TabsTrigger value="template">Template Editor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-4 flex-none">
              <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="name">Message Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  placeholder="e.g. Monthly Bill"
                />
              </div>

              <div className="space-y-2">
                <Label>Send As</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="chk-sms" 
                      checked={formData.channels.includes('SMS')}
                      onCheckedChange={(c) => handleChannelChange('SMS', c as boolean)}
                    />
                    <Label htmlFor="chk-sms">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="chk-email" 
                      checked={formData.channels.includes('Email')}
                      onCheckedChange={(c) => handleChannelChange('Email', c as boolean)}
                    />
                    <Label htmlFor="chk-email">Email</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select 
                  value={formData.recipients} 
                  onValueChange={(val) => handleInputChange('recipients', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Customers">All Customers</SelectItem>
                    <SelectItem value="Overdue Customers">Overdue Customers</SelectItem>
                    <SelectItem value="Selected Customers">Selected Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Schedule Type</Label>
                <Select 
                  value={formData.schedule.type} 
                  onValueChange={(val) => handleScheduleChange('type', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="One-Time">One-Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.schedule.type === 'Recurring' ? (
                <div className="space-y-2">
                  <Label>Day of Month</Label>
                  <Select 
                    value={formData.schedule.dayOfMonth?.toString()} 
                    onValueChange={(val) => handleScheduleChange('dayOfMonth', parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {Array.from({length: 28}, (_, i) => i + 1).map(d => (
                        <SelectItem key={d} value={d.toString()}>{d}th of every month</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={formData.schedule.date} 
                    onChange={(e) => handleScheduleChange('date', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time" 
                  value={formData.schedule.time} 
                  onChange={(e) => handleScheduleChange('time', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="template" className="py-4 flex-1 min-h-0 flex flex-col">
             <div className="flex flex-col border rounded-md bg-white h-full">
               {/* <div className="flex justify-between items-center bg-slate-100 p-2 rounded-t-md border-b flex-none">
                 <h3 className="font-semibold text-lg">Template</h3>
                 <div className="flex items-center space-x-2">
                   <span className="text-xs font-medium bg-white px-2 py-1 rounded border">Preview On Right</span>
                 </div>
               </div> */}

               <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'SMS'|'Email')} className="flex flex-col flex-1 min-h-0">
                 <div className="bg-slate-50 p-2 border-b flex justify-between items-center flex-none">
                   <TabsList>
                     <TabsTrigger value="SMS" disabled={!formData.channels.includes('SMS')}>SMS</TabsTrigger>
                     <TabsTrigger value="Email" disabled={!formData.channels.includes('Email')}>Email</TabsTrigger>
                   </TabsList>
                   <div className="flex items-center space-x-2">
                     <Label htmlFor="custom-mode" className="text-xs">Custom Mode</Label>
                     <Switch 
                       id="custom-mode"
                       checked={formData.templates[activeTab === 'SMS' ? 'sms' : 'email']?.isCustom}
                       onCheckedChange={(chk) => updateTemplate(activeTab === 'SMS' ? 'sms' : 'email', { isCustom: chk })}
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-white flex-1 overflow-y-auto">
                   {/* Editor Area */}
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <Label className="text-xs text-muted-foreground">Placeholders (Click to copy/insert)</Label>
                       <div className="flex flex-wrap gap-2">
                         {PLACEHOLDERS.map(p => (
                           <Button 
                             key={p} 
                             variant="outline" 
                             size="sm" 
                             onClick={() => insertPlaceholder(p)}
                             className="h-6 text-[10px] px-2"
                           >
                             {p}
                           </Button>
                         ))}
                       </div>
                     </div>

                     <div className="h-[300px] border rounded-md p-2">
                       <TabsContent value="SMS" className="mt-0 h-full">
                          <ScrollArea className="h-full">
                            {renderEditor('sms')}
                          </ScrollArea>
                       </TabsContent>
                       <TabsContent value="Email" className="mt-0 h-full">
                          <ScrollArea className="h-full">
                            {renderEditor('email')}
                          </ScrollArea>
                       </TabsContent>
                     </div>
                   </div>

                   {/* Preview Area */}
                   <div className="border rounded-md bg-stone-50 p-4 h-[440px] flex flex-col">
                     <Label className="mb-2 block text-muted-foreground flex-none">{activeTab} Preview</Label>
                     <div className="bg-white p-4 rounded shadow-sm border text-sm flex-1 overflow-y-auto w-full break-words">
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
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(formData)}>Save Message</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
