import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { saltRounds } from '../config';
import passport from 'passport';

const prisma = new PrismaClient();

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Brak autoryzacji' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ error: 'Email już w użyciu.' });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashed_password: hash,
      },
    });

    res.status(201).json({ message: 'Utworzono użytkownika', name: newUser.name, sessionId: req.sessionID, id: newUser.id });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(404).json({ error: 'Nie znaleziono użytkownika.' });
        return;
      }

      const match = await bcrypt.compare(password, user.hashed_password);

      if (!match) {
        res.status(401).json({ error: 'Niepoprawne hasło.' });
        return;
      }

      res.status(200).json({ message: 'Zalogowano pomyślnie', name: user.name, sessionId: req.sessionID, id: user.id });
    } catch (error) {
      res.status(500).json({ error });
    }
  })(req, res, next);
};

export const userId = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'Nie znaleziono użytkownika.' });
      return;
    }

    res.status(200).json({ id: user.id });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const users = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};
