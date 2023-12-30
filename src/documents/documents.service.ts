import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { Configuration } from '../transactions/entities/config.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateConfigurationDto, UploadFileDto } from './dto/create-document.dto';
import { Documents } from './entities/document.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel('Documents') private documentModel: Model<Documents>,
    @InjectModel('Configuration') private configurationModel: Model<Configuration>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    private transactionsService: TransactionsService
  ) { }
  createConfiguration(createConfigurationDto: CreateConfigurationDto) {
    return new Promise(async(resolve,reject)=>{
      try {
        createConfigurationDto.sk = JSON.stringify(createConfigurationDto.sk);
        const result = new this.configurationModel({ ...createConfigurationDto });
        const created = await result.save();
        resolve(created);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    })
  }
  async upload(body: UploadFileDto, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const userData = await this.userModel.findOne({_id: userId});
        if(!userData) {
          throw new NotFoundException('User not found');
        }
        const path = require('path');
        const DOWNLOAD_DIR = path.resolve(
          __dirname,
          '../../uploads/uploads/',
          body.file,
        );
        const crypto = require('crypto');
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(DOWNLOAD_DIR);
        const hash = crypto.createHash('sha256');
        const finalHash = hash.update(fileBuffer).digest('hex');
        const configuration = await this.configurationModel.findOne({status: true})
        const transaction: any = await this.transactionsService.createTransaction(
          {
            "skAlgorand": JSON.parse(userData.sk),
            "addressAlgorand": userData.address
          },
          {
            "addressAlgorand": configuration.address
          },
          configuration.amountOperation,
          finalHash
        )
        const resultTransaction = new this.transactionModel({
          txId: transaction.txId,
          addressReceiver: transaction.addressReceiver,
          addressSender: transaction.addressSender,
          transactionAmount: transaction.transactionAmount,
          transactionFee: transaction.transactionFee,
        });
        const createdTransaction = await resultTransaction.save();  
        const resultDocument = new this.documentModel({ 
          userId,
          hash: finalHash,
          file: body.file,
          transactionId: createdTransaction._id,
         });
        const createdDocument = await resultDocument.save();
        resolve(createdDocument);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  async validateHash(body: UploadFileDto, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const userData = await this.userModel.findOne({_id: userId});
        if(!userData) {
          throw new NotFoundException('User not found');
        }
        const path = require('path');
        const DOWNLOAD_DIR = path.resolve(
          __dirname,
          '../../uploads/uploads/',
          body.file,
        );
        const crypto = require('crypto');
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(DOWNLOAD_DIR);
        const hash = crypto.createHash('sha256');
        const finalHash = hash.update(fileBuffer).digest('hex');
        const documentSearch = await this.documentModel.findOne({hash: finalHash});
       if(!documentSearch) {
        resolve({
          hash: finalHash,
          existsHash: false,
        });
       }else{
        resolve({
          hash: finalHash,
          existsHash: true,
        });
       }
      
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }
}
