import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { EntitlementsService } from '../services/entitlements.service';

/**
 * EntitlementsGuard
 *
 * NestJS guard to check document generation entitlements
 * Ensures user has either:
 * - An active subscription, OR
 * - A valid one-time purchase for the template
 *
 * Usage on a controller:
 * @UseGuards(EntitlementsGuard)
 * @Post('generate/:templateCode')
 * async generateDocument(@Param('templateCode') templateCode: string, @Request() req) {
 *   // Access is granted, proceed with generation
 *   // If one-time purchase, entitlement will be marked as used
 * }
 */
@Injectable()
export class EntitlementsGuard implements CanActivate {
  private readonly logger = new Logger(EntitlementsGuard.name);

  constructor(private readonly entitlementsService: EntitlementsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract user ID (adjust based on your auth middleware)
    const userId = request.auth?.userId || request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract template code from route params or body
    const templateCode =
      request.params?.templateCode ||
      request.body?.templateCode ||
      request.query?.templateCode;

    if (!templateCode) {
      throw new ForbiddenException('Template code not specified');
    }

    this.logger.log(
      `Checking entitlements for user ${userId}, template ${templateCode}`,
    );

    // Check access
    const accessCheck = await this.entitlementsService.checkAccess(
      userId,
      templateCode,
    );

    if (!accessCheck.hasAccess) {
      throw new ForbiddenException(
        'You do not have access to generate this document. Please purchase it or subscribe.',
      );
    }

    // If one-time purchase, consume the entitlement after successful generation
    if (
      accessCheck.method === 'one-time' &&
      accessCheck.entitlementId
    ) {
      // Store entitlement ID in request for consumption after generation
      request.entitlementToConsume = accessCheck.entitlementId;
    }

    // Store access method in request for logging
    request.accessMethod = accessCheck.method;

    return true;
  }
}

/**
 * Helper function to consume entitlement after successful generation
 * Call this in your generate controller after document is created
 *
 * Example:
 * const document = await this.generateDocument(...);
 * await consumeEntitlementIfNeeded(req, this.entitlementsService);
 * return document;
 */
export async function consumeEntitlementIfNeeded(
  request: any,
  entitlementsService: EntitlementsService,
): Promise<void> {
  if (request.entitlementToConsume) {
    await entitlementsService.consumeEntitlement(request.entitlementToConsume);
  }
}
