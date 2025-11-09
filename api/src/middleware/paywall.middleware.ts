/**
 * Paywall Middleware
 *
 * Enforces subscription requirements for protected routes.
 * Checks user plan, jurisdiction access, and template permissions.
 */

import { Injectable, NestMiddleware, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    plan: 'free' | 'starter' | 'pro' | 'scale';
    jurisdictions_allowed: string[];
    subscription_status?: string;
  };
}

const PLAN_HIERARCHY = {
  free: 0,
  starter: 1,
  pro: 2,
  scale: 3
};

const DEFAULT_JURISDICTIONS = {
  free: ['GLOBAL-EN'],
  starter: ['GLOBAL-EN', 'UK', 'US-DE'],
  pro: ['GLOBAL-EN', 'UK', 'US-DE', 'DE', 'FR', 'CZ'],
  scale: ['GLOBAL-EN', 'UK', 'US-DE', 'DE', 'FR', 'CZ']
};

@Injectable()
export class PaywallMiddleware implements NestMiddleware {
  /**
   * Enforce paywall on protected routes
   */
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Check if user is authenticated
    if (!req.user) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'You must be logged in to access this resource',
        details: {
          login_url: '/auth/login'
        }
      });
    }

    // Check if subscription is active (for recurring plans)
    if (req.user.plan !== 'free' && req.user.plan !== 'starter') {
      if (req.user.subscription_status !== 'active' && req.user.subscription_status !== 'trialing') {
        throw new ForbiddenException({
          code: 'SUBSCRIPTION_INACTIVE',
          message: 'Your subscription is not active',
          details: {
            current_status: req.user.subscription_status,
            renew_url: '/subscription/renew'
          }
        });
      }
    }

    next();
  }

  /**
   * Check if user has required plan level
   */
  static requirePlan(requiredPlan: 'starter' | 'pro' | 'scale') {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new UnauthorizedException({
          code: 'AUTHENTICATION_REQUIRED',
          message: 'You must be logged in to access this resource'
        });
      }

      const userLevel = PLAN_HIERARCHY[req.user.plan];
      const requiredLevel = PLAN_HIERARCHY[requiredPlan];

      if (userLevel < requiredLevel) {
        throw new ForbiddenException({
          code: 'INSUFFICIENT_PLAN',
          message: `This resource requires ${requiredPlan} plan or higher`,
          details: {
            current_plan: req.user.plan,
            required_plan: requiredPlan,
            upgrade_url: `/purchase?plan=${requiredPlan}`
          }
        });
      }

      next();
    };
  }

  /**
   * Check if user has access to requested jurisdiction
   */
  static requireJurisdiction(jurisdiction: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new UnauthorizedException({
          code: 'AUTHENTICATION_REQUIRED',
          message: 'You must be logged in to access this resource'
        });
      }

      // Get user's allowed jurisdictions (from DB or default based on plan)
      const allowedJurisdictions = req.user.jurisdictions_allowed || DEFAULT_JURISDICTIONS[req.user.plan];

      if (!allowedJurisdictions.includes(jurisdiction) && !allowedJurisdictions.includes('GLOBAL-EN')) {
        throw new ForbiddenException({
          code: 'JURISDICTION_NOT_ALLOWED',
          message: `Your subscription does not include access to ${jurisdiction}`,
          details: {
            requested_jurisdiction: jurisdiction,
            allowed_jurisdictions: allowedJurisdictions,
            upgrade_url: `/purchase/jurisdiction/${jurisdiction}`
          }
        });
      }

      next();
    };
  }

  /**
   * Check template access (combines plan + jurisdiction checks)
   */
  static requireTemplateAccess(getTemplateCode: (req: Request) => string, getJurisdiction: (req: Request) => string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new UnauthorizedException({
          code: 'AUTHENTICATION_REQUIRED',
          message: 'You must be logged in to access this resource'
        });
      }

      try {
        const templateCode = getTemplateCode(req);
        const jurisdiction = getJurisdiction(req);

        // Fetch template metadata from database
        // In production, this would be a database query
        const template = await fetchTemplateMetadata(templateCode);

        if (!template) {
          throw new ForbiddenException({
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found'
          });
        }

        // Check plan level
        const userLevel = PLAN_HIERARCHY[req.user.plan];
        const requiredLevel = PLAN_HIERARCHY[template.access_level];

        if (userLevel < requiredLevel) {
          throw new ForbiddenException({
            code: 'INSUFFICIENT_PLAN_FOR_TEMPLATE',
            message: `This template requires ${template.access_level} plan or higher`,
            details: {
              template_code: templateCode,
              template_name: template.name,
              current_plan: req.user.plan,
              required_plan: template.access_level,
              upgrade_url: `/purchase?plan=${template.access_level}`
            }
          });
        }

        // Check jurisdiction access
        const allowedJurisdictions = req.user.jurisdictions_allowed || DEFAULT_JURISDICTIONS[req.user.plan];

        if (!allowedJurisdictions.includes(jurisdiction) && jurisdiction !== 'GLOBAL-EN') {
          throw new ForbiddenException({
            code: 'JURISDICTION_NOT_ALLOWED_FOR_TEMPLATE',
            message: `Your subscription does not include ${jurisdiction} for this template`,
            details: {
              template_code: templateCode,
              requested_jurisdiction: jurisdiction,
              allowed_jurisdictions: allowedJurisdictions,
              upgrade_url: `/purchase/jurisdiction/${jurisdiction}`
            }
          });
        }

        // Check if jurisdiction is supported by template
        if (!template.supported_jurisdictions.includes(jurisdiction)) {
          throw new ForbiddenException({
            code: 'JURISDICTION_NOT_SUPPORTED',
            message: `This template does not support ${jurisdiction}`,
            details: {
              template_code: templateCode,
              requested_jurisdiction: jurisdiction,
              supported_jurisdictions: template.supported_jurisdictions
            }
          });
        }

        next();
      } catch (error) {
        if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
          throw error;
        }
        throw new ForbiddenException({
          code: 'ACCESS_CHECK_FAILED',
          message: 'Failed to verify template access',
          details: { error: error.message }
        });
      }
    };
  }
}

/**
 * Mock function - replace with actual database query
 */
async function fetchTemplateMetadata(templateCode: string) {
  // This would be a database query in production
  // For now, return mock data
  const templates = {
    'SAFE_PM_V1': {
      template_code: 'SAFE_PM_V1',
      name: 'SAFE Agreement (Post-Money)',
      access_level: 'starter',
      supported_jurisdictions: ['GLOBAL-EN', 'UK', 'US-DE', 'DE', 'FR', 'CZ']
    },
    'SHAREHOLDERS_AGREEMENT_V1': {
      template_code: 'SHAREHOLDERS_AGREEMENT_V1',
      name: "Shareholders' Agreement",
      access_level: 'pro',
      supported_jurisdictions: ['GLOBAL-EN', 'UK', 'US-DE', 'DE', 'FR', 'CZ']
    },
    'DPA_V1': {
      template_code: 'DPA_V1',
      name: 'Data Processing Agreement (GDPR)',
      access_level: 'pro',
      supported_jurisdictions: ['GLOBAL-EN', 'UK', 'US-DE', 'DE', 'FR', 'CZ']
    }
  };

  return templates[templateCode] || null;
}

export default PaywallMiddleware;
