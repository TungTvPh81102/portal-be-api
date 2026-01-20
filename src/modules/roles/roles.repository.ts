import { db } from '@/db';
// import { roless } from '@/models'; // Import your table here

export class RolesRepository {
  async findAll() {
    // return db.select().from(roless);
    return [];
  }

  async findById(id: string) {
    // return db.select().from(roless).where(eq(roless.id, id));
    return null;
  }
}