import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateDocumentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    hash: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    file: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    transactionId: string;
}

export class CreateConfigurationDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    address: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    mnemonicKey: string;
    @IsNotEmpty()
    @ApiProperty()
    sk: object | string;
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    status: boolean;
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    amountOperation: number;
}
export class UploadFileDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    file: string;
}