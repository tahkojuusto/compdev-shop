import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from './utils';

export class APIProduct {
  id: number;
  name: string;
  prices: {
    effectiveAt: string;
    price: number;
  }[]
}

export class API {
  private baseUrl: string;
  private instance: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.instance = axios.create({
      baseURL: baseUrl
    });
  }

  public async getProducts(): Promise<APIProduct[]> {
    const response: AxiosResponse<APIProduct[]> = await this.instance.get('/products');
    return response.data;
  }

  public async getProductById(productId: number): Promise<APIProduct> {
    const response: AxiosResponse<APIProduct> = await this.instance.get(`/products/${productId}`);
    logger.info(`Invoked products microservice with status ${response.status}: GET /products/${productId}.`);
    return response.data;
  }
};