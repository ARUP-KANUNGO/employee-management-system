import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

export async function globalSetup() {
  process.env.NODE_ENV = 'test'
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()
}

export async function globalTeardown() {
  if (mongoServer) {
    await mongoServer.stop()
  }
}

export default globalSetup
