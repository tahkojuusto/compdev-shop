import request, { Response } from 'supertest';
import { initExpressApp } from '../src/app';
import { Server } from 'http';
import * as typeorm from 'typeorm';

import PRODUCTS from './resources/products.json';
import PRODUCT_BY_ID from './resources/productById.json';

describe('GET /products', () => {
  let app: Server;

  beforeAll(() => {
    // Mocks
    (typeorm as any).getRepository = jest.fn().mockReturnValue({
      find: async () => Promise.resolve(PRODUCTS),
    });

    app = initExpressApp().listen(9000);
  });

  afterAll(() => {
    app.close();
  });

  it('should get products', done => {
    expect.assertions(1);

    request(app)
      .get('/products')
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        expect(res.body.length).toBe(2);
      })
      .expect(200, done);
  });
});

describe('GET /products/{productId}', () => {
  let app: Server;

  beforeAll(() => {
    // Mocks
    (typeorm as any).getRepository = jest.fn().mockReturnValue({
      findOne: async (id: number) => {
        if (id === 2) return Promise.resolve(PRODUCT_BY_ID);
        return null;
      }
    });

    app = initExpressApp().listen(9000);
  });

  afterAll(() => {
    app.close();
  });

  it('should get product by id', done => {
    expect.assertions(1);

    request(app)
      .get('/products/2')
      .expect('Content-Type', /json/)
      .expect((res: Response) => {
        expect(res.body.id).toBe(2);
      })
      .expect(200, done);
  });

  it('should not find nonexistent product', done => {
    request(app)
      .get('/products/3')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });  
});
