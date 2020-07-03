import { Entity, Column, PrimaryColumn, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Min, Max, IsDefined, Length } from 'class-validator';
import { config } from '../utils';
import { Order } from './Order';
import { Exclude } from 'class-transformer';

@Entity({ schema: config.db.schema, name: 'product' })
export class OrderProduct {
  @PrimaryColumn({ type: 'int', name: 'productid' })
  productId: number;

  @Column({ name: 'name' })
  @Length(2, 30)
  name: string;

  @Column({ type: 'real', name: 'price' })
  @IsDefined()
  @Min(0)
  price: number;

  @Column({ type: 'int', name: 'quantity', default: 1 })
  @IsDefined()
  @Min(1)
  quantity: number;

  @Exclude()
  @Column({ type: 'int', name: 'orderid' })
  orderId: number;

  @Exclude()
  @ManyToOne(type => Order, order => order.products)
  @IsDefined()
  @JoinColumn({ name: 'orderid' })
  order: Order;
}
