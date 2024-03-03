import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { Public } from '../auth/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateAccountWithEmailDto } from './dto/create-account-email.dto';
import { DateTime } from 'luxon';

@UseGuards(AuthGuard)
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  findByUsername(username: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ username });
  }

  findById(account_id: number): Promise<Account | null> {
    return this.accountRepository.findOneBy({ account_id });
  }

  findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ email });
  }

  findByUid(uid: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ uid: +uid });
  }

  @Public()
  async createWithEmail(
    newAccount: CreateAccountWithEmailDto,
  ): Promise<
    | { statusCode: number; id: number; email: string; access_token: string }
    | { statusCode: number; message: string }
  > {
    const existingUser = await this.findByEmail(newAccount.email);

    if (existingUser) {
      return {
        statusCode: 400,
        message: 'Email already exists.',
      };
    }

    try {
      const hashPassword = createHash('sha256')
        .update(newAccount.password + process.env.ENCRYPT_SALT)
        .digest('hex');

      const account: Account = new Account();
      account.email = newAccount.email;
      account.password = hashPassword;
      account.uid = newAccount.uid;
      account.logged_id_history = [];
      account.last_logged_in = DateTime.now()
        .setZone('Asia/Bangkok')
        .toJSDate();

      const payload = { sub: account.uid, email: account.email };
      account.access_token = await this.jwtService.signAsync(payload);

      await this.accountRepository.save(account);

      return {
        statusCode: 201,
        id: account.account_id,
        email: account.email,
        access_token: account.access_token,
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        message: 'Internal server error. Failed to create user profile.',
      };
    }
  }

  @Public()
  async create(newAccount: CreateAccountDto): Promise<
    | {
        statusCode: number;
        id: number;
        username: string;
        access_token: string;
      }
    | { statusCode: number; message: string }
  > {
    const existingUser = await this.findByUsername(newAccount.username);

    if (existingUser) {
      return {
        statusCode: 400,
        message: 'Username already exists.',
      };
    }

    try {
      const hashPassword = createHash('sha256')
        .update(newAccount.password + process.env.ENCRYPT_SALT)
        .digest('hex');

      const account: Account = new Account();
      account.username = newAccount.username;
      account.password = hashPassword;
      account.uid = newAccount.uid;
      account.logged_id_history = [];
      account.last_logged_in = DateTime.now()
        .setZone('Asia/Bangkok')
        .toJSDate();

      const payload = { sub: account.uid, username: account.username };

      account.access_token = await this.jwtService.signAsync(payload);

      await this.accountRepository.save(account);

      return {
        statusCode: 201,
        id: account.account_id,
        username: account.username,
        access_token: account.access_token,
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        message: 'Internal server error. Failed to create user profile.',
      };
    }
  }

  async updateAccessToken(account_id: number, access_token: string) {
    const account: Account | null = await this.accountRepository.findOneBy({
      account_id,
    });
    account!.access_token = access_token;
    this.accountRepository.save(account!);
  }

  async updateLastLogin(account_id: number, time: Date) {
    const account: Account | null = await this.accountRepository.findOneBy({
      account_id,
    });
    account!.last_logged_in = time;
    account.logged_id_history.push(account.last_logged_in);
    this.accountRepository.save(account!);
  }

  async update(
    account_id: number,
    updateAccount: UpdateAccountDto,
  ): Promise<Account | JSON> {
    try {
      const hashPassword = createHash('sha256')
        .update(updateAccount.password + process.env.ENCRYPT_SALT)
        .digest('hex');

      const account: Account = new Account();
      account.account_id = account_id;
      account.username =
        updateAccount.username ||
        (await this.accountRepository.findOneBy({ account_id }))!.username;
      account.password =
        hashPassword ||
        (await this.accountRepository.findOneBy({ account_id }))!.password;
      return this.accountRepository.save(account);
    } catch (error) {
      return <JSON>(<unknown>{
        statusCode: 500,
        message: 'Internal server error. Failed to create user profile.',
      });
    }
  }

  remove(account_id: number) {
    return this.accountRepository.delete(account_id);
  }
}
