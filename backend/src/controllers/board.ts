import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { inviteCodeLength } from '../config';
import { PrismaClient } from '@prisma/client';

interface CustomJwtPayload {
  id: string;
}

const prisma = new PrismaClient();

const getInviteCode = () => {
  return uuidv4().slice(0, inviteCodeLength);
};

export const handleInviteByCode = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.body;
  let boardId;
  let boardName;
  const userId = (req.user as CustomJwtPayload).id;

  if (!code || code.length !== inviteCodeLength) {
    res.status(400).json({ error: 'Błędny kod!' });
    return;
  }

  try {
    const boardInvite = await prisma.boardInvite.findFirst({
      where: {
        code,
      },
    });

    if (!boardInvite) {
      res.status(404).json({ error: 'Nie znaleziono zaproszenia!' });
      return;
    }

    boardId = boardInvite.boardId;

    const board = await prisma.board.findFirst({
      where: {
        id: boardInvite.boardId,
      },
    });

    boardName = board?.name;

    if (!boardInvite.inviteActive) {
      res.status(400).json({ error: 'Zaproszenie nieaktywne!' });
      return;
    }

    const userOnBoard = await prisma.usersOnBoards.findFirst({
      where: {
        userId: parseInt(userId),
        boardId: boardInvite.boardId,
      },
    });

    if (userOnBoard) {
      res.status(400).json({ error: 'Użytkownik już dołączył do tablicy!' });
      return;
    }

    await prisma.usersOnBoards.create({
      data: {
        userId: parseInt(userId),
        boardId: boardInvite.boardId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }

  res.status(200).json({ message: 'Kod zaakceptowany!', boardId, boardName });
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const userId = (req.user as CustomJwtPayload).id;
  const boardId = uuidv4();
  const boardInviteCode = getInviteCode();
  const currentDate = new Date();

  if (!name) {
    res.status(400).json({ error: 'Błędne dane!' });
    return;
  }

  try {
    await prisma.board.create({
      data: {
        id: boardId,
        name,
        content: {},
        authorId: parseInt(userId),
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    await prisma.boardInvite.create({
      data: {
        boardId,
        code: boardInviteCode,
        inviteActive: true,
      },
    });

    await prisma.usersOnBoards.create({
      data: {
        userId: parseInt(userId),
        boardId,
      },
    });
  } catch (error) {
    console.error(error);
  }

  res.status(201).json({ name, boardId, boardInviteCode });
};

export const boards = async (req: Request, res: Response): Promise<void> => {
  const boards = await prisma.board.findMany();
  res.status(200).json({ boards });
};

export const boardsInvites = async (req: Request, res: Response): Promise<void> => {
  const boardInvites = await prisma.boardInvite.findMany();
  res.status(200).json({ boardInvites });
};

export const boardUsers = async (req: Request, res: Response): Promise<void> => {
  const boardUsers = await prisma.usersOnBoards.findMany();
  res.status(200).json({ boardUsers });
};

export const userBoards = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as CustomJwtPayload).id;

  const userBoards = await prisma.usersOnBoards.findMany({
    where: {
      userId: parseInt(userId),
    },
    include: {
      Board: true,
    },
  });

  const boardIds = userBoards.map((userBoard) => userBoard.boardId);

  const boardUsers = await prisma.usersOnBoards.findMany({
    where: {
      boardId: {
        in: boardIds,
      },
    },
    include: {
      User: true,
    },
  });

  const boardInvites = await prisma.boardInvite.findMany({
    where: {
      boardId: {
        in: boardIds,
      },
    },
  });

  const boardsWithUsers = boardIds.map((boardId) => {
    const board = userBoards.find((ub) => ub.boardId === boardId)?.Board;
    const users = boardUsers.filter((bu) => bu.boardId === boardId).map((bu) => bu.User);
    const inviteCode = boardInvites.find((bi) => bi.boardId === boardId)?.code;
    return {
      ...board,
      users,
      inviteCode,
    };
  });

  res.status(200).json({ boardsWithUsers });
};

export const handleBoardContentSave = async (content: any, boardId: string): Promise<void> => {
  if (!boardId || !content) {
    console.log('Błędne dane!');
    return;
  }

  try {
    await prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        content,
      },
    });
  } catch (error) {
    console.error(error);
  }
  console.log('Zapisano dane!');
};

export const handleBoardContentLoad = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Błędne dane!' });
    return;
  }

  try {
    const board = await prisma.board.findFirst({
      where: {
        id: Array.isArray(id) ? id[0] : id,
      },
    });

    if (!board) {
      res.status(404).json({ error: 'Tablica nie znaleziona!' });
      return;
    }

    res.status(200).json({ content: board.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera!' });
  }
};

const saveQueue: { [boardId: string]: NodeJS.Timeout } = {};

export const handleBoardContentSaveDebounced = async (content: any, boardId: string): Promise<void> => {
  if (!boardId || !content) {
    console.log('Błędne dane!');
    return;
  }

  if (saveQueue[boardId]) {
    clearTimeout(saveQueue[boardId]);
  }

  saveQueue[boardId] = setTimeout(async () => {
    try {
      await prisma.board.update({
        where: {
          id: boardId,
        },
        data: {
          content,
        },
      });
      console.log(`Dane zapisane dla boardId: ${boardId}`);
    } catch (error) {
      console.error(`Błąd podczas zapisu dla boardId: ${boardId}`, error);
    } finally {
      delete saveQueue[boardId];
    }
  }, 2000);
};

export const handleBoardDelete = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body;
  const userId = (req.user as CustomJwtPayload).id;

  if (!id) {
    res.status(400).json({ error: 'Błędne dane!' });
    return;
  }

  try {
    const board = await prisma.board.findFirst({
      where: {
        id,
      },
    });

    if (!board) {
      res.status(404).json({ error: 'Tablica nie znaleziona!' });
      return;
    }

    if (board.authorId !== parseInt(userId)) {
      res.status(403).json({ error: 'Nie jesteś autorem tablicy!' });
      return;
    }

    const usersOnBoardsCount = await prisma.usersOnBoards.deleteMany({
      where: {
        boardId: id,
      },
    });

    const boardInviteCount = await prisma.boardInvite.deleteMany({
      where: {
        boardId: id,
      },
    });

    const messageCount = await prisma.message.deleteMany({
      where: {
        boardId: id,
      },
    });

    const boardCount = await prisma.board.delete({
      where: {
        id,
      },
    });

    console.log({ boardInviteCount: boardInviteCount, usersOnBoardsCount: usersOnBoardsCount, messageCount: messageCount, boardCount: boardCount });

    res.status(200).json({ message: 'Tablica usunięta!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
