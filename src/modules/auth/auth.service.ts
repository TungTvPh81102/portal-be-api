import { LoginDto, RegisterDto, RefreshTokenDto } from '@/modules/auth/auth.schema';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/common/utils/bcrypt.helper';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '@/common/utils/jwt.helper';
import { UnauthorizedError } from '@/common/errors/AppError';
import { db, refreshTokens } from '@/db';
import { eq } from 'drizzle-orm';

/**
 * Auth Service
 *
 * Handles authentication logic
 */
export class AuthService {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Find user by email
      const user = await this.usersService.getUserByEmail(data.email);

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user is enabled
      // The users table has an 'enable' field (integer)
      if (user.enable !== 1) {
        throw new UnauthorizedError('Account is disabled');
      }

      // Verify password
      const isPasswordValid = await comparePassword(data.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const userIdStr = user.id.toString();

      // Generate tokens
      const accessToken = generateToken({
        userId: userIdStr,
        email: user.email,
      });

      const refreshToken = generateRefreshToken({
        userId: userIdStr,
        email: user.email,
      });

      // Store refresh token in DB
      await db.insert(refreshTokens).values({
        userId: user.id, // bigint
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      // Return user info and tokens
      return {
        user: {
          id: userIdStr,
          email: user.email,
          name: user.name || '',
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        console.error('❌ AuthService.login Unexpected Error:', error);
      }
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterDto): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Create user using UsersService
      const user = await this.usersService.createUser(data);

      const userIdStr = user.id.toString();

      // Generate tokens
      const accessToken = generateToken({
        userId: userIdStr,
        email: user.email,
      });

      const refreshToken = generateRefreshToken({
        userId: userIdStr,
        email: user.email,
      });

      // Store refresh token in DB
      await db.insert(refreshTokens).values({
        userId: BigInt(user.id),
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      // Return user info and tokens
      return {
        user: {
          id: userIdStr,
          email: user.email,
          name: user.name || '',
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('❌ AuthService.register Error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify token
      const payload = verifyRefreshToken(data.refreshToken);

      // Check if refresh token exists in DB
      const storedTokens = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, data.refreshToken))
        .limit(1);

      if (storedTokens.length === 0) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check expiration
      if (new Date() > storedTokens[0].expiresAt) {
        await this.logout(data.refreshToken);
        throw new UnauthorizedError('Refresh token expired');
      }

      // Generate new tokens
      const newAccessToken = generateToken({
        userId: payload.userId,
        email: payload.email,
      });

      const newRefreshToken = generateRefreshToken({
        userId: payload.userId,
        email: payload.email,
      });

      // Rotate refresh token
      await db.delete(refreshTokens).where(eq(refreshTokens.token, data.refreshToken));

      await db.insert(refreshTokens).values({
        userId: BigInt(payload.userId),
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('❌ AuthService.refreshToken error:', error);
      if (error instanceof Error && error.message.includes('expired')) {
        throw new UnauthorizedError('Refresh token expired');
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  }

  /**
   * Get current user info
   */
  async getCurrentUser(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    enable: number;
    createdAt: string;
  }> {
    const user = await this.usersService.getUserById(userId);
    return {
      ...user,
      id: user.id.toString(),
      name: user.name || '',
      enable: user.enable || 0,
      createdAt: user.createdAt.toString(),
    };
  }
}
