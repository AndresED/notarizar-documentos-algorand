import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async auth(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const users: any = await this.usersService.findWithEmail(email);
        if (!users) {
          throw new HttpException(
            { message: 'email_not_found' },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        if (!bcrypt.compareSync(password, users.password)) {
          throw new HttpException(
            { message: 'password_incorrect' },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        if (users.status === false) {
          throw new HttpException(
            { message: 'user_disable' },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        const token = await this.createTokenUsers(users);
        console.log('token',token);
        resolve({
          accessToken: token,
        });
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }
    // Generación del token
    async createTokenUsers(payload: User) {
      try {
          const dataPayload = {
              id: payload.id,
              email: payload.email,
          }
          const accessToken = await this.jwtService.sign(dataPayload);
          return accessToken;
      } catch (error) {
          return error;
      }
    }
}
