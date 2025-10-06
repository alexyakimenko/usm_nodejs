import express from 'express'
import path from "path"
import { fileURLToPath } from 'url'

import config from './config/config.ts' 
import router from './router/index.ts'
import errorController from './controllers/errorController.ts'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.locals = { // global variable to all views
    site: {
        title: config.app.name
    }
}

// debug
app.use((req, _res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/', router)
app.use(errorController.notFound)

app.listen(config.server.port, () => {
    console.log(`Server is listening on localhost:${config.server.port}`)
})