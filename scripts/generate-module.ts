import fs from 'fs';
import path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Please provide a module name (e.g., npm run g user)');
  process.exit(1);
}

const pascalName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const camelName = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);

const moduleDir = path.join(process.cwd(), 'src', 'modules', camelName);

if (fs.existsSync(moduleDir)) {
  console.error(`Module ${camelName} already exists!`);
  process.exit(1);
}

fs.mkdirSync(moduleDir, { recursive: true });

const templates = {
  'controller': `import { FastifyReply, FastifyRequest } from 'fastify';
import { ${pascalName}Service } from './${camelName}.service';

export class ${pascalName}Controller {
  private ${camelName}Service: ${pascalName}Service;

  constructor() {
    this.${camelName}Service = new ${pascalName}Service();
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const data = await this.${camelName}Service.findAll();
    return { data };
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await this.${camelName}Service.findById(id);
    return { data };
  }
}`,
  'service': `import { ${pascalName}Repository } from './${camelName}.repository';

export class ${pascalName}Service {
  private ${camelName}Repository: ${pascalName}Repository;

  constructor() {
    this.${camelName}Repository = new ${pascalName}Repository();
  }

  async findAll() {
    return this.${camelName}Repository.findAll();
  }

  async findById(id: string) {
    return this.${camelName}Repository.findById(id);
  }
}`,
  'repository': `import { db } from '@/db';
// import { ${camelName}s } from '@/models'; // Import your table here

export class ${pascalName}Repository {
  async findAll() {
    // return db.select().from(${camelName}s);
    return [];
  }

  async findById(id: string) {
    // return db.select().from(${camelName}s).where(eq(${camelName}s.id, id));
    return null;
  }
}`,
  'route': `import { FastifyInstance } from 'fastify';
import { ${pascalName}Controller } from './${camelName}.controller';
import { ${camelName}Schema } from './${camelName}.schema';

export const ${camelName}Routes = async (fastify: FastifyInstance) => {
  const controller = new ${pascalName}Controller();

  fastify.get('/', {
    schema: ${camelName}Schema.getAll,
    handler: controller.getAll
  });

  fastify.get('/:id', {
    schema: ${camelName}Schema.getById,
    handler: controller.getById
  });
}`,
  'schema': `import { z } from 'zod';

export const ${camelName}Schema = {
  getAll: {
    description: 'Get all ${camelName}s',
    tags: ['${pascalName}'],
    response: {
      200: z.object({
        data: z.array(z.any())
      })
    }
  },
  getById: {
    description: 'Get ${camelName} by ID',
    tags: ['${pascalName}'],
    params: z.object({
      id: z.string()
    }),
    response: {
      200: z.object({
        data: z.any().nullable()
      })
    }
  }
}`
};

Object.entries(templates).forEach(([type, content]) => {
  const filePath = path.join(moduleDir, `${camelName}.${type}.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
});

console.log(`\nModule ${pascalName} created successfully.`);
console.log(`Don't forget to register the routes in src/routes.ts`);
