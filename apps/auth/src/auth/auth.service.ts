import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AccountService } from '../account/account.service';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async isAccessTokenExpired(access_token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      console.log(`${access_token} is expired.`);
      return true;
    }
    return false;
  }

  async signIn(username: string, pass: string): Promise<any> {
    const account: Account | null =
      await this.accountService.findByUsername(username);
    const isExpired = await this.isAccessTokenExpired(account.access_token);
    const payload = isExpired
      ? { sub: account.uid, username: account.username }
      : {};
    const token = await this.jwtService.signAsync(payload);

    const passwordIsValid = await (crypto
      .createHash('sha256')
      .update(pass + process.env.ENCRYPT_SALT)
      .digest('hex') === account?.password);

    if (!account || !passwordIsValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (isExpired) {
      await this.accountService.updateAccessToken(account.uid, token);
    }
    await this.accountService.updateLastLogin(account.account_id, new Date());

    return {
      username: account.username,
      access_token: isExpired ? token : account.access_token,
      last_logged_in: account.last_logged_in,
    };
  }

  async signInWithEmail(email: string, pass: string): Promise<any> {
    const account: Account | null =
      await this.accountService.findByEmail(email);
    const isExpired = await this.isAccessTokenExpired(account.access_token);
    const payload = isExpired ? { sub: account.uid, email: account.email } : {};
    const token = await this.jwtService.signAsync(payload);

    const passwordIsValid = await (crypto
      .createHash('sha256')
      .update(pass + process.env.ENCRYPT_SALT)
      .digest('hex') === account?.password);

    if (!account || !passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (isExpired) {
      await this.accountService.updateAccessToken(account.uid, token);
    }
    await this.accountService.updateLastLogin(account.account_id, new Date());

    return {
      email: account.email,
      access_token: account.access_token,
      last_logged_in: account.last_logged_in,
    };
  }
}
