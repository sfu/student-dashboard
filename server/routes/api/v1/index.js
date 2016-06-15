import {Router} from 'express'
import fs from 'fs'

const router = Router({mergeParams: true})

// get the list of files in this directory, excluding this file, and strip the extension
const routesFiles = fs.readdirSync(__dirname)
                      .filter(f => f !== 'index.js')
                      .map(f => f.replace(/\.[^/.]+$/, ""))

// for each file in routesFile, mount it at /${filename} (e.g. users.js gets mounted at /users)
routesFiles.forEach(r => {
  router.use(`/${r}`, require(`./${r}`).default)
})

export default router
