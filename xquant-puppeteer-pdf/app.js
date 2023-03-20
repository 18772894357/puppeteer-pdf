import Koa from 'koa'
import Router from 'koa-router'
import routes from './routers'
import KoaStatic from 'koa-static'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'

class App extends Koa {
  constructor () {
    super()
    this.initRoute()
  }
  initRoute () {
    this.use(KoaStatic(path.join(__dirname, './public')))
    this.use(bodyParser())
    this.use(cors())
    const router = new Router()
    routes.forEach(routeConfig => {
      const [method, url, path, event] = routeConfig
      router[method].apply(router, [url, async (context, next) => {
        const IndexController = require(`./controllers/${path}`).default
        const indexController = new IndexController(context, next)
        await indexController[event](context, next)
      }])
    })
    this.use(router.routes())
  }
}

export default App