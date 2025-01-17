import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const handleMessagesSave = async (message: any, boardId: string, userId: number): Promise<void> => {
  if (!message || !userId || !boardId) {
    console.log({ error: 'Missing required fields' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log({ error: 'User not found' });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      console.log({ error: 'Board not found' });
    }

    const newMessage = await prisma.message.create({
      data: {
        message,
        userId,
        boardId,
        sentAt: new Date(),
      },
    });

    console.log({
      message: 'Message saved successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

export const handleBoardContentLoad = async (req: Request, res: Response): Promise<void> => {
  const boardId = req.query.id as string;

  if (!boardId) {
    res.status(400).json({ error: 'Błędne dane!' });
    return;
  }

  try {
    const messages = await prisma.message.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const messagesWithUserNames = messages.map((message) => ({
      ...message,
      name: message.user.name,
    }));

    res.status(200).json({ messages: messagesWithUserNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera!' });
  }
};
