import { PermissionsRepository } from './permissions.repository';

export class PermissionsService {
  private permissionsRepository: PermissionsRepository;

  constructor() {
    this.permissionsRepository = new PermissionsRepository();
  }

  async findAll() {
    return this.permissionsRepository.findAll();
  }

  async findById(id: string) {
    return this.permissionsRepository.findById(id);
  }
}