import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AccountService } from '../account/account.service';
import { Account } from '../account/entities/account.entity';
import { UserService } from '../../../user/src/user/user.service';
import { User } from '../../../user/src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    private userService: UserService,
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
    if (!account) {
      throw new UnauthorizedException('Invalid email or password');
    }
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
    const user: User = await this.userService.findByUID(account.uid);

    return {
      username: account.username,
      access_token: isExpired ? token : account.access_token,
      last_logged_in: account.last_logged_in,
      role_id: user.role_id,
      uid: account.uid,
      area: user.area,
    };
  }

  async signInWithEmail(email: string, pass: string): Promise<any> {
    const account: Account | null =
      await this.accountService.findByEmail(email);

    console.log(account);
    if (!account) {
      throw new UnauthorizedException('Invalid email or password');
    }
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

    const user: User = await this.userService.findByUID(account.uid);
    console.log(user);

    return {
      email: account.email,
      access_token: isExpired ? token : account.access_token,
      last_logged_in: account.last_logged_in,
      uid: user.uid,
    };
  }
}
