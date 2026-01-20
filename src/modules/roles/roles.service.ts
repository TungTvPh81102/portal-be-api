import { RolesRepository } from './roles.repository';

export class RolesService {
  private rolesRepository: RolesRepository;

  constructor() {
    this.rolesRepository = new RolesRepository();
  }

  async findAll() {
    return this.rolesRepository.findAll();
  }

  async findById(id: string) {
    return this.rolesRepository.findById(id);
  }
}