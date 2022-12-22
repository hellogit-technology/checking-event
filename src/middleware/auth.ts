import { Request, Response, NextFunction } from 'express';

export const requiredAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session.redirectUrl = req.originalUrl;
  return res.redirect('/attendance');
};
