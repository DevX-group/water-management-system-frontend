import React from 'react';
import { PlusCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { MessageTemplate, ScheduledMessage, TriggeredMessage } from '@/types/messaging';
import { replacePlaceholders } from '@/utils/messagingUtils';
import { PlaceholderPanel } from './PlaceholderPanel';

type TemplateEditorProps = {
  formData: ScheduledMessage | TriggeredMessage;
  activeTab: 'SMS' | 'Email';
  onTabChange: (tab: 'SMS' | 'Email') => void;
  placeholders: string[];
  onInsertPlaceholder: (placeholder: string) => void;
  onUpdateTemplate: (type: 'sms' | 'email', updates: Partial<MessageTemplate>) => void;
  onMoveSection: (type: 'sms' | 'email', fromIndex: number, toIndex: number) => void;
  onFocusSection: (payload: { sectionId: string | null; templateType: 'sms' | 'email' }) => void;
};

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  formData,
  activeTab,
  onTabChange,
  placeholders,
  onInsertPlaceholder,
  onUpdateTemplate,
  onMoveSection,
  onFocusSection,
}) => {
  const renderEditor = (type: 'sms' | 'email') => {
    const template = formData.templates[type];
    if (!template) return null;
    if (template.isCustom) {
      return (
        <Textarea
          placeholder="Type your message here..."
          value={template.content}
          onChange={(event) => onUpdateTemplate(type, { content: event.target.value })}
          className="min-h-[200px]"
          onFocus={() => onFocusSection({ sectionId: null, templateType: type })}
        />
      );
    }

    return (
      <div className="space-y-4">
        {template.sections?.map((section, index) => (
          <div key={section.id} className="border p-2 rounded relative group">
            <div className="flex justify-between items-center mb-1">
              <Input
                className="h-6 w-1/2 text-xs font-bold border-none p-0 focus-visible:ring-0"
                value={section.name}
                onChange={(event) => {
                  const newSections = [...(template.sections || [])];
                  newSections[index].name = event.target.value;
                  onUpdateTemplate(type, { sections: newSections });
                }}
              />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMoveSection(type, index, index - 1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMoveSection(type, index, index + 1)}
                  disabled={index === (template.sections?.length || 0) - 1}
                  title="Move down"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400"
                  onClick={() => {
                    const newSections = template.sections?.filter(s => s.id !== section.id);
                    onUpdateTemplate(type, { sections: newSections });
                  }}
                  title="Delete section"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Textarea
              value={section.content}
              onChange={(event) => {
                const newSections = [...(template.sections || [])];
                newSections[index].content = event.target.value;
                onUpdateTemplate(type, { sections: newSections });
              }}
              className="text-sm min-h-[60px]"
              onFocus={() => onFocusSection({ sectionId: section.id, templateType: type })}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => {
            const newSections = [
              ...(template.sections || []),
              { id: Date.now().toString(), name: 'New Section', content: '' },
            ];
            onUpdateTemplate(type, { sections: newSections });
          }}
        >
          <PlusCircle className="mr-2 h-3 w-3" /> Add Section
        </Button>
      </div>
    );
  };

  const renderPreview = (type: 'sms' | 'email') => {
    const template = formData.templates[type];
    if (!template) return <div className="text-muted-foreground italic">No template configured</div>;
    if (template.isCustom) {
      return (
        <div>
          {type === 'email' && template.subject && (
            <div className="mb-3 pb-2 border-b">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Subject: </span>
              <span className="font-semibold text-sm">{replacePlaceholders(template.subject)}</span>
            </div>
          )}
          <div className="whitespace-pre-wrap">{replacePlaceholders(template.content || '')}</div>
        </div>
      );
    }

    return (
      <div>
        {type === 'email' && template.subject && (
          <div className="mb-3 pb-2 border-b">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Subject: </span>
            <span className="font-semibold text-sm">{replacePlaceholders(template.subject)}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap space-y-2">
          {template.sections?.map(section => (
            <div key={section.id}>{replacePlaceholders(section.content)}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col border rounded-md bg-white h-full">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'SMS' | 'Email')} className="flex flex-col flex-1 min-h-0">
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
              onCheckedChange={(checked) =>
                onUpdateTemplate(activeTab === 'SMS' ? 'sms' : 'email', { isCustom: checked })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-white flex-1 overflow-y-auto">
          <div className="space-y-4">
            <PlaceholderPanel placeholders={placeholders} onInsert={onInsertPlaceholder} />
            {activeTab === 'Email' && (
              <div className="space-y-2">
                <Label htmlFor="email-subject" className="text-xs font-medium">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="e.g. Your Monthly Water Bill"
                  value={formData.templates.email?.subject || ''}
                  onChange={(event) => onUpdateTemplate('email', { subject: event.target.value })}
                />
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

          <div className="border rounded-md bg-stone-50 p-4 h-[440px] flex flex-col">
            <Label className="mb-2 block text-muted-foreground flex-none">{activeTab} Preview</Label>
            <div className="bg-white p-4 rounded shadow-sm border text-sm flex-1 overflow-y-auto w-full break-words">
              {renderPreview(activeTab === 'SMS' ? 'sms' : 'email')}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};
