import { Router } from 'express';
import { status } from '../controllers';

const router: Router = Router();
router.get('/status', status.get);
