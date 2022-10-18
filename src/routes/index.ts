import { Application } from 'express';
import siteRouter from './site';
import authRouter from './auth'

const route = (app: Application) => {

  app.use('/auth', authRouter)

  app.use('/', siteRouter);

};

export default route;
