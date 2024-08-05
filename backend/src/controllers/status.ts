import { Request, Response } from 'express';

export const get = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });
};
