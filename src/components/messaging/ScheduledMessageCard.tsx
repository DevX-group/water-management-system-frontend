import '@/index.css';
import React from 'react';
import { Edit, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScheduledMessage } from '@/types/messaging';

interface ScheduledMessageCardProps {
  message:  ScheduledMessage;
  onEdit:   () => void;
  onDelete: () => void;
}

export const ScheduledMessageCard: React.FC<ScheduledMessageCardProps> = ({ message, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{message.name}</CardTitle>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          message.schedule.type === 'Recurring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.schedule.type}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {message.schedule.type === 'Recurring'
                ? (message.schedule.dayOfMonth ? `${message.schedule.dayOfMonth}th of Every Month` : 'Daily')
                : `${message.schedule.date}`
              }
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{message.schedule.time}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>{message.recipients}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message template.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
