import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Min, Max } from 'class-validator';

enum Unit {
  KG = 'kg',
  PCS = 'pcs',
  L = 'l',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Min(1)
  @Max(30)
  name: string;

  @Column()
  @Max(100)
  description: string;

  @Column()
  @Min(0)
  price: number;

  @Column('text')
  unit: Unit;
}
