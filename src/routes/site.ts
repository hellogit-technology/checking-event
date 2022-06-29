import express from 'express'
import siteControllers from '../app/controllers/SiteControllers'

const router = express.Router()

router.get('/',)
router.get('*', siteControllers.errorRender)

export default router