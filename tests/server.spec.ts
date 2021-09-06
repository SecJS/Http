import supertest from 'supertest'

import { SecJS } from '../src/SecJS'
import { SecContextContract } from '@secjs/contracts'

describe('\n Server', () => {
  let server: SecJS

  beforeEach(() => {
    server = new SecJS()

    server.get('/tests', (ctx: SecContextContract) => {
      ctx.response.status(200).json({ data: [{ id: 1, name: 'Test 1' }] })
    })
    server.get(
      '/tests/:id/unitaries/:unitaries_id',
      (ctx: SecContextContract) => {
        ctx.response
          .status(200)
          .json({ data: { id: 1, name: 'Unit Test 1', testId: 1 } })
      },
    )

    server.listen()
  })

  afterEach(() => {
    server.close()
  })

  it('should be able to create a Http server using SecJS', async () => {
    const response = await supertest('http://localhost:4040')
      .get('/')
      .expect(404)

    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({ message: 'Not found!' })
    expect(response.get('Content-Type')).toBe('application/json')
  })

  it('should be able to create routes with handlers', async () => {
    const response = await supertest('http://localhost:4040')
      .get('/tests')
      .expect(200)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ data: [{ id: 1, name: 'Test 1' }] })
    expect(response.get('Content-Type')).toBe('application/json')
  })

  it('should be able to create routes with params', async () => {
    const response = await supertest('http://localhost:4040')
      .get('/tests/1/unitaries/1')
      .expect(200)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({
      data: { id: 1, name: 'Unit Test 1', testId: 1 },
    })
    expect(response.get('Content-Type')).toBe('application/json')
  })
})
