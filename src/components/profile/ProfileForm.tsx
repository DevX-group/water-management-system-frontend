import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { EditableProfileFields } from './EditableProfileFields';
import { ReadOnlyProfileFields } from './ReadOnlyProfileFields';

export interface CustomerProfile {
  accountHolderName: string;
  email: string;
  nic: string;
  mobileNumber: string;
  connectionType: string;
  region: {
    regionName: string;
    regionCode: string;
  };
}

interface ProfileFormProps {
  initialProfile: CustomerProfile;
  onProfileUpdated: (updatedProfile: CustomerProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onProfileUpdated }) => {
  const { toast } = useToast();
  
  // Editable fields state
  const [name, setName] = useState(initialProfile.accountHolderName || '');
  const [email, setEmail] = useState(initialProfile.email || '');
  const [phone, setPhone] = useState(initialProfile.mobileNumber || '');
  
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({ title: 'Error', description: 'Please fill out all editable fields.', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.put('/customers/me', { 
        accountHolderName: name,
        email: email,
        phoneNumber: phone
      });
      toast({ title: 'Success', description: 'Your profile has been updated successfully.' });
      onProfileUpdated(res.data);
    } catch (err: any) {
      console.error(err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to update profile.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 hover:border-primary/50 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          Personal Details
        </CardTitle>
        <CardDescription>
          Update your contact details and account holder name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          <EditableProfileFields 
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone}
            loading={loading}
          />

          <ReadOnlyProfileFields initialProfile={initialProfile} />

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
