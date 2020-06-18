import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { Product, Unit } from '../entities';

const INIT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Banana',
    description: "It's a yellow fruit.",
    price: 1.99,
    unit: Unit.KG,
  },
  {
    id: 2,
    name: 'Apple',
    price: 2.50,
    unit: Unit.KG,
  },
  {
    id: 3,
    name: 'Orange box',
    price: 5.00,
    unit: Unit.PCS
  },    
];

export class InitProducts1592486873382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productRepository = queryRunner.connection.getRepository(Product);
    await productRepository.save(INIT_PRODUCTS);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepository = queryRunner.connection.getRepository(Product);
    await productRepository.clear();
  }
}
