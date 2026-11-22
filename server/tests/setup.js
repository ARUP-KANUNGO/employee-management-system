import { jest } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await connectDatabase(uri)
})

afterAll(async () => {
  await disconnectDatabase()
  if (mongoServer) await mongoServer.stop()
})

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({})
    }
  }
})

jest.setTimeout(30000)
