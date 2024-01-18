import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { ZipCode } from './entities/zip.entity';
import { city, district, province, zipCode } from './mock/load.data';

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
  ) {
    let isNotExists = false;
    this.findAllProvince().then((result) => {
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
      }
    });
  }

  findAllArea(): Promise<Area[]> {
    return this.areaRepository.find();
  }

  findAllProvince(): Promise<Province[]> {
    return this.provinceRepository.find();
  }

  findAreaById(area_id: number): Promise<Area | null> {
    return this.areaRepository.findOneBy({ area_id });
  }
}
