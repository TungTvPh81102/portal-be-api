import { FastifyReply, FastifyRequest } from 'fastify';
import { PermissionsService } from './permissions.service';

export class PermissionsController {
  private permissionsService: PermissionsService;

  constructor() {
    this.permissionsService = new PermissionsService();
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const data = await this.permissionsService.findAll();
    return { data };
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await this.permissionsService.findById(id);
    return { data };
  }
}