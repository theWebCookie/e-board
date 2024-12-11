'use client';
import { Bell, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { FC } from 'react';
import { Notification } from './NotificationList';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification }) => {
  const { title, author } = notification;
  return (
    <li className='flex justify-between items-center my-3 p-3 bg-[#121215] rounded-xl'>
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
        <Button variant='ghost'>
          {' '}
          <Trash />
        </Button>
      </div>
    </li>
  );
};
