import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditableProfileFieldsProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  loading: boolean;
}

export const EditableProfileFields: React.FC<EditableProfileFieldsProps> = ({
  name, setName,
  email, setEmail,
  phone, setPhone,
  loading
}) => {
  const { t } = useTranslation('customerSettings');

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          {t('profile.accountHolderName')}
        </Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder={t('profile.accountHolderPlaceholder')}
          disabled={loading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          {t('profile.email')}
        </Label>
        <Input 
          id="email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder={t('profile.emailPlaceholder')}
          disabled={loading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          {t('profile.mobileNumber')}
        </Label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="07XXXXXXXX"
          disabled={loading}
          required
        />
      </div>
    </div>
  );
};
