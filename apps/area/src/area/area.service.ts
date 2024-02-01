import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { ZipCode } from './entities/zip.entity';
import {
  area,
  city,
  district,
  price,
  province,
  zipCode,
} from './mock/load.data';
import { CreateLocationDto } from './dto/create-location.dto';
import { Price } from './entities/price.entity';
import { UpdatePriceDTO } from './dto/update-price.dto';
import { CreatePriceDTO } from './dto/create-price.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(ZipCode)
    private readonly zipCodeRepository: Repository<ZipCode>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {
    let isNotExists = false;
    this.findAllProvince()
      .then((result) => {
        isNotExists = result.length === 0;
        if (isNotExists) {
          this.provinceRepository
            .createQueryBuilder()
            .insert()
            .into(Province)
            .values(province)
            .execute();
          this.cityRepository
            .createQueryBuilder()
            .insert()
            .into(City)
            .values(city)
            .execute();
          this.districtRepository
            .createQueryBuilder()
            .insert()
            .into(District)
            .values(district)
            .execute();
          this.zipCodeRepository
            .createQueryBuilder()
            .insert()
            .into(ZipCode)
            .values(zipCode)
            .execute();
          this.priceRepository
            .createQueryBuilder()
            .insert()
            .into(Price)
            .values(price)
            .execute();
        }
      })
      .then(() => {
        if (isNotExists) {
          setTimeout(() => {
            this.areaRepository
              .createQueryBuilder()
              .insert()
              .into(Area)
              .values(area)
              .execute();
          }, 10000);
        }
      });
  }

  findAllArea(): Promise<Area[]> {
    return this.areaRepository.find();
  }

  findAllProvince(): Promise<Province[]> {
    return this.provinceRepository.find();
  }

  findAllPrice(): Promise<Price[]> {
    return this.priceRepository.find();
  }

  findAreaById(area_id: number): Promise<Area | null> {
    return this.areaRepository.findOneBy({ area_id });
  }

  createArea(location: CreateLocationDto): Promise<Area> {
    return this.areaRepository.save(location);
  }

  createPrice(createPrice: CreatePriceDTO): Promise<Price> {
    return this.priceRepository.save(createPrice);
  }

  async updatePrice(id: number, updatePrice: UpdatePriceDTO): Promise<Price> {
    const price_id: number = id;
    const price = await this.priceRepository.findOneBy({ price_id });
    const before = price.after;
    const after: JSON = <JSON>(<unknown>{
      start_time: updatePrice.start_time,
      configuration: updatePrice.configuration,
    });

    const newPrice: Price = {
      price_id: price_id,
      status: updatePrice.status,
      before: before,
      after: after,
    };

    return this.priceRepository.save(newPrice);
  }
}
