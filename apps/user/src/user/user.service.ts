import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import { Public } from '../../../auth/src/auth/decorators/public.decorator';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { data } from '../role/mock/load.data';

@UseGuards(AuthGuard)
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly roleService: RoleService,
  ) {
    let isNotExists = false;
    this.roleService.findAll().then((result) => {
      isNotExists = result.length === 0;
      if (isNotExists) {
        this.roleRepository
          .createQueryBuilder('role')
          .insert()
          .into(Role)
          .values(data)
          .execute();
      }
    });
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByUID(uid: number): Promise<User | null> {
    return this.userRepository.findOneBy({ uid });
  }

  findByPhoneNumber(phone_number: string) {
    return this.userRepository.findOneBy({ phone_number });
  }

  @Public()
  async createUserProfile(newUser: CreateUserDto) {
    // eslint-disable-next-line prefer-const
    let errors = {
      email: '',
      name: '',
      surname: '',
      phone_number: '',
    };

    // Validate email field
    if (!newUser.email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'Email is invalid.';
    }

    // Validate firstName field
    if (!newUser.name) {
      errors.name = 'First name is required.';
    } else if (newUser.name.length < 3) {
      errors.name = 'First name must be at least 3 characters.';
    }

    // Validate lastName field
    if (!newUser.surname) {
      errors.surname = 'Last name is required.';
    } else if (newUser.surname.length < 3) {
      errors.surname = 'Last name must be at least 3 characters.';
    }

    // Validate phone field
    if (!newUser.phone_number) {
      errors.phone_number = 'Phone number is required.';
    } else if (!/^0[0-9]{1,2}[0-9]{3}[0-9]{4}$/.test(newUser.phone_number)) {
      errors.phone_number =
        'Phone number is invalid. Please enter a valid Thai phone number.';
    }

    // If there are validation errors, throw an error
    if (Object.keys(errors).length > 0) {
      if (
        errors.email.length > 0 ||
        errors.name.length > 0 ||
        errors.phone_number.length > 0 ||
        errors.surname.length > 0
      ) {
        throw new BadRequestException(errors);
      }
    }

    const user: User = new User();
    user.role_id = newUser.role_id;
    user.name = newUser.name;
    user.surname = newUser.surname;
    user.birth_date = newUser.birth_date;
    user.email = newUser.email;
    user.area = newUser.area;
    user.phone_number = newUser.phone_number;

    return {
      status: 201,
      message: 'success',
      result: await this.userRepository.save(user),
    };
  }

  async updateUserProfile(
    uid: number,
    updateUser: UpdateUserDto,
  ): Promise<User> {
    const user: User = new User();
    user.uid = uid;
    user.name =
      updateUser.name !== ''
        ? updateUser.name
        : (await this.userRepository.findOneBy({ uid }))!.name;
    user.surname =
      updateUser.surname !== ''
        ? updateUser.surname
        : (await this.userRepository.findOneBy({ uid }))!.surname;
    user.birth_date =
      updateUser.birth_date !==
      (await (
        await this.userRepository.findOneBy({ uid })!
      ).birth_date)
        ? updateUser.birth_date
        : (await this.userRepository.findOneBy({ uid }))!.birth_date;
    user.email =
      updateUser.email !== ''
        ? updateUser.email
        : (await this.userRepository.findOneBy({ uid }))!.email;
    user.area =
      updateUser.area !==
      (await (
        await this.userRepository.findOneBy({ uid })!
      ).area)
        ? updateUser.area
        : (await this.userRepository.findOneBy({ uid }))!.area;
    user.role_id =
      updateUser.role_id !==
      (await (
        await this.userRepository.findOneBy({ uid })!
      ).role_id)
        ? updateUser.role_id
        : (await this.userRepository.findOneBy({ uid }))!.role_id;
    return this.userRepository.save(user);
  }

  deleteUser(uid: number) {
    return this.userRepository.delete(uid);
  }
}
