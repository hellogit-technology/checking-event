import { NextFunction, Request, Response } from 'express';

class SiteControllers {
  // [GET] /
  checking(req: Request, res: Response, next: NextFunction) {
    res.status(200).render('checking');
  }

  // [GET] *
  errorRender(req: Request, res: Response, next: NextFunction) {
    res.status(404).render('404');
  }
}

export default new SiteControllers();
