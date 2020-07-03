import express from 'express';
import { logger } from '../utils';
import { OrderController } from '../controllers';

class OrderRouter {
  private router: express.Router;
  private orderController: OrderController;

  public constructor() {
    this.router = express.Router();
    this.orderController = new OrderController();

    this.router.get('/', this.orderController.getOrders.bind(this.orderController));
    this.router.get('/:orderId', this.orderController.getOrder.bind(this.orderController));
    this.router.post('/', this.orderController.createOrder.bind(this.orderController));

    logger.verbose('Created order routes.');
  }

  public getRouter() {
    return this.router;
  }
}

export { OrderRouter };
