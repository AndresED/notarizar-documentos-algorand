import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateAuthDto {}
export class LoginDto {
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    email: string;
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    password: string;
  }