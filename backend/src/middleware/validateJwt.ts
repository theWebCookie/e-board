import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import passport from 'passport';
import { IAppConfig } from '../app';

const appConfig = config.get<IAppConfig>('app');

export const authenticateAndValidateJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Brak autoryzacji.' });
  }

  jwt.verify(token, appConfig.jwtSecret, { issuer: appConfig.issuer, audience: appConfig.audience }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: `Błąd autoryzacji: ${err.message}` });
    }

    const payload = decoded as JwtPayload;
    if (payload.sub !== req.session?.jwtToken) {
      return res.status(401).json({ message: 'Błąd autoryzacji: Invalid token subject' });
    }

    passport.authenticate('jwt', { session: false }, (authErr: any, user: any) => {
      if (authErr) {
        return res.status(500).json({ error: authErr.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Błąd autoryzacji: Invalid user' });
      }
      req.user = user;
      next();
    })(req, res, next);
  });
};
