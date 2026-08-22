import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Power, PowerOff } from 'lucide-react';
import { AdminUser, AdminStatus } from '@/types/admin';
import { useTranslation } from 'react-i18next';

interface AdminTableProps {
  admins: AdminUser[];
  onStatusChange: (id: string, status: AdminStatus) => void;
  onEdit: (admin: AdminUser) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({ admins, onStatusChange, onEdit }) => {
  const { t } = useTranslation('userManagement');

  const getStatusBadge = (status: AdminStatus) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-emerald-500/10 text-emerald-500">{t('active')}</Badge>;
      case 'INACTIVE': return <Badge className="bg-rose-500/10 text-rose-500">{t('inactive')}</Badge>;
      case 'SUSPENDED': return <Badge className="bg-amber-500/10 text-amber-500">{t('suspended')}</Badge>;
      case 'PENDING_ACTIVATION': return <Badge className="bg-blue-500/10 text-blue-500">{t('pending')}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return t('roles.systemAdmin');
      case 'PAYMENT_HANDLER': return t('roles.paymentHandler');
      case 'METER_READER': return t('roles.meterReader');
      case 'SUPER_ADMIN': return t('roles.superAdmin');
      default: return role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    }
  };

  if (admins.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">{t('noAdminsFound')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10 hover:bg-primary/20">
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('nic')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('phone')}</TableHead>
            <TableHead>{t('role')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className="hover:bg-primary/10 transition-colors">
              <TableCell className="font-medium">{admin.fullName || '-'}</TableCell>
              <TableCell className="font-medium">{admin.nic}</TableCell>
              <TableCell>{admin.email || '-'}</TableCell>
              <TableCell>{admin.phoneNumber || '-'}</TableCell>
              <TableCell>{getRoleLabel(admin.role)}</TableCell>
              <TableCell>{getStatusBadge(admin.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-500/10 border-sky-500/20"
                    onClick={() => onEdit(admin)}
                    title={t('edit')}
                  >
                    <Edit className="w-4 h-4 mr-1" /> {t('edit')}
                  </Button>
                  {admin.status === 'ACTIVE' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/20"
                      onClick={() => onStatusChange(admin.id, 'SUSPENDED')}
                      title={t('suspend')}
                    >
                      <PowerOff className="w-4 h-4 mr-1" /> {t('suspend')}
                    </Button>
                  ) : admin.status === 'SUSPENDED' || admin.status === 'INACTIVE' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"
                      onClick={() => onStatusChange(admin.id, 'ACTIVE')}
                      title={t('activate')}
                    >
                      <Power className="w-4 h-4 mr-1" /> {t('activate')}
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
