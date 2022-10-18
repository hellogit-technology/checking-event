import express, {Request, Response, NextFunction} from 'express';
import siteControllers from '../app/controllers/SiteControllers';

const router = express.Router();

router.get('/:id/:slug', siteControllers.index);

//TODO: failure callback passport, 

router.get('*', siteControllers.errorRender);

export default router;
