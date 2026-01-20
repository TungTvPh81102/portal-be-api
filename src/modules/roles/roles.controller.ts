import { FastifyReply, FastifyRequest } from 'fastify';
import { RolesService } from './roles.service';

export class RolesController {
  private rolesService: RolesService;

  constructor() {
    this.rolesService = new RolesService();
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const data = await this.rolesService.findAll();
    return { data };
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await this.rolesService.findById(id);
    return { data };
  }
}