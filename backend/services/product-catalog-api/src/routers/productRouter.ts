import express from 'express';
import { logger } from '../utils';
import { ProductController } from '../controllers';

class ProductRouter {
  private router: express.Router;
  private productController: ProductController;

  public constructor() {
    this.router = express.Router();
    this.productController = new ProductController();

    this.router.get('/', this.productController.getProducts.bind(this.productController));
    this.router.get('/:productId', this.productController.getProduct.bind(this.productController));

    logger.verbose('Created product routes.');
  }

  public getRouter() {
    return this.router;
  }
}

export { ProductRouter };
