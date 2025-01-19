import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

interface Notification {
  id: number;
  userId: number;
  recieverId: number;
  title: string;
  author: string;
}

const prisma = new PrismaClient();

export const handleNotificationSave = async (
  title: string,
  userId: number,
  recieverIds?: Array<number>,
  roomId?: string | undefined
): Promise<void> => {
  if (recieverIds && recieverIds?.length > 0) {
    const author = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!author) {
      console.log('User not found');
      return;
    }

    const notificationData = recieverIds.map((reciever) => ({
      title,
      recieverId: reciever,
      userId,
      author: author.name,
    }));

    const createdNotifications = await prisma.notification.createMany({
      data: notificationData,
    });

    console.log({ message: 'Notifications sent', createdNotifications });
    return;
  }

  const usersOnBoard = await prisma.usersOnBoards.findMany({
    where: { boardId: roomId },
  });

  const roomRecieverIds = usersOnBoard.map((user) => user.userId);

  const recievers = await prisma.user.findMany({
    where: { id: { in: roomRecieverIds } },
  });

  const author = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!author) {
    console.log('User not found');
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

  console.log({ message: 'Notifications sent', createdNotifications });
};

export const handleNotificationGet = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.query.userId as string);

  const notifications = await prisma.notification.findMany({
    where: { recieverId: userId },
  });

  res.json(notifications);
};

export const handleNotificationDelete = async (req: Request, res: Response): Promise<void> => {
  const { id, userId } = req.body;

  if (!id || !userId) {
    res.status(400).json({ message: 'Notification ID and User ID are required' });
    return;
  }

  try {
    const notification = await prisma.notification.deleteMany({
      where: {
        id,
        recieverId: userId,
      },
    });

    if (notification.count === 0) {
      res.status(404).json({ message: 'Notification not found for the specified user' });
    } else {
      res.json({ message: 'Notification deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the notification', error });
  }
};
