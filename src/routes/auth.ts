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

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', failureFlash: true }), (req: Request, res: Response, next: NextFunction) => {
  return res.redirect('/checking/record');
});

// router.get('/logout', isLogged, (req: Request, res: Response, next: NextFunction) => {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(400).json('Unable to log out');
//       }
//       return res.redirect('/login');
//     });
//   } else {
//     res.end();
//   }
// });

export default router;
