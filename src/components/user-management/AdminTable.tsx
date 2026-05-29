import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Power, PowerOff } from 'lucide-react';
import { AdminUser, AdminStatus } from '@/types/admin';

interface AdminTableProps {
  admins: AdminUser[];
  onStatusChange: (id: string, status: AdminStatus) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({ admins, onStatusChange }) => {
  const getStatusBadge = (status: AdminStatus) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>;
      case 'INACTIVE': return <Badge className="bg-rose-500/10 text-rose-500">Inactive</Badge>;
      case 'SUSPENDED': return <Badge className="bg-amber-500/10 text-amber-500">Suspended</Badge>;
      case 'PENDING_ACTIVATION': return <Badge className="bg-blue-500/10 text-blue-500">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    return role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  if (admins.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">No administrator accounts found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent/50 hover:bg-accent/50">
            <TableHead>NIC</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className="hover:bg-accent/30 transition-colors">
              <TableCell className="font-medium">{admin.nic}</TableCell>
              <TableCell>{admin.email || '-'}</TableCell>
              <TableCell>{admin.phoneNumber || '-'}</TableCell>
              <TableCell>{getRoleLabel(admin.role)}</TableCell>
              <TableCell>{getStatusBadge(admin.status)}</TableCell>
              <TableCell className="text-right space-x-2">
                {admin.status === 'ACTIVE' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/20"
                    onClick={() => onStatusChange(admin.id, 'SUSPENDED')}
                    title="Suspend Admin"
                  >
                    <PowerOff className="w-4 h-4 mr-1" /> Suspend
                  </Button>
                ) : admin.status === 'SUSPENDED' || admin.status === 'INACTIVE' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"
                    onClick={() => onStatusChange(admin.id, 'ACTIVE')}
                    title="Activate Admin"
                  >
                    <Power className="w-4 h-4 mr-1" /> Activate
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
