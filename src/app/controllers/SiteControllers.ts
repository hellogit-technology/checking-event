import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { injectFile } from '../../utils/inject';
import { Event } from '../models';

interface Path {
  css: string;
  js: string;
  lib: string;
}

interface File {
  cssFile: string;
  jsFile: string;
  libFile: string;
}

const assetsDir: Path = {
  css: path.join(__dirname, '../../../public/css'),
  js: path.join(__dirname, '../../../public/js'),
  lib: path.join(__dirname, '../../../public/lib')
};

const files: File = {
  cssFile: injectFile(assetsDir.css, 'style'),
  jsFile: injectFile(assetsDir.js, 'scripts'),
  libFile: injectFile(assetsDir.lib, 'confetti')
};

class SiteControllers {
  // [GET] /attendance
  async attendance(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).render('attendance', { files });
    } catch (error) {
      console.log(error);
    }
  }

  // [GET] /failed
  failed(req: Request, res: Response, next: NextFunction) {
    try {
      const message = req.flash('message')[0]
      res.status(200).render('failed', {message});
    } catch (error) {
      console.log(error);
    }
  }

  // [GET] /event-not-exist
  exist(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).render('exist')
    } catch (error) {
      console.log(error)
    }
  }

  // [GET] *
  errorRender(req: Request, res: Response, next: NextFunction) {
    res.status(404).render('404');
  }
}

export default new SiteControllers();
