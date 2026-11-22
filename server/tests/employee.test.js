import request from 'supertest'
import { createApp } from '../src/app.js'
import { connectTestDb, clearDatabase } from './helpers.js'

let app
let adminToken
let employeeToken
let employeeUserId
let linkedEmployeeId

beforeAll(async () => { await connectTestDb(); app = createApp() })
afterEach(async () => { await clearDatabase() })

async function createAdmin() {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Admin', email: 'admin@emp.com', password: 'password123', role: 'admin',
  })
  return res.body.data
}

async function createEmployeeUser() {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Worker', email: 'worker@emp.com', password: 'password123', role: 'employee',
  })
  return res.body.data
}

async function createEmployee(extra = {}) {
  const payload = {
    name: 'John Smith', email: 'john@emp.com', phone: '555-1234',
    department: 'Engineering', designation: 'Software Engineer',
    salary: 75000, joiningDate: '2024-01-15', status: 'active',
    ...extra,
  }
  const res = await request(app).post('/api/employees').send(payload).set('Authorization', `Bearer ${adminToken}`)
  return res.body.data.employee
}

beforeEach(async () => {
  const admin = await createAdmin()
  adminToken = admin.token
  const empUser = await createEmployeeUser()
  employeeToken = empUser.token
  employeeUserId = empUser.user._id
})

describe('Employee API', () => {
  describe('POST /api/employees', () => {
    it('should create an employee as admin', async () => {
      const emp = await createEmployee({ email: 'create@emp.com' })
      expect(emp._id).toBeDefined()
      expect(emp.name).toBe('John Smith')
      expect(emp.employeeId).toMatch(/^EMP-/)
    })

    it('should reject create without admin role', async () => {
      const res = await request(app).post('/api/employees').set('Authorization', `Bearer ${employeeToken}`).send({
        name: 'Test', email: 'test2@emp.com', department: 'Engineering',
        designation: 'Dev', salary: 50000, joiningDate: '2024-01-01',
      })
      expect(res.status).toBe(403)
    })

    it('should reject create without auth', async () => {
      const res = await request(app).post('/api/employees').send({
        name: 'Test', email: 'test3@emp.com', department: 'Engineering',
        designation: 'Dev', salary: 50000, joiningDate: '2024-01-01',
      })
      expect(res.status).toBe(401)
    })

    it('should reject duplicate email', async () => {
      await createEmployee({ email: 'dup@emp.com' })
      const res = await request(app).post('/api/employees').set('Authorization', `Bearer ${adminToken}`).send({
        name: 'Another', email: 'dup@emp.com', department: 'Engineering',
        designation: 'Dev', salary: 50000, joiningDate: '2024-01-01',
      })
      expect(res.status).toBe(409)
    })

    it('should validate required fields', async () => {
      const res = await request(app).post('/api/employees').set('Authorization', `Bearer ${adminToken}`).send({
        name: '', email: 'bad',
      })
      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/employees', () => {
    it('should list employees with pagination', async () => {
      await createEmployee({ email: 'list1@emp.com', name: 'Alice' })
      await createEmployee({ email: 'list2@emp.com', name: 'Bob' })
      const res = await request(app).get('/api/employees').set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.data.length).toBe(2)
      expect(res.body.meta.pagination.totalItems).toBe(2)
    })

    it('should search by name', async () => {
      await createEmployee({ email: 'search1@emp.com', name: 'Zack Alpha' })
      await createEmployee({ email: 'search2@emp.com', name: 'Beta Gamma' })
      const res = await request(app).get('/api/employees?search=Zack').set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.data.length).toBe(1)
      expect(res.body.data[0].name).toBe('Zack Alpha')
    })

    it('should filter by department', async () => {
      await createEmployee({ email: 'dept1@emp.com', department: 'Engineering' })
      await createEmployee({ email: 'dept2@emp.com', department: 'Marketing' })
      const res = await request(app).get('/api/employees?department=Marketing').set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.data.length).toBe(1)
      expect(res.body.data[0].department).toBe('Marketing')
    })

    it('should filter by status', async () => {
      await createEmployee({ email: 'st1@emp.com', status: 'active' })
      await createEmployee({ email: 'st2@emp.com', status: 'inactive', name: 'Inact' })
      const res = await request(app).get('/api/employees?status=inactive').set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.data.length).toBe(1)
      expect(res.body.data[0].status).toBe('inactive')
    })

    it('should reject listing without auth', async () => {
      const res = await request(app).get('/api/employees')
      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/employees/:id', () => {
    it('should get a single employee', async () => {
      const emp = await createEmployee({ email: 'getone@emp.com' })
      const res = await request(app).get(`/api/employees/${emp._id}`).set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.data.employee._id).toBe(emp._id)
    })

    it('should return 404 for non-existent id', async () => {
      const res = await request(app).get('/api/employees/65a0a0a0a0a0a0a0a0a0a0a0').set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/employees/:id', () => {
    it('should update an employee as admin', async () => {
      const emp = await createEmployee({ email: 'update@emp.com' })
      const res = await request(app).put(`/api/employees/${emp._id}`).set('Authorization', `Bearer ${adminToken}`).send({
        designation: 'Senior Engineer', salary: 95000,
      })
      expect(res.status).toBe(200)
      expect(res.body.data.employee.designation).toBe('Senior Engineer')
      expect(res.body.data.employee.salary).toBe(95000)
    })
  })

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee as admin', async () => {
      const emp = await createEmployee({ email: 'delete@emp.com' })
      const res = await request(app).delete(`/api/employees/${emp._id}`).set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      const verify = await request(app).get(`/api/employees/${emp._id}`).set('Authorization', `Bearer ${adminToken}`)
      expect(verify.status).toBe(404)
    })

    it('should reject delete without admin role', async () => {
      const emp = await createEmployee({ email: 'del2@emp.com' })
      const res = await request(app).delete(`/api/employees/${emp._id}`).set('Authorization', `Bearer ${employeeToken}`)
      expect(res.status).toBe(403)
    })
  })

  describe('GET /api/employees/stats/summary', () => {
    it('should return dashboard statistics', async () => {
      await createEmployee({ email: 'stat1@emp.com', status: 'active', department: 'Engineering' })
      await createEmployee({ email: 'stat2@emp.com', status: 'inactive', department: 'Marketing' })
      const res = await request(app).get('/api/employees/stats/summary').set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.data.stats.total).toBe(2)
      expect(res.body.data.stats.byStatus.active).toBe(1)
      expect(res.body.data.stats.byStatus.inactive).toBe(1)
      expect(res.body.data.stats.byDepartment.Engineering).toBe(1)
      expect(res.body.data.stats.recent.length).toBeGreaterThan(0)
    })
  })

  describe('Employee self-profile', () => {
    it('should return 404 when no profile is linked', async () => {
      const res = await request(app).get('/api/employees/me/profile').set('Authorization', `Bearer ${employeeToken}`)
      expect(res.status).toBe(404)
    })

    it('should allow employee to update their own profile once linked', async () => {
      // Admin creates an employee and links it to the employee user
      const emp = await createEmployee({ email: 'linked@emp.com' })
      // Use direct DB update via the service to link (simulating admin linking)
      // We link by creating an employee whose linkedUser matches
      // For the test, we'll update the employee via admin to set linkedUser
      const mongoose = (await import('mongoose')).default
      await mongoose.model('Employee').findByIdAndUpdate(emp._id, { linkedUser: employeeUserId })
      linkedEmployeeId = emp._id

      const res = await request(app).put('/api/employees/me/profile').set('Authorization', `Bearer ${employeeToken}`).send({
        phone: '999-888-7777',
      })
      expect(res.status).toBe(200)
      expect(res.body.data.employee.phone).toBe('999-888-7777')
    })
  })
})
