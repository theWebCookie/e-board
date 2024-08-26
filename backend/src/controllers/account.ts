import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { saltRounds } from '../config';
import jwt from 'jsonwebtoken';
import config from 'config';
import { IAppConfig } from '../app';

const prisma = new PrismaClient();

const appConfig = config.get<IAppConfig>('app');

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

    const token = jwt.sign({ id: newUser.id }, appConfig.jwtSecret, {
      expiresIn: '4h',
      issuer: appConfig.issuer,
      audience: appConfig.audience,
    });

    req.session.jwtToken = token;

    res.status(201).json({ message: 'Utworzono użytkownika', token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const token = jwt.sign({ id: user.id }, appConfig.jwtSecret, {
      expiresIn: '4h',
      issuer: appConfig.issuer,
      audience: appConfig.audience,
    });

    req.session.jwtToken = token;

    res.status(200).json({ message: 'Zalogowano pomyślnie', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error });
  }
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
