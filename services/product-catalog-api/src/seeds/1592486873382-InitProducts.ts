import { MigrationInterface, QueryRunner } from 'typeorm';
import { Product } from '../entities';

import INIT_PRODUCTS from './products.json';

export class InitProducts1592486873382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productRepository = queryRunner.connection.getRepository(Product);
    await productRepository.save(INIT_PRODUCTS as any);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepository = queryRunner.connection.getRepository(Product);
    await productRepository.clear();
  }
}
