import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {
  IsEmail,
  IsPostalCode,
  IsMobilePhone,
  IsDefined,
  Length,
} from 'class-validator';

import { OrderProduct } from './';
import { config } from '../utils';

@Entity({ schema: config.db.schema, name: 'order' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'orderid' })
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_ts' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_ts' })
  updatedAt: Date;

  @Column({ name: 'firstname' })
  @IsDefined()
  @Length(2, 30)
  firstName: string;

  @Column({ name: 'lastname' })
  @IsDefined()
  @Length(2, 30)
  lastName: string;

  @Column({ name: 'streetaddress' })
  @IsDefined()
  @Length(2, 50)
  streetAddress: string;

  @Column({ name: 'postalcode' })
  @IsDefined()
  @IsPostalCode('FI')
  postalCode: string;

  @Column({ name: 'email' })
  @IsDefined()
  @IsEmail()
  email: string;

  @Column({ name: 'phonenumber' })
  @IsDefined()
  @IsMobilePhone('fi-FI')
  phoneNumber: string;

  @OneToMany(type => OrderProduct, product => product.order, { cascade: true })
  @IsDefined()
  products: OrderProduct[];
}
