'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { NotificationItem } from './NotificationItem';
import { genericDictionary, notificationDictionary, toastTimeout } from '@config';
import { toast } from '../ui/use-toast';
import { getCookie } from '@/lib/cookies';
import { decodeJwt } from 'jose';

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

  const handleNotificationDelete = async (id: number) => {
    const tokenCookie = await getCookie('token');
    const token = tokenCookie?.value;
    const decoded = token && decodeJwt(token);
    const userId = decoded ? decoded.id : null;

    const res = await fetch('/api/notification', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, userId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast({
        title: genericDictionary['generic-error'],
        description: `${errorData.error}`,
        duration: toastTimeout,
      });
      return;
    }

    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));

    toast({
      title: notificationDictionary['success-notification-delete'],
      duration: toastTimeout,
    });
  };

  return (
    <ul className='space-y-2 max-h-96 overflow-y-auto'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <li key={index}>
            <Skeleton className='max-w-3xl h-[60px] mx-auto my-3 rounded-xl' />
          </li>
        ))
      ) : notifications.length === 0 ? (
        <p className='text-gray-300 text-center'>Brak powiadomień</p>
      ) : (
        notifications.map((notification: Notification) => (
          <NotificationItem key={notification.id} notification={notification} handleNotificationDelete={handleNotificationDelete} />
        ))
      )}
    </ul>
  );
};
