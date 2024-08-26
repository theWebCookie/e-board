import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from 'config';
import { router } from './routes';
import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    jwtToken?: string;
  }
}

interface appConfig {
  port: number;
  jwtSecret: string;
}

const appConfig = config.get<appConfig>('app');
const prisma = new PrismaClient();
const app: Application = express();
const port = appConfig.port;

app.use(session({ secret: appConfig.jwtSecret, resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } }));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.jwtSecret,
    },
    async (jwtPayload, done) => {
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
    }
  )
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

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
