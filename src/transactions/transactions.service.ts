 import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as algosdk from 'algosdk';
import { SenderDto, ReceiverDto } from './dto/create-transaction.dto';
@Injectable()
export class TransactionsService {
  baseServer: string;
  token: string;
  port: string;
  algodClient: any;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseServer = this.configService.get('PURESTAKE_SERVER');
    this.token = this.configService.get('PURESTAKE_API_KEY');
    this.port = '';
    this.createConexionAlgorand();
  }
  // Creando la conexión con algorand
  createConexionAlgorand() {
    return new Promise(async (resolve, reject) => {
      try {
        const headers = { 'X-API-Key': this.token };
        this.algodClient = new algosdk.Algodv2(
          this.token,
          this.baseServer,
          this.port,
          headers,
        );
        resolve('client_created');
      } catch (error) {
        reject(error);
      }
    });
  }
  generateAccount() {
    return new Promise(async (resolve, reject) => {
      try {
        const account = algosdk.generateAccount();
        const isValid = algosdk.isValidAddress(account.addr);
        if (isValid == true) {
          const mn = algosdk.secretKeyToMnemonic(account.sk);
          resolve({ address: account.addr, mnemonicKey: mn, sk: account.sk });
        } else {
          throw new HttpException(
            { message: 'wallet_address_is_not_validated' },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } catch (error) {
        Logger.log(error);
        reject(error);
      }
    });
  }

  getInfoAccount(address: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const accountInfo = await this.algodClient
          .accountInformation(address)
          .do();
        resolve(accountInfo);
      } catch (error) {
        Logger.log(error);
        reject(error.message);
      }
    });
  }
  getInfoTransacction(txId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const header = {
          headers: {
            'x-api-key': 'UmTy3yeczH2BLdSM6rHhe80tXe8UbY453mnm70Sy', 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          }
        }
        const url = this.baseServer.replace('/ps2','/idx2/v2/transactions/'+txId);
        const transaction  = await this.httpService.get(url,header).toPromise();
        resolve(transaction.data);
      } catch (error) {
        Logger.log(error);
        reject(error.message);
      }
    });
  }
  jsonToArray(json) {
    const str = JSON.stringify(json, null, 0);
    const ret = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      ret[i] = str.charCodeAt(i);
    }
    return ret;
  }
  convertArrayToUint8(array): Uint8Array {
    const length = array.length;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {
      view[i] = array[i];
    }
    const arrayResponse = new Uint8Array(buffer);
    return arrayResponse;
  }
  createTransaction(sender: SenderDto, receiver: ReceiverDto, amount: number, hashFile: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = await this.algodClient.getTransactionParams().do();
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;
        const codeOperation = hashFile;
        const enc = new TextEncoder();
        const note = enc.encode(codeOperation);
        const arrayDataList: any[] = [];
        for (let i = 0; i < 64; i++) {
          arrayDataList.push(sender.skAlgorand[i]);
        }
        const secretKey = this.convertArrayToUint8(arrayDataList);
        const txn = algosdk.makePaymentTxnWithSuggestedParams(
          sender.addressAlgorand,
          receiver.addressAlgorand,
          amount,
          undefined,
          note,
          params,
        );
        const signedTxn = txn.signTxn(secretKey);
        const txId = txn.txID().toString();
        await this.algodClient.sendRawTransaction(signedTxn).do();
        algosdk
          .waitForConfirmation(this.algodClient, txId, 4)
          .then(async (confirmedTxn) => {
            resolve({
              txId,
              addressReceiver: receiver.addressAlgorand,
              addressSender: sender.addressAlgorand,
              transactionAmount: confirmedTxn.txn.txn.amt,
              transactionFee: confirmedTxn.txn.txn.fee,
            });
          });
      } catch (error) {
        Logger.log(error);
        reject(error);
      }
    });
  }
}
