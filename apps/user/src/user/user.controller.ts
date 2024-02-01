import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../../auth/src/auth/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import { RoleService } from '../role/role.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get()
  async findAllUser() {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: await this.userService.findAllUser(),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/id/:uid')
  async findByUID(@Param('uid') uid: string) {
    const user: User | null = await this.userService.findByUID(+uid);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'uid',
      result:
        user != null
          ? {
              uid: user.uid,
              name: user.name,
              surname: user.surname,
              birth_date: user.birth_date,
              email: user.email,
              phone_number: user.phone_number,
              acl: (await this.roleService.findById(user.role_id)).acls,
              area: user.area,
            }
          : [],
    });
    return res;
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserDto,
  })
  @Post('/profile/create')
  async createProfile(@Body() createUserDto: CreateUserDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 201,
      message: 'success',
      result: await this.userService.createUserProfile(createUserDto),
    });
    return res;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @Patch('/profile/update/:uid')
  async updateProfile(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const res: JSON = <JSON>(<unknown>{
      status: 204,
      message: 'success',
      findBy: 'uid',
      result: await this.userService.updateUserProfile(+uid, updateUserDto),
    });
    return res;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete('/profile/delete/:uid')
  async removeProfile(@Param('uid') uid: string) {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'uid',
      result: await this.userService.deleteUser(+uid),
    });
    return res;
  }
}
