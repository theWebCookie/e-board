'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { NotificationItem } from './NotificationItem';

export interface Notification {
  id: number;
  title: string;
  author: string;
}
[];

export const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/notification', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setNotifications(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <ul className='space-y-2'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <li key={index}>
            <Skeleton className='max-w-3xl h-[60px] mx-auto my-3 rounded-xl' />
          </li>
        ))
      ) : notifications.length === 0 ? (
        <p className='text-gray-300 text-center'>Brak powiadomień</p>
      ) : (
        notifications.map((notification: Notification) => <NotificationItem key={notification.id} notification={notification} />)
      )}
    </ul>
  );
};
