import request from 'supertest'
import { createApp } from '../src/app.js'
import { connectTestDb, clearDatabase } from './helpers.js'

let app
beforeAll(async () => { await connectTestDb(); app = createApp() })
afterEach(async () => { await clearDatabase() })

describe('Health check & misc', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('unknown route returns 404', async () => {
    const res = await request(app).get('/api/nonexistent')
    expect(res.status).toBe(404)
  })
})
