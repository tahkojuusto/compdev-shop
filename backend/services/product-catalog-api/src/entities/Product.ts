import { Entity, Column, PrimaryColumn, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import { Min, Max, IsDefined, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { ProductPrice } from './';
import { config } from '../utils';
import { Type } from 'class-transformer';

export enum Unit {
  KG = 'kg',
  PCS = 'pcs',
  L = 'l',
}

@Entity({ schema: config.db.schema, name: 'product' })
export class Product {
  @PrimaryColumn({ name: 'productid' })
  id: number;

  @Column({ name: 'name' })
  @Min(1)
  @Max(30)
  name: string;

  @Column({ nullable: true, name: 'description' })
  @Max(100)
  description?: string;

  @Column({ type: 'text', name: 'unit' })
  unit: Unit;

  @IsDefined()
  @OneToMany(() => ProductPrice, price => price.product)
  prices: ProductPrice[];
}
