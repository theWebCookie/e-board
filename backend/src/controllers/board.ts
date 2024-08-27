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

  res.status(200).json({ message: 'Kod zaakceptowany!', boardId });
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, userId } = req.body;
  const boardId = uuidv4();
  const boardInviteCode = getInviteCode();

  if (!name) {
    res.status(400).json({ error: 'Błędne dane!' });
    return;
  }

  try {
    await prisma.board.create({
      data: {
        id: boardId,
        name,
        authorId: parseInt(userId),
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

  const boardsWithUsers = boardIds.map((boardId) => {
    const board = userBoards.find((ub) => ub.boardId === boardId)?.Board;
    const users = boardUsers.filter((bu) => bu.boardId === boardId).map((bu) => bu.User);
    return {
      ...board,
      users,
    };
  });

  res.status(200).json({ boardsWithUsers });
};
