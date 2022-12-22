import { Router } from 'express';
import checkingControllers from '../app/controllers/CheckingControllers';

const router = Router();

router.get('/:id/:slug', checkingControllers.checkingEvent);
router.get('/record-success', checkingControllers.successChecking);

export default router;
