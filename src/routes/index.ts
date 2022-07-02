import { Application } from 'express';
import siteRouter from './site';

const route = (app: Application) => {
  app.use('/', siteRouter);
};

export default route;
