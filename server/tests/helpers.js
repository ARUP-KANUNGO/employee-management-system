import mongoose from 'mongoose'
import { connectDatabase } from '../src/config/database.js'

export async function connectTestDb() {
  if (mongoose.connection.readyState === 0) {
    await connectDatabase(process.env.MONGODB_URI)
  }
}

export async function clearDatabase() {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({})
    }
  }
}
