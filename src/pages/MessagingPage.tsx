import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Calendar, CheckCircle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const messageHistory = [
  { id: '1', name: 'Monthly - August 2025', date: '25/08/2025', type: 'Email', successRate: 95.4 },
  { id: '2', name: 'Monthly - August 2025', date: '25/08/2025', type: 'SMS', successRate: 92.4 },
  { id: '3', name: 'Custom Message A', date: '30/07/2025', type: 'SMS', successRate: 92.4 },
];

const schedules = [
  { id: '1', name: 'Monthly SMS Schedule', date: '25th of Every Month', time: '9:00 AM', recipients: 'All Customers' },
  { id: '2', name: 'Monthly Email Schedule', date: 'Every 25th', time: '9:00 AM', recipients: '1540' },
];

export const MessagingPage = () => {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Messaging</h1>
        <p className="text-muted-foreground">Manage templates, schedules, and message history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary p-1 rounded-xl">
          <TabsTrigger value="templates" className="rounded-lg">Template Setup</TabsTrigger>
          <TabsTrigger value="scheduling" className="rounded-lg">Scheduling</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
              <h3 className="text-lg font-semibold text-foreground mb-6">Configuration Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Overdue Threshold (LKR)</Label>
                  <Input defaultValue="800.00" />
                </div>
                <div className="space-y-2">
                  <Label>Reconnection Fee (LKR)</Label>
                  <Input defaultValue="1000.00" />
                </div>
                <div className="space-y-2">
                  <Label>Pradeshiya Sabha Acc. No.</Label>
                  <Input defaultValue="234207" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input defaultValue="011 2241435" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Online Bill Portal Link</Label>
                <Input defaultValue="https://prodeshiyasabho.lk" />
              </div>
            </div>

            {/* Template Editor */}
            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Monthly SMS Template</h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">English</Button>
                  <Button variant="ghost" size="sm">සිංහල</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Greeting</Label>
                  <Input defaultValue="Dear {customer_name}," />
                </div>
                <div className="space-y-2">
                  <Label>Introduction</Label>
                  <Textarea 
                    defaultValue="This is your monthly water bill notification from Pradeshiya Sabha."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bill Details</Label>
                  <Textarea 
                    defaultValue="Customer Number: {customerNumber}
Monthly Fee: LKR {monthlyFee}
Outstanding Balance: LKR {outstandingBalance}
Total Balance: LKR {totalBalance}"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="flex-1">
                  Preview
                </Button>
                <Button className="flex-1">
                  Save Template
                </Button>
              </div>
            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Message Preview</h3>
            <div className="bg-secondary/50 rounded-xl p-4 font-mono text-sm text-foreground">
              <p>Dear Hansana Thilakarathna,</p>
              <br />
              <p>This is your monthly water bill notification from Pradeshiya Sabha.</p>
              <br />
              <p>Customer Number: 234207E</p>
              <p>Monthly Fee: LKR 540.00</p>
              <p>Outstanding Balance: LKR 300.00</p>
              <p>Total Balance: LKR 840.00</p>
              <br />
              <p className="text-destructive font-medium">IMPORTANT: Your balance exceeds LKR 800. The Pradeshiya Sabha can disconnect the water line if payment is missed. After disconnection, an additional charge of LKR 1000.00 will be applied for reconnection.</p>
              <br />
              <p>Thank you for your cooperation.</p>
              <p>- Pradeshiya Sabha</p>
            </div>
          </div>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {schedules.map((schedule, index) => (
              <div 
                key={schedule.id}
                className="bg-card rounded-2xl p-6 shadow-md animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{schedule.name}</h3>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{schedule.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{schedule.recipients} Recipients</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Custom Message */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-6">Create Custom Message</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Message Name</Label>
                <Input placeholder="e.g., Holiday Notice" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Input defaultValue="All Customers" />
              </div>
            </div>
            <Button className="mt-4">
              <Send className="w-4 h-4 mr-2" />
              Schedule Message
            </Button>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Message History</h3>
              <div className="flex gap-2">
                <Input placeholder="Year/Month" className="w-32" />
                <Input placeholder="Type" className="w-32" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Date & Time</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Success Rate</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {messageHistory.map((message) => (
                    <tr key={message.id} className="border-b border-border/50 last:border-0">
                      <td className="py-4 text-sm font-medium text-foreground">{message.name}</td>
                      <td className="py-4 text-sm text-muted-foreground">{message.date}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          message.type === 'Email' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                        }`}>
                          {message.type === 'Email' ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                          {message.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-success rounded-full"
                              style={{ width: `${message.successRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-foreground">{message.successRate}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
