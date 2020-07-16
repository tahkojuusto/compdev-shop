import { IsUUID, IsDefined, Length, IsPostalCode, IsEmail, IsMobilePhone, ValidateNested, IsArray, ArrayMinSize } from "class-validator";
import { InputOrderProduct } from "./";
import { Type } from "class-transformer";

export class InputOrder {
  @IsDefined()
  @Length(2, 30)
  firstName: string;

  @IsDefined()
  @Length(2, 30)
  lastName: string;

  @IsDefined()
  @Length(2, 50)
  streetAddress: string;

  @IsDefined()
  @IsPostalCode('FI')
  postalCode: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsMobilePhone('fi-FI')
  phoneNumber: string;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InputOrderProduct)
  products: InputOrderProduct[];
}
