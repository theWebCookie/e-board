import passport from 'passport';
import { status, account, board } from '../controllers';
import { Router } from 'express';

const router: Router = Router();
router.get('/status', status.get);

router.post('/register', account.register);
router.post('/login', account.login);
router.get('/users', account.users);

router.post('/handleInviteCode', board.handleInviteByCode);
router.post('/create', board.create);
router.get('/userBoards', board.userBoards);

router.get('/boards', board.boards);
router.get('/boardsInvites', board.boardsInvites);
router.get('/boardUsers', board.boardUsers);

export { router };
