import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileForm, CustomerProfile } from '@/components/profile/ProfileForm';

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/customers/me');
        if (res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        toast({ title: 'Error', description: 'Failed to load profile data.', variant: 'destructive' });
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [toast]);

  if (fetching) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto p-4 md:p-6 mt-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and update your personal information.
          </p>
        </div>

        <div className="grid gap-6">
          {profile && (
            <ProfileForm 
              initialProfile={profile} 
              onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)} 
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;