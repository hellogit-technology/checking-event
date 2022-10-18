import { Request, Response, NextFunction } from 'express';

export const isLogged = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return next();
};
