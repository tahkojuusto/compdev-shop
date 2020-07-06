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
    let products: APIProduct[] = [];
    let outputProducts: OutputProduct[] = [];

    try {
      products = await this.get<APIProduct[]>('/products');

      outputProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        unit: product.unit,
      }));
    } catch (ex) {
      logger.error(`Failed to fetch products: ${ex.message}`);
      throw ex;
    }

    return outputProducts;
  }

  public async getProductById(id: number): Promise<OutputProduct> {
    let product: APIProduct | null = null;
    let outputProduct: OutputProduct | null = null;

    try {
      product = await this.get<APIProduct>(`/products/${id}`);

      outputProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        unit: product.unit,
      };
    } catch (ex) {
      logger.error(`Failed to fetch product by id ${id}: ${ex.message}`);
      throw ex;
    }

    return outputProduct;
  }
}
