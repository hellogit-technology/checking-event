import { NextFunction, Request, Response } from "express";


class SiteControllers {


    checking(req: Request, res: Response, next: NextFunction) {
        res.status(200).render('checking')
    }

    errorRender(req: Request, res: Response, next: NextFunction) {
        res.status(404).render('404')
    }
}

export default new SiteControllers