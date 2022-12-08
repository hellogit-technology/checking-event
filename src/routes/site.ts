import express from 'express';
import siteControllers from '../app/controllers/SiteControllers';
import checkingControllers from '../app/controllers/CheckingControllers';

const router = express.Router();

router.get('/:id/:slug', siteControllers.index);
router.get('/failed', siteControllers.failed)
router.get('/checking/record', checkingControllers.checkingEvent)
router.get('/record-success', checkingControllers.successChecking)
router.get('*', siteControllers.errorRender);

export default router;
