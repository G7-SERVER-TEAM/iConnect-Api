import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AclService } from './acl.service';
import { CreateAclDto } from './dto/create-acl.dto';
import { UpdateAclDto } from './dto/update-acl.dto';
import { Acl } from './entities/acl.entity';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('acl')
export class AclController {
  constructor(private readonly aclService: AclService) {}

  @ApiResponse({
    status: 200,
    description: 'OK',
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
      result: await this.aclService.findAllAcl(),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    const acl: Acl | null = await this.aclService.findById(+id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: acl != null ? acl : [],
    });
    return res;
  }

  @ApiResponse({
    status: 201,
    description: 'This acl has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: CreateAclDto,
  })
  @Post('/create')
  async create(@Body() createAclDto: CreateAclDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 201,
      message: 'created',
      result: await this.aclService.createAcl(createAclDto),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'This acl has been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: UpdateAclDto,
  })
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateAclDto: UpdateAclDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'updated',
      result: await this.aclService.updateAcl(+id, updateAclDto),
    });
    return res;
  }
}
