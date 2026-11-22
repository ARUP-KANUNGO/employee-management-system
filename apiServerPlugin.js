import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer = null
let connected = false

async function ensureDb() {
  if (connected) return
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  connected = true
  console.log('[vite-plugin-api] MongoDB Memory Server connected at', uri)
}

export function apiServerPlugin() {
  let expressApp = null

  return {
    name: 'api-server',
    apply: 'serve',
    configureServer(viteServer) {
      viteServer.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next()
        }
        try {
          if (!expressApp) {
            process.env.NODE_ENV = 'development'
            process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_insecure_secret_change_me'
            await ensureDb()
            const { createApp } = await import('./server/src/app.js')
            expressApp = createApp()
          }
          expressApp(req, res, next)
        } catch (err) {
          console.error('[vite-plugin-api] Error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, message: 'Internal server error' }))
        }
      })
    },
  }
}
