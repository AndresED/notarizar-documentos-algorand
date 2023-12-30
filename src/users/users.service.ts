import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private transactionsService: TransactionsService
  ) { }
  create(createUserDto: CreateUserDto) {
    return new Promise(async(resolve,reject)=>{
      try {
        const userSearch = await this.userModel.findOne({
          email: createUserDto.email,
        });
        if (userSearch) {
          throw new HttpException(
            { message: 'email_duplicated' },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        const algorandAccount: any = await this.transactionsService.generateAccount()
        createUserDto.password = await bcrypt.hashSync(
          createUserDto.password,
          10,
        );
        createUserDto.address = algorandAccount.address;
        createUserDto.mnemonicKey = algorandAccount.mnemonicKey;
        createUserDto.sk = JSON.stringify(algorandAccount.sk);
        const result = new this.userModel({ ...createUserDto });
        const created = await result.save();
        resolve(created);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    })
  }
  findOne(id: string) {
    return new Promise(async(resolve,reject)=>{
      try {
        const result = await this.userModel.findOne({_id: id});
        resolve(result);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    })
  }
  findWithEmail(email: string){
    return new Promise(async(resolve,reject)=>{
      try {
        const user = await this.userModel.findOne({email});
        resolve(user);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    })
  }
}
