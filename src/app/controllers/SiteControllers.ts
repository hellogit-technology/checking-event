import { NextFunction, Request, Response } from 'express';
import path from 'path'
import * as controllers from '../../constant/controllers';
import {injectFile} from '../../utils/inject'
import {Event} from '../models'

// Add files to layout
const forWebpackDir = {
  css: path.join(__dirname, '../public/css'),
  js: path.join(__dirname, '../public/js')
};
const defaultDir = {
  css: path.join(__dirname, '../../../public/css'),
  js: path.join(__dirname, '../../../public/js')
};
const files = {
  cssFile: injectFile(controllers.Configuration.deployment === true ? forWebpackDir.css : defaultDir.css, 'style'),
  // jsFile: injectFile(controllers.Configuration.deployment === true ? forWebpackDir.js : defaultDir.js, 'global'),
};

class SiteControllers {
  // [GET] /:id/:slug
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id
      const event = await Event.findOne({eventId: eventId})

      // Event not exist
      if(!event) {
        return res.status(200).json('Event not found!')
      }

      // Event expire
      if(event['expire'] === true) {
        return res.status(200).json('Event expired')
      }

      const themeCheckingPage = event['poster']
      req.session.eventIdParam = eventId
      res.status(200).render('index', {files});
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
