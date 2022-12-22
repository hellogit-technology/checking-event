import { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  })
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed', failureFlash: true, keepSessionInfo: true }), (req: Request, res: Response, next: NextFunction) => {
  const redirectUrl = req.session.redirectUrl as string
  res.redirect(redirectUrl)
});

export default router;
