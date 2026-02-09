import React, { useState } from 'react';
import { User, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

export const SettingsPage = () => {
  const { currentAdmin } = useAdmin();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your profile settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage admin preferences and system configuration</p>
      </div>

      <div className="bg-card rounded-2xl shadow-md animate-slide-up">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border px-6">
            <TabsList className="bg-transparent h-14 gap-6">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={currentAdmin.name.split(' ')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={currentAdmin.name.split(' ')[1] || ''} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={currentAdmin.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+94 77 123 4567" />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      currentAdmin.role === 'main_admin' 
                        ? 'bg-primary/10 text-primary' 
                        : currentAdmin.role === 'meter_reader'
                        ? 'bg-success/10 text-success'
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {currentAdmin.role === 'main_admin' ? 'Main Admin' : 
                       currentAdmin.role === 'meter_reader' ? 'Meter Reader' : 'Payment Handler'}
                    </span>
                    <span className="text-sm text-muted-foreground">(Contact administrator to change)</span>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0">
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>

                <div className="bg-secondary/50 rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Password Requirements</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Minimum 8 characters</li>
                    <li>• At least one uppercase letter</li>
                    <li>• At least one number</li>
                    <li>• At least one special character</li>
                  </ul>
                </div>

                <Button onClick={handleSave}>
                  <Shield className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
