import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByUID(uid: number): Promise<User | null> {
    return this.userRepository.findOneBy({ uid });
  }

  async createUserProfile(newUser: CreateUserDto): Promise<User | JSON> {
    const user: User = new User();
    // user.role_id = newUser.role_id;
    user.name = newUser.name;
    user.surname = newUser.surname;
    user.birth_date = newUser.birth_date;
    user.email = newUser.email;
    user.phone_number = newUser.phone_number;

    return await this.userRepository.save(user);
  }

  async updateUserProfile(
    uid: number,
    updateUser: UpdateUserDto,
  ): Promise<User> {
    const user: User = new User();
    user.uid = uid;
    user.name =
      updateUser.name || (await this.userRepository.findOneBy({ uid }))!.name;
    user.surname =
      updateUser.surname ||
      (await this.userRepository.findOneBy({ uid }))!.surname;
    user.birth_date =
      updateUser.birth_date ||
      (await this.userRepository.findOneBy({ uid }))!.birth_date;
    user.email =
      updateUser.email || (await this.userRepository.findOneBy({ uid }))!.email;
    // user.role_id =
    //   updateUser.role_id ||
    //   (await this.userRepository.findOneBy({ uid }))!.role_id;
    return this.userRepository.save(user);
  }

  deleteUser(uid: number) {
    return this.userRepository.delete(uid);
  }
}
