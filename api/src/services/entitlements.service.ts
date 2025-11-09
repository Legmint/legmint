import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * EntitlementsService
 *
 * Manages document generation entitlements:
 * - Active subscriptions (unlimited generation)
 * - One-time purchases (single use with expiry)
 */
@Injectable()
export class EntitlementsService {
  private readonly logger = new Logger(EntitlementsService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Check if user has access to generate a template
   * Returns: { hasAccess: boolean, reason?: string, entitlementId?: string }
   */
  async checkAccess(
    userId: string,
    templateCode: string,
  ): Promise<{
    hasAccess: boolean;
    reason?: string;
    entitlementId?: string;
    method?: 'subscription' | 'one-time';
  }> {
    // 1. Check for active subscription
    const hasActiveSubscription = await this.hasActiveSubscription(userId);

    if (hasActiveSubscription) {
      this.logger.log(
        `User ${userId} has active subscription - granting access to ${templateCode}`,
      );
      return {
        hasAccess: true,
        reason: 'active_subscription',
        method: 'subscription',
      };
    }

    // 2. Check for valid one-time entitlement
    const entitlement = await this.getValidEntitlement(userId, templateCode);

    if (entitlement) {
      this.logger.log(
        `User ${userId} has valid one-time entitlement ${entitlement.id} for ${templateCode}`,
      );
      return {
        hasAccess: true,
        reason: 'one_time_purchase',
        entitlementId: entitlement.id,
        method: 'one-time',
      };
    }

    // 3. No access
    this.logger.log(
      `User ${userId} does not have access to ${templateCode} - paywall required`,
    );
    return {
      hasAccess: false,
      reason: 'paywall_required',
    };
  }

  /**
   * Consume a one-time entitlement (mark as used)
   */
  async consumeEntitlement(entitlementId: string): Promise<void> {
    await this.dataSource.query(
      `UPDATE document_entitlements
       SET used = true, used_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [entitlementId],
    );

    this.logger.log(`Entitlement ${entitlementId} consumed`);
  }

  /**
   * Check if user has an active subscription
   */
  private async hasActiveSubscription(userId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `SELECT id FROM subscriptions
       WHERE user_id = $1
         AND status IN ('active', 'trialing')
         AND current_period_end > CURRENT_TIMESTAMP
       LIMIT 1`,
      [userId],
    );

    return result.length > 0;
  }

  /**
   * Get a valid (unused, non-expired) entitlement for a template
   */
  private async getValidEntitlement(
    userId: string,
    templateCode: string,
  ): Promise<{ id: string } | null> {
    const result = await this.dataSource.query(
      `SELECT id FROM document_entitlements
       WHERE user_id = $1
         AND template_code = $2
         AND used = false
         AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, templateCode],
    );

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get user's subscription details
   */
  async getUserSubscription(userId: string): Promise<any | null> {
    const result = await this.dataSource.query(
      `SELECT * FROM subscriptions
       WHERE user_id = $1
         AND status IN ('active', 'trialing')
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId],
    );

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get user's available entitlements
   */
  async getUserEntitlements(userId: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT * FROM document_entitlements
       WHERE user_id = $1
         AND used = false
         AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
       ORDER BY created_at DESC`,
      [userId],
    );
  }
}
