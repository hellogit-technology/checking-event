import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { isLogged } from '../middleware/auth';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  })
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed', failureFlash: true }), (req: Request, res: Response, next: NextFunction) => {
  return res.redirect('/checking/record');
});

export default router;
