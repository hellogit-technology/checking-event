import { Router } from 'express';
import siteControllers from '../app/controllers/SiteControllers';

const router = Router();

router.get('*', siteControllers.errorRender);

export default router;
