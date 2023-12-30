import { Controller, Post, Body,  UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateConfigurationDto, UploadFileDto } from './dto/create-document.dto';
import { arrayFiles, localOptions } from './multer.option';
import { Request } from 'express';
@Controller('documents')
@ApiTags('Documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /* @Post('configuration')
  createConfiguration(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.documentsService.createConfiguration(createConfigurationDto);
  } */

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileFieldsInterceptor(arrayFiles, localOptions))
  create(@Body() body: UploadFileDto,@Req() req: Request) {
    const user = <any>req.user;
    return this.documentsService.upload(body, user._id);
  }

  
  @Post('validate-hash')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileFieldsInterceptor(arrayFiles, localOptions))
  validateHash(@Body() body: UploadFileDto,@Req() req: Request) {
    const user = <any>req.user;
    return this.documentsService.validateHash(body, user._id);
  }
}
