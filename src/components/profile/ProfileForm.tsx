import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
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
  const { t: toastT } = useTranslation('toasts');
  const { t } = useTranslation('customerSettings');
  
  // Editable fields state
  const [name, setName] = useState(initialProfile.accountHolderName || '');
  const [email, setEmail] = useState(initialProfile.email || '');
  const [phone, setPhone] = useState(initialProfile.mobileNumber || '');
  
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({ title: toastT('error'), description: toastT('fillEditableFields'), variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.put('/customers/me', { 
        accountHolderName: name,
        email: email,
        phoneNumber: phone
      });
      toast({ title: toastT('success'), description: toastT('profileUpdated') });
      onProfileUpdated(res.data);
    } catch (err: any) {
      console.error(err);
      toast({ 
        title: toastT('error'),
        description: err.response?.data?.message || toastT('profileUpdateFailed'),
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
          {t('profile.personalDetails')}
        </CardTitle>
        <CardDescription>
          {t('profile.description')}
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
              {loading ? t('profile.saving') : t('profile.saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
