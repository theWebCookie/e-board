import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from 'config';
import { router } from './routes';
import session from 'express-session';
import { createServer } from 'http';
import { setupWebSocketServer } from './index';

declare module 'express-session' {
  export interface SessionData {
    jwtToken?: string;
  }
}

export interface IAppConfig {
  port: number;
  jwtSecret: string;
  issuer: string;
  audience: string;
}

const appConfig = config.get<IAppConfig>('app');
const prisma = new PrismaClient();
const app: Application = express();
const port = appConfig.port;

app.use(session({ secret: appConfig.jwtSecret, resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: appConfig.jwtSecret,
  issuer: appConfig.issuer,
  audience: appConfig.audience,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use('/api', router);

const server = createServer(app);

setupWebSocketServer(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
