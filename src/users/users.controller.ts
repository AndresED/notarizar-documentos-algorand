import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiBearerAuth('access-token')
  findOne(@Req() req: Request) {
    const user = <any>req.user;
    return this.usersService.findOne(user._id);
  }
}
