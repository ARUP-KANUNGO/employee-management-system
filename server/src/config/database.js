import mongoose from 'mongoose'
import config from './index.js'

export async function connectDatabase(uri = config.mongoUri) {
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  return mongoose.connection
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

export default { connectDatabase, disconnectDatabase }
