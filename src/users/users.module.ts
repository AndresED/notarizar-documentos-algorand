import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TransactionsService, AuthService, JwtService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ]
})
export class UsersModule {}
