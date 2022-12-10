import { NextFunction, Request, Response } from 'express';
import path from 'path'
import {injectFile} from '../../utils/inject'
import {Event} from '../models'

interface Path {
  css: string,
  js: string,
  lib: string
}

interface File {
  cssFile: string,
  jsFile: string,
  libFile: string
}

const assetsDir: Path = {
  css: path.join(__dirname, '../../../public/css'),
  js: path.join(__dirname, '../../../public/js'),
  lib: path.join(__dirname, '../../../public/lib')
}

const files: File = {
  cssFile: injectFile(assetsDir.css, 'style'),
  jsFile: injectFile(assetsDir.js, 'scripts'),
  libFile: injectFile(assetsDir.lib, 'confetti')
};


class SiteControllers {

  // [GET] /:id/:slug
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id
      const event = await Event.findOne({eventId: eventId})

      // Event not exist
      if(!event) {
        return res.status(200).render('exist')
      }

      // Event expire
      if(event['expire'] === true) {
        const eventName = event['name']
        return res.status(200).render('expire', {eventName})
      }

      const themeCheckingPage = event['poster']
      req.session.eventURL = req.path
      res.status(200).render('index', {files, themeCheckingPage})
    } catch (error) {
      console.log(error)
    }
  }

  // [GET] *
  errorRender(req: Request, res: Response, next: NextFunction) {
    res.status(404).render('404');
  }

  // [GET] /failed
  failed(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).render('failed')
    } catch (error) {
      console.log(error)
    }
  }


}

export default new SiteControllers();
