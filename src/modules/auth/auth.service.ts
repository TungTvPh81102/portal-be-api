import { LoginDto, RegisterDto, RefreshTokenDto } from '@/modules/auth/auth.schema';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword, hashPassword } from '@/common/utils/bcrypt.helper';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '@/common/utils/jwt.helper';
import { UnauthorizedError, BadRequestError } from '@/common/errors/AppError';
import { db, refreshTokens, users, passwordResetTokens } from '@/db';
import { eq, and, gt } from 'drizzle-orm';
import { emailService } from '@/common/email/email.service';
import { getVerificationEmailTemplate, getResetPasswordEmailTemplate } from '@/common/email/templates/index';
import { v4 as uuidv4 } from 'uuid';

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

      // Generate verification token and send email
      const verificationToken = uuidv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await db.update(users)
        .set({ 
            verificationToken,
            verificationTokenExpiresAt: expiresAt.toISOString()
        })
        .where(eq(users.id, user.id));

      // Send verification email directly
      const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`; // TODO: Use frontend URL from env
      const html = getVerificationEmailTemplate(user.name || 'User', verificationLink);
      await emailService.sendMail(user.email, 'Verify your email', html);

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
  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    const user = await db.query.users.findFirst({
        where: and(
            eq(users.verificationToken, token),
            gt(users.verificationTokenExpiresAt, new Date().toISOString())
        )
    });

    if (!user) {
        throw new BadRequestError('Invalid or expired verification token');
    }

    await db.update(users)
        .set({ 
            emailVerifiedAt: new Date().toISOString(),
            verificationToken: null,
            verificationTokenExpiresAt: null
        })
        .where(eq(users.id, user.id));
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
        // Don't reveal if user exists
        return;
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Clean up old tokens
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email));

    await db.insert(passwordResetTokens).values({
        email,
        token,
        expiresAt: expiresAt.toISOString(),
        status: 1
    });

    // Send password reset email directly
    const resetLink = `http://localhost:3000/reset-password?token=${token}`; // TODO: Use frontend URL from env
    const html = getResetPasswordEmailTemplate(user.name || 'User', resetLink);
    await emailService.sendMail(user.email, 'Reset your password', html);
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
     // Find valid token
     const resetToken = await db.select().from(passwordResetTokens)
        .where(and(
            eq(passwordResetTokens.token, token),
            gt(passwordResetTokens.expiresAt, new Date().toISOString()),
            eq(passwordResetTokens.status, 1)
        ))
        .limit(1);

     if (resetToken.length === 0) {
        throw new BadRequestError('Invalid or expired reset token');
     }

     const email = resetToken[0].email;
     const user = await this.usersService.getUserByEmail(email);

     if (!user) {
         throw new BadRequestError('User not found');
     }

     const hashedPassword = await hashPassword(newPassword);

     // Update password
     await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, user.id));

     // Mark token as used (or delete it)
     await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email));
  }
}
