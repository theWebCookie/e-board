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
    // Mock api call
    const fetchNotifications = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockNotifications: Notification[] = [
        { id: 1, title: 'Zaproszenie do tablicy', author: 'Jan Kowalski' },
        { id: 2, title: 'Spotkanie zespołu', author: 'Anna Nowak' },
      ];
      setNotifications(mockNotifications);
      setIsLoading(false);
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
