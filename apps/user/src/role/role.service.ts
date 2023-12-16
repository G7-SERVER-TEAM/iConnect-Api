import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';
import { data } from './mock/load.data';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
    this.roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(data)
      .execute();
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  findById(id: number): Promise<Role | null> {
    return this.roleRepository.findOneBy({ id });
  }

  createNewRole(newRole: CreateRoleDto): Promise<Role> {
    const role: Role = new Role();
    role.role_name = newRole.role_name;
    role.acls = newRole.acls;
    return this.roleRepository.save(role);
  }

  updateRole(role_id: number, updateRole: UpdateRoleDto): Promise<Role> {
    const role: Role = new Role();
    role.id = role_id;
    role.role_name = updateRole.role_name;
    role.acls = updateRole.acls;
    return this.roleRepository.save(role);
  }

  deleteRole(role_id: number) {
    return this.roleRepository.delete(role_id);
  }
}
