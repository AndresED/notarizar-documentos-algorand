import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/entities/user.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, TransactionsService, JwtStrategy],
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configService.get<string>('EXPIRESIN') },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
