import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { inviteCodeLength } from '../config';

export const inviteCode = async (req: Request, res: Response): Promise<void> => {
  const inviteCode = uuidv4().slice(0, inviteCodeLength);
  res.status(200).json({ code: inviteCode });
};

export const handleInviteCode = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.body;

  if (!code || code.length !== inviteCodeLength) {
    res.status(400).json({ error: 'Błędny kod!' });
    return;
  }

  // some database logic here

  // should also return boardId and boardName which this code is for

  res.status(200).json({ message: 'Kod zaakceptowany!' });
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const boardId = uuidv4();

  if (!name) {
    res.status(400).json({ error: 'Błędne dane!' });
    return;
  }

  res.status(201).json({ name, boardId });
};
