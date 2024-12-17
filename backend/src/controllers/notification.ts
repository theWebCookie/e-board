import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
import { clientUserMap, wss } from '../index';
import cookie from 'cookie';

interface Notification {
  id: number;
  userId: number;
  recieverId: number;
  title: string;
  author: string;
}

const prisma = new PrismaClient();

export const handleNotificationPost = async (req: Request, res: Response): Promise<void> => {
  const { title, recieverIds, userId } = req.body;

  console.log(req.body);

  const recievers = await prisma.user.findMany({
    where: { id: { in: recieverIds } },
  });

  const author = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!author) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const notificationData = recievers.map((reciever) => ({
    title,
    recieverId: reciever.id,
    userId,
    author: author.name,
  }));

  const createdNotifications = await prisma.notification.createMany({
    data: notificationData,
  });

  const msg = JSON.stringify({
    type: 'notification',
    notification: {
      title,
      author,
    },
  });

  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      console.log('here');
      const userIdFromClient = clientUserMap.get(client);
      if (userIdFromClient && recieverIds.includes(userIdFromClient)) {
        client.send(msg);
      }
    }
  }

  res.status(201).json({ message: 'Notifications sent', createdNotifications });
};

export const handleNotificationGet = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.query.userId as string);

  const notifications = await prisma.notification.findMany({
    where: { recieverId: userId },
  });

  res.json(notifications);
};
