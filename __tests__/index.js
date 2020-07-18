const db = require('../database/dbConfig')
const request = require('supertest')
const server = require('../api/server')

// a global jest hook to run before each individual test
beforeEach(async () => {
	// re-run the seeds and start with a fresh database for each test
	await db.seed.run()
})

// a global jest hook to run after all the tests are done
afterAll(async () => {
	// closes the database connection so the jest command doesn't stall
	await db.destroy()
})

// TEST route
describe('test route', () => {
    it('should return a 200 status code', async () => {
        const expected = 200
        const response = await request(server).get('/')
        expect(response.status).toEqual(expected)
    })
})

// AUTHENTICATION testing
describe("login user", () => {
    it('returns 200 login with proper credentials', async () => {
        const payload = { username: "test1", password: "password" }
        const response = await request(server)
            .post("/api/auth/login")
            .send(payload)
        expect(response.statusCode).toBe(200)
    })
    it('returns 401 status if wrong credentials', async () => {
        const payload = { username: "fake", password: "fakepassword" }
        const response = await request(server)
            .post("/api/auth/login")
            .send(payload)
        expect(response.statusCode).toBe(401)
    })
    it('returns 500 internal service error if wrong json is provided', async () => {
        const payload = { NOTusername: "test1", NOTpassword: "password" }
        const response = await request(server)
            .post("/api/auth/login")
            .send(payload)
        expect(response.statusCode).toBe(500)
    })
})

// REGISTER testing
describe("register user", () => {
    it('returns 201 created if username and password are provided', async () => {
        const payload = { username: "a", password: "password" }
        const response = await request(server)
            .post("/api/auth/register")
            .send(payload)
        expect(response.statusCode).toBe(201)
    })
    it('returns 409 conflict if username exists', async () => {
        const payload = { username: "test1", password: "password" }
        const response = await request(server)
            .post("/api/auth/register")
            .send(payload)
        expect(response.statusCode).toBe(409)
    })
    it('returns 500 internal service error if wrong json is provided', async () => {
        const payload = { NOTusername: "test1", NOTpassword: "password" }
        const response = await request(server)
            .post("/api/auth/register")
            .send(payload)
        expect(response.statusCode).toBe(500)
    })
})

// JOKES route
describe('jokes route', () => {
    it('should return a 401 status if not logged in', async () => {
        const expected = 401
        const response = await request(server).get('/api/jokes')
        expect(response.status).toBe(expected)
    })
    it('returns 200 status with proper credentials', async () => {
        const payload = { username: "test1", password: "password" }
        const response = await request(server)
            .post("/api/auth/login")
            .send(payload)
            .then(await request(server)
            .get('/api/jokes')
            )
        expect(response.statusCode).toBe(200)
    })
})
