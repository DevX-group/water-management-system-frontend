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
  const [templateType, setTemplateType] = useState<'sms' | 'email'>('sms');

  // Configuration settings state
  const [overdueThreshold, setOverdueThreshold] = useState('800.00');
  const [reconnectionFee, setReconnectionFee] = useState('1000.00');
  const [accountNumber, setAccountNumber] = useState('234207');
  const [whatsAppNumber, setWhatsAppNumber] = useState('011 2241435');
  const [billPortalLink, setBillPortalLink] = useState('https://prodeshiyasabho.lk');

  // SMS Template fields state
  const [smsGreeting, setSmsGreeting] = useState('Dear {customer_name},');
  const [smsIntroduction, setSmsIntroduction] = useState('This is your monthly water bill notification from Pradeshiya Sabha.');
  const [smsCustomerNumberLine, setSmsCustomerNumberLine] = useState('Customer Number : {customerNumber}');
  const [smsMonthlyFeeLine, setSmsMonthlyFeeLine] = useState('Monthly Fee : LKR {monthlyFee}');
  const [smsOutstandingBalanceLine, setSmsOutstandingBalanceLine] = useState('Outstanding Balance : LKR {outstandingBalance}');
  const [smsTotalBalanceLine, setSmsTotalBalanceLine] = useState('Total Balance : LKR {totalBalance}');
  const [smsOverdueAlert, setSmsOverdueAlert] = useState('IMPORTANT: Your balance exceeds {threshold}. The Pradeshiya Sabha can disconnect the water line if payment is missed. After disconnection, an additional charge of LKR {reconnectionFee} will be applied for reconnection.');
  const [smsBillLink, setSmsBillLink] = useState('View your detailed bill online : {billLink}');
  const [smsPaymentInstructions, setSmsPaymentInstructions] = useState('For online payment, please visit www.example.com\nor\nDeposit the amount to account number {accountNumber} and Whatsapp your receipt along with your subscription number, name and NIC to {whatsAppNumber}');
  const [smsFooter, setSmsFooter] = useState('Thank you for your cooperation.\n\n- Pradeshiya Sabha');

  // Email Template fields state
  const [emailGreeting, setEmailGreeting] = useState('Dear {customer_name},');
  const [emailIntroduction, setEmailIntroduction] = useState('This is your monthly water bill notification from Pradeshiya Sabha.');
  const [emailCustomerNumberLine, setEmailCustomerNumberLine] = useState('Customer Number : {customerNumber}');
  const [emailMonthlyFeeLine, setEmailMonthlyFeeLine] = useState('Monthly Fee : LKR {monthlyFee}');
  const [emailOutstandingBalanceLine, setEmailOutstandingBalanceLine] = useState('Outstanding Balance : LKR {outstandingBalance}');
  const [emailTotalBalanceLine, setEmailTotalBalanceLine] = useState('Total Balance : LKR {totalBalance}');
  const [emailOverdueAlert, setEmailOverdueAlert] = useState('IMPORTANT: Your balance exceeds {threshold}. The Pradeshiya Sabha can disconnect the water line if payment is missed. After disconnection, an additional charge of LKR {reconnectionFee} will be applied for reconnection.');
  const [emailBillLink, setEmailBillLink] = useState('View your detailed bill online : {billLink}');
  const [emailPaymentInstructions, setEmailPaymentInstructions] = useState('For online payment, please visit www.example.com\nor\nDeposit the amount to account number {accountNumber} and Whatsapp your receipt along with your subscription number, name and NIC to {whatsAppNumber}');
  const [emailFooter, setEmailFooter] = useState('Thank you for your cooperation.\n\n- Pradeshiya Sabha');

  // Function to replace placeholders with actual values for preview
  const generatePreview = (type: 'sms' | 'email') => {
    const sampleData = {
      customer_name: 'Hansana Thilakarathna',
      customerNumber: '234207E',
      monthlyFee: '540.00',
      outstandingBalance: '300.00',
      totalBalance: '840.00',
      threshold: `LKR ${overdueThreshold}`,
      reconnectionFee: reconnectionFee,
      billLink: billPortalLink,
      accountNumber: accountNumber,
      whatsAppNumber: whatsAppNumber
    };

    const replacePlaceholders = (text: string) => {
      return text
        .replace(/{customer_name}/g, sampleData.customer_name)
        .replace(/{customerNumber}/g, sampleData.customerNumber)
        .replace(/{monthlyFee}/g, sampleData.monthlyFee)
        .replace(/{outstandingBalance}/g, sampleData.outstandingBalance)
        .replace(/{totalBalance}/g, sampleData.totalBalance)
        .replace(/{threshold}/g, sampleData.threshold)
        .replace(/{reconnectionFee}/g, sampleData.reconnectionFee)
        .replace(/{billLink}/g, sampleData.billLink)
        .replace(/{accountNumber}/g, sampleData.accountNumber)
        .replace(/{whatsAppNumber}/g, sampleData.whatsAppNumber);
    };

    if (type === 'sms') {
      return {
        greeting: replacePlaceholders(smsGreeting),
        introduction: replacePlaceholders(smsIntroduction),
        customerNumberLine: replacePlaceholders(smsCustomerNumberLine),
        monthlyFeeLine: replacePlaceholders(smsMonthlyFeeLine),
        outstandingBalanceLine: replacePlaceholders(smsOutstandingBalanceLine),
        totalBalanceLine: replacePlaceholders(smsTotalBalanceLine),
        overdueAlert: replacePlaceholders(smsOverdueAlert),
        billLink: replacePlaceholders(smsBillLink),
        paymentInstructions: replacePlaceholders(smsPaymentInstructions),
        footer: replacePlaceholders(smsFooter)
      };
    } else {
      return {
        greeting: replacePlaceholders(emailGreeting),
        introduction: replacePlaceholders(emailIntroduction),
        customerNumberLine: replacePlaceholders(emailCustomerNumberLine),
        monthlyFeeLine: replacePlaceholders(emailMonthlyFeeLine),
        outstandingBalanceLine: replacePlaceholders(emailOutstandingBalanceLine),
        totalBalanceLine: replacePlaceholders(emailTotalBalanceLine),
        overdueAlert: replacePlaceholders(emailOverdueAlert),
        billLink: replacePlaceholders(emailBillLink),
        paymentInstructions: replacePlaceholders(emailPaymentInstructions),
        footer: replacePlaceholders(emailFooter)
      };
    }
  };

  const preview = generatePreview(templateType);

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
            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up flex flex-col">
              <h3 className="text-lg font-semibold text-foreground mb-6">Configuration Settings</h3>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Overdue Threshold (LKR)</Label>
                    <Input value={overdueThreshold} onChange={(e) => setOverdueThreshold(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Reconnection Fee (LKR)</Label>
                    <Input value={reconnectionFee} onChange={(e) => setReconnectionFee(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pradeshiya Sabha Acc. No.</Label>
                    <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Online Bill Portal Link</Label>
                  <Input value={billPortalLink} onChange={(e) => setBillPortalLink(e.target.value)} />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  Save Configuration Settings
                </Button>
              </div>
            </div>

            {/* Template Editor */}
            <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up flex flex-col" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {templateType === 'sms' ? 'Monthly SMS Template' : 'Monthly Email Template'}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant={templateType === 'sms' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTemplateType('sms')}
                  >
                    SMS
                  </Button>
                  <Button 
                    variant={templateType === 'email' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTemplateType('email')}
                  >
                    Email
                  </Button>
                </div>
              </div>
              
              {templateType === 'sms' ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 flex-1">
                  <div className="space-y-2">
                    <Label>Greeting</Label>
                    <Input value={smsGreeting} onChange={(e) => setSmsGreeting(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Introduction</Label>
                    <Textarea 
                      value={smsIntroduction}
                      onChange={(e) => setSmsIntroduction(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Number Line</Label>
                    <Input value={smsCustomerNumberLine} onChange={(e) => setSmsCustomerNumberLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Fee Line</Label>
                    <Input value={smsMonthlyFeeLine} onChange={(e) => setSmsMonthlyFeeLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Outstanding Balance Line</Label>
                    <Input value={smsOutstandingBalanceLine} onChange={(e) => setSmsOutstandingBalanceLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Balance Line</Label>
                    <Input value={smsTotalBalanceLine} onChange={(e) => setSmsTotalBalanceLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Overdue Alert</Label>
                    <Textarea 
                      value={smsOverdueAlert}
                      onChange={(e) => setSmsOverdueAlert(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bill Link</Label>
                    <Input value={smsBillLink} onChange={(e) => setSmsBillLink(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Online Payment Instructions</Label>
                    <Textarea 
                      value={smsPaymentInstructions}
                      onChange={(e) => setSmsPaymentInstructions(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Footer</Label>
                    <Textarea 
                      value={smsFooter}
                      onChange={(e) => setSmsFooter(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 flex-1">
                  <div className="space-y-2">
                    <Label>Greeting</Label>
                    <Input value={emailGreeting} onChange={(e) => setEmailGreeting(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Introduction</Label>
                    <Textarea 
                      value={emailIntroduction}
                      onChange={(e) => setEmailIntroduction(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Number Line</Label>
                    <Input value={emailCustomerNumberLine} onChange={(e) => setEmailCustomerNumberLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Fee Line</Label>
                    <Input value={emailMonthlyFeeLine} onChange={(e) => setEmailMonthlyFeeLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Outstanding Balance Line</Label>
                    <Input value={emailOutstandingBalanceLine} onChange={(e) => setEmailOutstandingBalanceLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Balance Line</Label>
                    <Input value={emailTotalBalanceLine} onChange={(e) => setEmailTotalBalanceLine(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Overdue Alert</Label>
                    <Textarea 
                      value={emailOverdueAlert}
                      onChange={(e) => setEmailOverdueAlert(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bill Link</Label>
                    <Input value={emailBillLink} onChange={(e) => setEmailBillLink(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Online Payment Instructions</Label>
                    <Textarea 
                      value={emailPaymentInstructions}
                      onChange={(e) => setEmailPaymentInstructions(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Footer</Label>
                    <Textarea 
                      value={emailFooter}
                      onChange={(e) => setEmailFooter(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  Save Template
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-card rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {templateType === 'sms' ? 'Message Preview' : 'Email Preview'}
            </h3>
            <div className="bg-secondary/50 rounded-xl p-4 font-mono text-sm text-foreground whitespace-pre-line">
              <p>{preview.greeting}</p>
              <br />
              <p>{preview.introduction}</p>
              <br />
              <p>{preview.customerNumberLine}</p>
              <p>{preview.monthlyFeeLine}</p>
              <p>{preview.outstandingBalanceLine}</p>
              <p>{preview.totalBalanceLine}</p>
              <br />
              <p className="text-destructive font-medium">{preview.overdueAlert}</p>
              <br />
              <p>{preview.billLink}</p>
              <br />
              <p>{preview.paymentInstructions}</p>
              <br />
              <p>{preview.footer}</p>
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
