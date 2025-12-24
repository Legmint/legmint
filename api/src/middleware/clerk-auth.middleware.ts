import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';

/**
 * Clerk Authentication Middleware
 *
 * Verifies Clerk JWT tokens and attaches user info to the request.
 * The frontend sends tokens via Authorization: Bearer <token>
 *
 * After this middleware runs, the following are available on req:
 * - req.auth.userId: The Clerk user ID
 * - req.auth.email: The user's primary email (if available)
 */

// Extend Express Request to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email?: string;
        sessionId?: string;
      };
    }
  }
}

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ClerkAuthMiddleware.name);
  private secretKey: string | undefined;
  private clerkClient: ReturnType<typeof createClerkClient> | undefined;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (this.secretKey) {
      this.clerkClient = createClerkClient({ secretKey: this.secretKey });
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // Skip if no Clerk configured
    if (!this.secretKey) {
      this.logger.warn('Clerk not configured - CLERK_SECRET_KEY missing');
      return next();
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without auth (public endpoints)
      return next();
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify the session token with Clerk
      const verifiedToken = await verifyToken(token, {
        secretKey: this.secretKey,
      });

      if (verifiedToken && verifiedToken.sub) {
        // Get user details to retrieve email
        let email: string | undefined;
        try {
          if (this.clerkClient) {
            const user = await this.clerkClient.users.getUser(verifiedToken.sub);
            email = user.emailAddresses?.find(
              (e) => e.id === user.primaryEmailAddressId,
            )?.emailAddress;
          }
        } catch (userError) {
          this.logger.warn(`Could not fetch user details: ${userError}`);
        }

        // Attach auth info to request
        req.auth = {
          userId: verifiedToken.sub,
          email,
          sessionId: verifiedToken.sid,
        };

        this.logger.debug(`Authenticated user: ${verifiedToken.sub}`);
      }
    } catch (error) {
      // Invalid token - log but continue (endpoint will handle auth requirement)
      this.logger.warn(`Token verification failed: ${error.message}`);
    }

    next();
  }
}
