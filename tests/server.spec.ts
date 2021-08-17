import supertest from 'supertest'

import { Sec } from '../src/server'
import { Context } from './../src/Contracts/HandlerContract'

describe('\n Server', () => {
  it('should be able to create a Http server using SecJS', async () => {
    const server = new Sec()

    server.listen()

    const response = await supertest('http://localhost:4040')
      .get('/')
      .expect(404)

    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({ message: 'Not found!' })
    expect(response.get('Content-Type')).toBe('application/json')

    server.close()
  })

  it('should be able to create routes with handlers', async () => {
    const server = new Sec()

    server.get('/tests', (ctx: Context) => {
      ctx.response.writeHead(200, { 'Content-Type': 'application/json' })

      ctx.response.write(JSON.stringify({ data: [{ id: 1, name: 'Test 1' }] }))
      ctx.response.end()
    })

    server.listen()

    const response = await supertest('http://localhost:4040')
      .get('/tests')
      .expect(200)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ data: [{ id: 1, name: 'Test 1' }] })
    expect(response.get('Content-Type')).toBe('application/json')

    server.close()
  })

  it('should be able to create routes with params', async () => {
    const server = new Sec()

    server.get('/tests/:id/unitaries/:unitaries_id', (ctx: Context) => {
      ctx.response.writeHead(200, { 'Content-Type': 'application/json' })

      ctx.response.write(
        JSON.stringify({ data: { id: 1, name: 'Unit Test 1', testId: 1 } }),
      )
      ctx.response.end()
    })

    server.listen()

    const response = await supertest('http://localhost:4040')
      .get('/tests/1/unitaries/1')
      .expect(200)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({
      data: { id: 1, name: 'Unit Test 1', testId: 1 },
    })
    expect(response.get('Content-Type')).toBe('application/json')

    server.close()
  })
})
