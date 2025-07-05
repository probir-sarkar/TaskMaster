import { IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class ChangePositionDto {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @Type(() => Number)
  @IsNumber()
  index: number;
}
