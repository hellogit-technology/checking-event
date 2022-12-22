import { Application } from 'express';
import siteRouter from './site';
import authRouter from './auth';
import errorRouter from './error';
import checkingRouter from './checking';
import { requiredAuth } from '../middleware/auth';

const route = (app: Application) => {
  app.use('/checking', requiredAuth, checkingRouter);

  app.use('/auth', authRouter);

  app.use('/', siteRouter);

  app.use('/', errorRouter);
};

export default route;
