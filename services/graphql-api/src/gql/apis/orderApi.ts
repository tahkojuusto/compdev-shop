import { logger } from '../../utils';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

class APIOrder {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
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

class InputOrder {
  firstName: string;
  lastName: string;
  streetAddress: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  products: {
    productId: number;
    quantity: number;
  }[];
}

class OutputOrder {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
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

  public willSendRequest(request: RequestOptions) {
    request.headers.set('x-user-id', this.context.user.sub);
  }

  public async getOrders(): Promise<OutputOrder[]> {
    return await this.get<APIOrder[]>('/orders');
  }

  public async getOrderById(id: number): Promise<OutputOrder> {
    return await this.get<APIOrder>(`/orders/${id}`);
  }

  public async createOrder(inputOrder: InputOrder): Promise<OutputOrder> {
    return await this.post<APIOrder>(`/orders`, inputOrder);
  }  
}
