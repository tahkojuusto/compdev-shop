import request, { Response } from 'supertest';
import { initExpressApp } from '../src/app';
import { Server } from 'http';
import * as typeorm from 'typeorm';
import axios from 'axios';
import { logger } from '../src/utils';

import ORDERS from './resources/orders.json';
import ORDER_BY_ID from './resources/orderById.json';
import CREATE_ORDER from './resources/createOrder.json';
import PRODUCTS from './resources/products.json';

describe('GET /orders', () => {
  let app: Server;

  beforeAll(() => {
    logger.silent = true;

    // Mocks
    (typeorm as any).getRepository = jest.fn().mockReturnValue({
      find: async () => Promise.resolve(ORDERS),
    });

    app = initExpressApp().listen(9000);
  });

  afterAll(() => {
    logger.silent = false;
    app.close();
  });

  it("should not get other user's orders", done => {
    request(app)
      .get('/orders')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should get orders', done => {
    expect.assertions(2);

    request(app)
      .get('/orders')
      .set('x-user-id', 'testuser')
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        expect(res.body.length).toBe(3);
        expect(res.body[0].products.length).toBe(2);
      })
      .expect(200, done);
  });
});

describe('GET /orders/{orderId}', () => {
  let app: Server;

  beforeAll(() => {
    logger.silent = true;

    // Mocks
    (typeorm as any).getRepository = jest.fn().mockReturnValue({
      findOne: async (id: number) => {
        if (id === 2) return Promise.resolve(ORDER_BY_ID);
        return null;
      },
    });

    app = initExpressApp().listen(9000);
  });

  afterAll(() => {
    logger.silent = false;
    app.close();
  });

  it('should not get other users order', done => {
    request(app)
      .get('/orders/2')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should get order by id', done => {
    expect.assertions(2);

    request(app)
      .get('/orders/2')
      .set('x-user-id', 'testuser')
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        expect(res.body.id).toBe(2);
        expect(res.body.products[0].productId).toBe(1);
      })
      .expect(200, done);
  });

  it('should not find nonexistent order', done => {
    request(app)
      .get('/orders/4')
      .set('x-user-id', 'testuser')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('POST /orders', () => {
  let app: Server;

  beforeAll(() => {
    logger.silent = true;

    // Mocks
    (typeorm as any).getRepository = jest.fn().mockReturnValue({
      save: jest.fn().mockResolvedValue({
        ...CREATE_ORDER,
        id: 1,
      })
    });

    (axios as any).create = jest.fn().mockReturnValue({
      get: jest
        .fn()
        .mockResolvedValueOnce({ data: PRODUCTS[0] })
        .mockResolvedValueOnce({ data: PRODUCTS[1] }),
    });

    app = initExpressApp().listen(9000);
  });

  afterAll(() => {
    logger.silent = false;
    app.close();
  });

  it('should not accept orders from unauthenticated user', done => {
    request(app)
      .post('/orders')
      .send(CREATE_ORDER)
      .expect('Content-Type', /json/)
      .expect(401, done);
  });  

  it('should not accept invalid order', done => {
    request(app)
      .post('/orders')
      .set('x-user-id', 'testuser')
      .send({ x: '2' })
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should accept correct order', done => {
    expect.assertions(1);

    request(app)
      .post('/orders')
      .set('x-user-id', 'testuser')
      .send(CREATE_ORDER)
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        expect(res.body.id).toBe(1);
      })
      .expect(201, done);
  });
});
