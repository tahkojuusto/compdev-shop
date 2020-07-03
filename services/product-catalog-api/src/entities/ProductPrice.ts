import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  RelationId,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Min, IsDateString, IsDefined } from 'class-validator';
import { Product } from './';
import { Exclude } from 'class-transformer/decorators';
import { config } from '../utils';

@Entity({ schema: config.db.schema, name: 'product_price' })
export class ProductPrice {
  @Exclude()
  @PrimaryColumn({ type: 'int', name: 'productpriceid' })
  id: number;

  @Column({ type: 'timestamp', name: 'effective_ts' })
  @IsDateString()
  effectiveAt: Date;

  @Column({ type: 'real', name: 'price' })
  @IsDefined()
  @Min(0)
  price: number;

  @Exclude()
  @Column({ type: 'int', nullable: true, name: 'productid' })
  productId: number;

  @ManyToOne(() => Product, product => product.prices)
  @JoinColumn({ name: 'productid' })
  product: Product;
}
