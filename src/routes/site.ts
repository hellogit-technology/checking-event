import {Router} from 'express';
import siteControllers from '../app/controllers/SiteControllers';

const router = Router();

router.get('/attendance', siteControllers.attendance);
router.get('/failed', siteControllers.failed);
router.get('/event-not-exist', siteControllers.exist)

export default router;
