import { Request, Response, NextFunction } from 'express';

export const redirectHTTPS = (req: Request, res: Response, next: NextFunction) => {
  if (req.get('X-Forwarded-Proto') === 'http') {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  } else {
    next();
  }
};
