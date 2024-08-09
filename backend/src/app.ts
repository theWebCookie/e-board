import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';
import session from 'express-session';
import config from 'config';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { router } from './routes';

interface appConfig {
  port: number;
  sessionSecret: string;
}

const appConfig = config.get<appConfig>('app');

const app: Application = express();
const port = appConfig.port;
const prisma = new PrismaClient();

app.use(express.json());

app.use(
  session({
    secret: appConfig.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'name', passwordField: 'password' }, async (name, password, done) => {
    const user = await prisma.user.findFirst({ where: { name: name } });
    console.log('user', user);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid password' });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id: number, done) => {
  try {
    const user = prisma.user.findFirst({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

async function main() {
  // const allUsers = await prisma.user.findMany();
  // console.dir(allUsers, { depth: null });
}

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
