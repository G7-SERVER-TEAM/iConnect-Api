import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AreaService } from './area.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Area } from './entities/area.entity';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

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
      result: await this.areaService.findAllArea(),
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
  async findAreaById(@Param('area_id') area_id: string) {
    const area: Area | null = await this.areaService.findAreaById(+area_id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: area != null ? area : [],
    });
    return res;
  }
}
