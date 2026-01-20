import { db } from '@/db';
// import { permissionss } from '@/models'; // Import your table here

export class PermissionsRepository {
  async findAll() {
    // return db.select().from(permissionss);
    return [];
  }

  async findById(id: string) {
    // return db.select().from(permissionss).where(eq(permissionss.id, id));
    return null;
  }
}