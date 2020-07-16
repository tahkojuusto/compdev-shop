import { MigrationInterface, QueryRunner } from 'typeorm';
import { ProductPrice } from '../entities';

import INIT_PRODUCT_PRICES from './productPrices.json';

export class InitProductPrices1592486873383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const priceRepository = queryRunner.connection.getRepository(ProductPrice);
    await priceRepository.save(INIT_PRODUCT_PRICES as any);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const priceRepository = queryRunner.connection.getRepository(ProductPrice);
    await priceRepository.clear();
  }
}
