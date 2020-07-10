import { logger } from '../../utils';

import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

class APIProduct {
  id: number;
  name: string;
  description: string;
  unit: string;
  prices: {
    effectiveAt: string;
    price: number;
  };
}

class OutputProduct {
  id: number;
  name: string;
  description: string;
  unit: string;
}

export class ProductAPI extends RESTDataSource {
  constructor(productApiUrl: string) {
    super();
    this.baseURL = productApiUrl;
  }

  public async getProducts(): Promise<OutputProduct[]> {
    return await this.get<APIProduct[]>('/products');
  }

  public async getProductById(id: number): Promise<OutputProduct> {
    return await this.get<APIProduct>(`/products/${id}`);
  }
}
