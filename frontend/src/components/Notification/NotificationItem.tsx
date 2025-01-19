'use client';
import { Bell, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { FC } from 'react';
import { Notification } from './NotificationList';

interface NotificationItemProps {
  notification: Notification;
  handleNotificationDelete: (id: number) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification, handleNotificationDelete }) => {
  const { id, title, author } = notification;

  return (
    <li className='flex justify-between items-center my-3 p-3 bg-[#e4e5f1] rounded-xl'>
      <div className='flex items-center gap-3'>
        <div className='ml-3'>
          <Bell />
        </div>
        <div>
          <p className='text-sm font-medium'>{title}</p>
          <p className='text-[#a1a1aa] text-xs'>{author}</p>
        </div>
      </div>
      <div>
        <Button variant='ghost' onClick={() => handleNotificationDelete(id)}>
          {' '}
          <Trash />
        </Button>
      </div>
    </li>
  );
};
