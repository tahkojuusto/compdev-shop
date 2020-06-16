import express from 'express';

import { logger } from '../utils';
import { Product } from '../entities';
import { getRepository, Repository } from 'typeorm';

export class ProductController {
  private productRepository: Repository<Product>;

  public constructor() {
    this.productRepository = getRepository(Product);
  }

  public async getProducts(req: express.Request, res: express.Response): Promise<express.Response<Product[]>> {
    logger.verbose('Started GET /products.');
    const products = await this.productRepository.find();
    logger.info('Executed GET /products with status 200.');
    return res.status(200).json(products);
  }
}
