import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { plainToClass, classToPlain } from 'class-transformer';

import { logger, config } from '../utils';
import { Order, OrderProduct } from '../entities';
import { InputOrder, InputOrderProduct } from '../inputs';
import { getRepository, Repository, In } from 'typeorm';
import { validate, isUUID, isInt } from 'class-validator';
import { API, APIProduct } from '../api';


export class OrderController {
  private orderRepository: Repository<Order>;
  private api: API;

  public constructor() {
    this.orderRepository = getRepository(Order);
    this.api = new API(`${config.api.productCatalog.url}:${config.api.productCatalog.port}`);
  }

  public async getOrders(
    req: Request,
    res: Response
  ): Promise<Response<Order[]>> {
    logger.verbose('Started GET /orders.');

    try {
      const userId = res.locals.userId;
      const orders = await this.orderRepository.find({ relations: ['products'], where: { userId }});
      logger.info('Executed GET /orders with status 200.');
      return res.status(200).json(classToPlain(orders));
    } catch (ex) {
      logger.error(`Executed GET /products with status 500: ${ex.stack} ${ex.message}`);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  public async getOrder(req: Request, res: Response): Promise<Response<Order>> {
    logger.verbose('Started GET /orders/{orderId}.');

    try {
      if (!req.params.orderId || isNaN(parseInt(req.params.orderId))) {
        logger.warn(`Executed GET /orders/${req.params.orderId} with status 400.`);
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid order id was given.',
        });
      }

      const userId = res.locals.userId;
      const orderId = req.params.orderId;
      const order: Order | undefined = await this.orderRepository.findOne(orderId, { relations: ['products'], where: { userId } });
      if (order) {
        logger.info(`Executed GET /orders/${orderId} with status 200.`);
        return res.status(200).json(classToPlain(order));
      } else {
        logger.warn(`Executed GET /orders/${orderId} with status 404.`);
        return res.status(404).json(null);
      }
    } catch (ex) {
      logger.error(`Executed GET /orders/{orderId} with status 500: ${ex.message}`);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  public async createOrder(
    req: Request,
    res: Response
  ): Promise<Response<Order>> {
    logger.verbose('Started POST /orders.');

    try {
      if (!req.body) {
        logger.warn('Executed POST /orders with status 400 (no body).');
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid body was given.',
        });
      }

      const inputOrder: InputOrder = plainToClass(InputOrder, req.body);
      const inputErrors = await validate(inputOrder);
      if (inputErrors.length > 0) {
        logger.warn('Executed POST /orders with status 400 (invalid body).');
        logger.verbose(`Invalid body: ${JSON.stringify(inputErrors)}`);
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid body was given.',
          inputErrors,
        });
      }

      const userId: string = res.locals.userId;
      
      const order: Order = new Order();
      order.userId = userId;
      order.firstName = inputOrder.firstName;
      order.lastName = inputOrder.lastName;
      order.streetAddress = inputOrder.streetAddress;
      order.postalCode = inputOrder.postalCode;
      order.email = inputOrder.email;
      order.phoneNumber = inputOrder.phoneNumber;
      order.products = await Promise.all(inputOrder.products.map(async product => await this.fetchProduct(order, product)));

      const errors = await validate(order);
      if (errors.length > 0) {
        logger.warn('Executed POST /orders with status 400 (invalid body).');
        logger.verbose(`Invalid body: ${JSON.stringify(errors)}`);
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid body was given.',
          errors,
        });
      }

      const storedOrder: Order = await this.orderRepository.save(order);
      logger.info(
        `Executed POST /orders with status 201 (orderid = ${storedOrder.id}).`
      );

      return res.status(201).json(classToPlain(storedOrder));
    } catch (ex) {
      logger.error(`Executed POST /orders with status 500: ${ex.message}`);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  private async fetchProduct(order: Order, inputProduct: InputOrderProduct): Promise<OrderProduct> {
    const productId: number = inputProduct.productId;
    logger.verbose(`Invoking products microservice: GET /products/{productId}.`);

    let apiProduct: APIProduct | null = null;
    try {
      apiProduct = await this.api.getProductById(productId);
      logger.verbose(`Received response from products microservice: ${JSON.stringify(apiProduct)}`);
    } catch (ex) {
      logger.error(`Failed to invoke products microservice: ${ex.message}`);
      throw ex;
    }

    const orderProduct = new OrderProduct();
    orderProduct.orderId = order.id;
    orderProduct.name = apiProduct.name;
    orderProduct.productId = apiProduct.id;
    orderProduct.price = apiProduct.prices.sort((a, b) => a.effectiveAt > b.effectiveAt ? 1 : -1)[0].price;
    orderProduct.quantity = inputProduct.quantity;

    return orderProduct;
  }
}
