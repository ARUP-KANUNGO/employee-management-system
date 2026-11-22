import request from 'supertest'
import { createApp } from '../src/app.js'
import { connectTestDb, clearDatabase } from './helpers.js'

let app

beforeAll(async () => { await connectTestDb(); app = createApp() })
afterEach(async () => { await clearDatabase() })

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new admin user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin',
      })
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
      expect(res.body.data.user.email).toBe('admin@test.com')
      expect(res.body.data.user.role).toBe('admin')
      expect(res.body.data.user.password).toBeUndefined()
    })

    it('should register an employee user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe', email: 'jane@test.com', password: 'password123', role: 'employee',
      })
      expect(res.status).toBe(201)
      expect(res.body.data.user.role).toBe('employee')
    })

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Admin', email: 'dup@test.com', password: 'password123',
      })
      const res = await request(app).post('/api/auth/register').send({
        name: 'Another', email: 'dup@test.com', password: 'password123',
      })
      expect(res.status).toBe(409)
    })

    it('should validate input', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'A', email: 'not-email', password: '12',
      })
      expect(res.status).toBe(400)
      expect(res.body.details).toBeDefined()
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login User', email: 'login@test.com', password: 'password123',
      })
    })

    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@test.com', password: 'password123',
      })
      expect(res.status).toBe(200)
      expect(res.body.data.token).toBeDefined()
      expect(res.body.data.user.email).toBe('login@test.com')
    })

    it('should reject invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@test.com', password: 'wrongpassword',
      })
      expect(res.status).toBe(401)
    })

    it('should reject non-existent user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'noone@test.com', password: 'password123',
      })
      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const reg = await request(app).post('/api/auth/register').send({
        name: 'Me User', email: 'me@test.com', password: 'password123',
      })
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${reg.body.data.token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.user.email).toBe('me@test.com')
    })

    it('should reject without token', async () => {
      const res = await request(app).get('/api/auth/me')
      expect(res.status).toBe(401)
    })

    it('should reject with invalid token', async () => {
      const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalidtoken')
      expect(res.status).toBe(401)
    })
  })
})
