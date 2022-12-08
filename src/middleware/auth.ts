import { Request, Response, NextFunction } from 'express';
import {UserSession} from '../types'

export const isLogged = (req: Request, res: Response, next: NextFunction) => {
  const pathName = req.session.eventURL
  if (!req.user) {
    return res.redirect(`/${pathName}`);
  }

  const userSession: UserSession = req.user;
  if (userSession['isLogged'] !== true) {
    return res.redirect(`/${pathName}`);
  }
  return next();
};
