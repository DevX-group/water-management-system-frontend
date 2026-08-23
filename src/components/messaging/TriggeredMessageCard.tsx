import '@/index.css';
import React from 'react';
import { Edit, Users, MessageSquare, Trash2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { TriggeredMessage } from '@/types/messaging';
import { formatTriggerType } from '@/utils/messagingUtils';
import { useTranslation } from 'react-i18next';

interface TriggeredMessageCardProps {
  message:  TriggeredMessage;
  onEdit:   () => void;
  onDelete: () => void;
}

export const TriggeredMessageCard: React.FC<TriggeredMessageCardProps> = ({ message, onEdit, onDelete }) => {
  const { t } = useTranslation('messaging');

  // Compact card showing trigger type and active status with edit/delete actions.
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{t(`messageNames.${message.name}`, { defaultValue: message.name })}</CardTitle>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          message.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {message.active ? t('status.active') : t('status.inactive')}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>{t(`triggerTypes.${formatTriggerType(message.triggerType)}`, { defaultValue: formatTriggerType(message.triggerType) })}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>{t(`recipients.${message.recipients}`, { defaultValue: message.recipients })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmDelete.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('confirmDelete.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">{t('common.delete')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
