import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiPropertyOptional({required: true})
    @IsNotEmpty()
    @IsString()
    email: string;
    @ApiPropertyOptional({required: true})
    @IsNotEmpty()
    @IsString()
    password: string;
    @ApiPropertyOptional({required: false})
    @IsEmpty()
    address?: string;
    @ApiPropertyOptional({required: false})
    @IsEmpty()
    mnemonicKey?: string;
    @ApiPropertyOptional({required: false})
    @IsEmpty()
    sk?: string;
    @ApiPropertyOptional({required: false})
    @IsEmpty()
    status?: string;
}
 