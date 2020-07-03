import { IResolvers } from 'apollo-server';
import axios from 'axios';
import { API, APIProduct } from './api';
import { config, logger } from './utils';

const api: API = new API(
  `${config.api.productCatalog.url}:${config.api.productCatalog.port}`
);

const resolvers: IResolvers = {
  Unit: {
    KG: 'kg',
    PCS: 'pcs',
    L: 'l',
  },
  Query: {
    Products: async () => {
      let internalProducts: APIProduct[] = [];
      let products: any[] = [];

      try {
        internalProducts = await api.getProducts();

        products = internalProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          unit: product.unit,
        }));
      } catch (ex) {
        logger.error(`Failed to fetch products: ${ex.message}`);
        throw ex;
      }

      return products;
    },
    Product: async (parent, { id }: { id: number }) => {
      let internalProduct: APIProduct | null = null;
      let product: any = null;

      try {
        internalProduct = await api.getProductById(id);

        product = {
          id: internalProduct.id,
          name: internalProduct.name,
          description: internalProduct.description,
          unit: internalProduct.unit,
        };
      } catch (ex) {
        logger.error(`Failed to fetch products: ${ex.message}`);
        throw ex;
      }

      return product;
    },
  },
};

export default resolvers;
