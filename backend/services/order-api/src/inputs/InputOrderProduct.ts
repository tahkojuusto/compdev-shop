import { Min, IsDefined, IsUUID, IsInt } from 'class-validator';

export class InputOrderProduct {
  @IsInt()
  productId: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  quantity: number;
}
