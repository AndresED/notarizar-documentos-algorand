import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { enviroments } from './enviroments';

@Module({
  imports: [
    TransactionsModule, 
    UsersModule, 
    DocumentsModule, 
    AuthModule,
    HttpModule.register({}),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: (config.get<string>('DB_HOST')),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
