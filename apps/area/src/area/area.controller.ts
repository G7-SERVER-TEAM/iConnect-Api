import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Area } from './entities/area.entity';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreatePriceDTO } from './dto/create-price.dto';
import { UpdatePriceDTO } from './dto/update-price.dto';

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
  @Get('/id/:id')
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

  @ApiResponse({
    status: 201,
    description: 'CREATE.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Post('/create')
  async create(@Body() location: CreateLocationDto) {
    return {
      status: 201,
      message: 'success',
      data: await this.areaService.createArea(location),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/price')
  async findAllPrice() {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: await this.areaService.findAllPrice(),
    });
    return res;
  }

  @ApiResponse({
    status: 201,
    description: 'CREATE',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Post('/price/create')
  async createPrice(@Body() price: CreatePriceDTO) {
    return {
      status: 201,
      message: 'created',
      result: await this.areaService.createPrice(price),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'UPDATE',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @Patch('price/update/:id')
  async updatePrice(@Param('id') id: string, @Body() update: UpdatePriceDTO) {
    return {
      status: 200,
      message: 'updated',
      result: await this.areaService.updatePrice(+id, update),
    };
  }
}
