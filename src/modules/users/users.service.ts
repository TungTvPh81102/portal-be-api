import { User } from '@/db';
import { UsersRepository } from '@/modules/users/users.repository';
import { CreateUserDto, UpdateUserDto } from '@/modules/users/users.schema';
import { hashPassword } from '@/common/utils/bcrypt.helper';
import { NotFoundError, ConflictError } from '@/common/errors/AppError';

/**
 * Users Service
 *
 * Contains all business logic for User operations.
 * Orchestrates repository calls and handles transactions.
 */
export class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(
    page = 1,
    limit = 10
  ): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.usersRepository.findAll(skip, limit),
      this.usersRepository.count(),
    ]);

    // Remove passwords from all users
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPassword,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if email already exists
    const emailExists = await this.usersRepository.emailExists(data.email);
    if (emailExists) {
      throw new ConflictError('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await this.usersRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user exists
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check if email is being changed and if it already exists
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.usersRepository.emailExists(data.email, id);
      if (emailExists) {
        throw new ConflictError('Email already exists');
      }
    }

    // Hash password if being updated
    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    // Update user
    const user = await this.usersRepository.update(id, updateData);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    await this.usersRepository.delete(id);
  }

  /**
   * Get user by email (internal use)
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
}
