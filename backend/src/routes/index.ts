import { status, account, board, notification, messages } from '../controllers';
import { Router } from 'express';
import { authenticateAndValidateJwt } from '../middleware/validateJwt';

const router: Router = Router();
router.get('/status', status.get);
router.post('/register', account.register);
router.post('/login', account.login);

router.use(authenticateAndValidateJwt);

router.get('/users', account.users);
router.post('/handleInviteCode', board.handleInviteByCode);
router.post('/create', board.create);
router.get('/userBoards', board.userBoards);

router.get('/boards', board.boards);
router.get('/boardsInvites', board.boardsInvites);
router.get('/boardUsers', board.boardUsers);
router.get('/userBoards', board.userBoards);
router.get('/load', board.handleBoardContentLoad);
router.delete('/board', board.handleBoardDelete);

router.get('/notification', notification.handleNotificationGet);
router.delete('/notification', notification.handleNotificationDelete);

router.get('/messages', messages.handleBoardContentLoad);

export { router };
