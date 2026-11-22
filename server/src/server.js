import { createApp } from './app.js'
import { connectDatabase } from './config/database.js'
import config from './config/index.js'

async function startServer() {
  try {
    await connectDatabase()
    const app = createApp()
    const server = app.listen(config.port, () => {
      console.log(`Server running in ${config.env} mode on port ${config.port}`)
    })
    const shutdown = async (sig) => {
      console.log(`\n${sig} received. Shutting down gracefully…`)
      server.close(() => process.exit(0))
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
