import { Injectable } from '@nestjs/common';
import { CreateAclDto } from './dto/create-acl.dto';
import { UpdateAclDto } from './dto/update-acl.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Acl } from './entities/acl.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AclService {
  constructor(
    @InjectRepository(Acl) private readonly aclRepository: Repository<Acl>,
  ) {}

  findAllAcl(): Promise<Acl[]> {
    return this.aclRepository.find();
  }

  findById(acl_id: number): Promise<Acl | null> {
    return this.aclRepository.findOneBy({ acl_id });
  }

  createAcl(newAcl: CreateAclDto): Promise<Acl> {
    const acl: Acl = new Acl();
    acl.acl_name = newAcl.acl_name;
    return this.aclRepository.save(acl);
  }

  updateAcl(acl_id: number, updateAcl: UpdateAclDto): Promise<Acl> {
    const acl: Acl = new Acl();
    acl.acl_id = acl_id;
    acl.acl_name = updateAcl.acl_name;
    return this.aclRepository.save(acl);
  }
}
