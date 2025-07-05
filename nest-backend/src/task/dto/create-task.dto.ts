import { Transform } from "class-transformer";
import { IsString, MinLength, MaxLength, IsOptional, IsIn, IsDate } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  content: string = "";

  @IsIn(["TODO", "IN_PROGRESS", "DONE"])
  status: "TODO" | "IN_PROGRESS" | "DONE" = "TODO";

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  deadline?: Date;
}
