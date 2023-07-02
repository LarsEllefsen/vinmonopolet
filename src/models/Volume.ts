import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class Volume {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  formattedValue: string;

  @IsNotEmpty()
  @IsString()
  unit: string;

  constructor(value: number, formattedValue: string, unit: string) {
    this.value = value;
    this.formattedValue = formattedValue;
    this.unit = unit;
  }
}
