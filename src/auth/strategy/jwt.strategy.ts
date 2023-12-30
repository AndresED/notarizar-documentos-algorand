import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,    
  ) {      
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });    
    this.logger = new Logger('JWT Strategy Service');     
  }
  async validate(payload: any): Promise<User> { 
    const { email } = payload;
    const user = await this.userModel.findOne({email});  
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}