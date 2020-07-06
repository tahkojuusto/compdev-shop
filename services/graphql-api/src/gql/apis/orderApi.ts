import { logger } from '../../utils';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

class APIOrder {
  id: number;
  firstName: string;
  lastName: string;
  streetAddress: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  products: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

class OutputOrder {
  id: number;
  firstName: string;
  lastName: string;
  streetAddress: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  products: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export class OrderAPI extends RESTDataSource {
  constructor(orderApiUrl: string) {
    super();
    this.baseURL = orderApiUrl;
  }

  public async getOrders(): Promise<OutputOrder[]> {
    let orders: APIOrder[] = [];
    let outputOrders: OutputOrder[] = [];

    try {
      orders = await this.get<APIOrder[]>('/orders');

      outputOrders = orders.map((order: APIOrder) => ({
        id: order.id,
        firstName: order.firstName,
        lastName: order.lastName,
        streetAddress: order.streetAddress,
        postalCode: order.postalCode,
        email: order.email,
        phoneNumber: order.phoneNumber,
        products: order.products,
      }));
    } catch (ex) {
      logger.error(`Failed to fetch orders: ${ex.message}`);
      throw ex;
    }

    return outputOrders;
  }

  public async getOrderById(id: number): Promise<OutputOrder> {
    let order: APIOrder | null = null;
    let outputOrder: OutputOrder | null = null;

    try {
      order = await this.get<APIOrder>(`/orders/${id}`);

      outputOrder = {
        id: order.id,
        firstName: order.firstName,
        lastName: order.lastName,
        streetAddress: order.streetAddress,
        postalCode: order.postalCode,
        email: order.email,
        phoneNumber: order.phoneNumber,
        products: order.products,
      };
    } catch (ex) {
      logger.error(`Failed to fetch order by id ${id}: ${ex.message}`);
      throw ex;
    }

    return outputOrder;
  }
}
