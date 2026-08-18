import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Hash, Link as LinkIcon, MapPin } from 'lucide-react';
import { CustomerProfile } from './ProfileForm';

interface ReadOnlyProfileFieldsProps {
  initialProfile: CustomerProfile;
}

export const ReadOnlyProfileFields: React.FC<ReadOnlyProfileFieldsProps> = ({ initialProfile }) => {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Read-only Information</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            NIC
          </Label>
          <Input 
            value={initialProfile.nic || ''} 
            disabled
            className="bg-secondary/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
            Connection Type
          </Label>
          <Input 
            value={initialProfile.connectionType ? initialProfile.connectionType.charAt(0).toUpperCase() + initialProfile.connectionType.slice(1) : ''} 
            disabled
            className="bg-secondary/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Region
          </Label>
          <Input 
            value={initialProfile.region ? `${initialProfile.region.regionName} (${initialProfile.region.regionCode})` : ''} 
            disabled
            className="bg-secondary/50"
          />
        </div>
      </div>
    </div>
  );
};
