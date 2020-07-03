import { Request, Response } from 'express';

import { logger } from '../utils';
import { Product, ProductPrice } from '../entities';
import { getRepository, Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { isUUID, isInt } from 'class-validator';
import { config } from 'dotenv/types';

export class ProductController {
  private productRepository: Repository<Product>;

  public constructor() {
    this.productRepository = getRepository(Product);
  }

  public async getProducts(req: Request, res: Response): Promise<Response<Product[]>> {
    logger.verbose('Started GET /products.');

    try {
      const products = await this.productRepository.find({ relations: ['prices'] });
      logger.info('Executed GET /products with status 200.');
      return res.status(200).json(classToPlain(products));
    } catch (ex) {
      logger.error(`Executed GET /products with status 500: ${ex.message}`);
      return res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  }

  public async getProduct(
    req: Request,
    res: Response
  ): Promise<Response<Product>> {
    logger.verbose('Started GET /products/{productId}.');

    try {
      if (!req.params.productId || isNaN(parseInt(req.params.productId))) {
        logger.warn(`Executed GET /products/${req.params.productId} with status 400 (invalid product id).`);
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid product id was given.',
        });
      }

      const productId = parseInt(req.params.productId);

      const product: Product | undefined = await this.productRepository.findOne(productId, { relations: ['prices'] });
      if (product) {
        logger.info(`Executed GET /products/${productId} with status 200.`);
        return res.status(200).json(classToPlain(product));
      } else {
        logger.warn(`Executed GET /products/${productId} with status 404.`);
        return res.status(404).json(null);
      }
    } catch (ex) {
      logger.error(`Executed GET /products/{productId} with status 500: ${ex.message}`);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
