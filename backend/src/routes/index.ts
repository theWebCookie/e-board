import { status, account, board } from '../controllers';
import { Router } from 'express';

const router: Router = Router();
router.get('/status', status.get);

router.post('/register', account.register);
router.post('/login', account.login);
router.get('/users', account.users);

router.get('/inviteCode', board.inviteCode);
router.post('/handleInviteCode', board.handleInviteCode);
router.post('/create', board.create);

export { router };
