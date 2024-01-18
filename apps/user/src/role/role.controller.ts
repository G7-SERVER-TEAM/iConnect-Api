import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @Get()
  async findAll() {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: await this.roleService.findAll(),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    const role: Role | null = await this.roleService.findById(+id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: role != null ? role : [],
    });
    return res;
  }

  @ApiResponse({
    status: 201,
    description: 'This role has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: CreateRoleDto,
  })
  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 201,
      message: 'success',
      result: await this.roleService.createNewRole(createRoleDto),
    });
    return res;
  }

  @ApiResponse({
    status: 204,
    description: 'This role has been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: UpdateRoleDto,
  })
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 204,
      message: 'success',
      findBy: 'id',
      result: await this.roleService.updateRole(+id, updateRoleDto),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'This role has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: await this.roleService.deleteRole(+id),
    });
    return res;
  }
}
