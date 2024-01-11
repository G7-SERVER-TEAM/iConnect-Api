import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AccountService } from '../account/account.service';
import { Account } from '../account/entities/account.entity';
import { DateTime } from 'luxon';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  isAccessTokenExpired(accessToken: string): boolean {
    try {
      this.jwtService.verify(accessToken);
      return false;
    } catch (e) {
      return true;
    }
  }

  async signIn(username: string, pass: string): Promise<any> {
    const account: Account | null =
      await this.accountService.findByUsername(username);
    const passwordIsValid = await (crypto
      .createHash('sha256')
      .update(pass + process.env.ENCRYPT_SALT)
      .digest('hex') === account?.password);

    if (!account || !passwordIsValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    await this.accountService.updateLastLogin(account.account_id, new Date());

    return {
      username: account.username,
      access_token: account.access_token,
      last_logged_in: account.last_logged_in,
    };
  }

  async signInWithEmail(email: string, pass: string): Promise<any> {
    const account: Account | null =
      await this.accountService.findByEmail(email);
    const passwordIsValid = await (crypto
      .createHash('sha256')
      .update(pass + process.env.ENCRYPT_SALT)
      .digest('hex') === account?.password);

    if (!account || !passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.accountService.updateLastLogin(
      account.account_id,
      DateTime.now().setZone('Asia/Bangkok').toJSDate(),
    );
    return {
      email: account.email,
      access_token: account.access_token,
      last_logged_in: account.last_logged_in,
    };
  }
}
