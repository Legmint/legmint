# Entitlements Guard - Usage Example

## How to Use the EntitlementsGuard

The `EntitlementsGuard` protects your document generation endpoints, ensuring users have either:
1. An active subscription, OR
2. A valid one-time purchase for the specific template

## Example: Protect a Generate Endpoint

```typescript
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EntitlementsGuard, consumeEntitlementIfNeeded } from '../guards/entitlements.guard';
import { EntitlementsService } from '../services/entitlements.service';
import { GenerationService } from '../services/generation.service';

@Controller('generation')
export class GenerationController {
  constructor(
    private readonly generationService: GenerationService,
    private readonly entitlementsService: EntitlementsService,
  ) {}

  /**
   * Generate a document with entitlements check
   */
  @Post('generate/:templateCode')
  @UseGuards(EntitlementsGuard)
  async generateDocument(
    @Param('templateCode') templateCode: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    const userId = req.auth?.userId || req.user?.id;

    // At this point, the guard has verified the user has access
    // Generate the document
    const document = await this.generationService.generate({
      templateCode,
      userId,
      answers: body.answers,
    });

    // If this was a one-time purchase, consume the entitlement
    await consumeEntitlementIfNeeded(req, this.entitlementsService);

    // You can also log which method was used
    console.log(`Document generated via ${req.accessMethod}`);

    return {
      success: true,
      documentId: document.id,
      accessMethod: req.accessMethod, // 'subscription' or 'one-time'
    };
  }
}
```

## What Happens

1. **Guard runs first**: Before your endpoint logic executes, `EntitlementsGuard` checks:
   - Does the user have an active subscription?
   - Or, does the user have a valid one-time entitlement for this template?

2. **Access granted**: If yes, the guard:
   - Allows the request to proceed
   - Attaches `req.accessMethod` ('subscription' or 'one-time')
   - If one-time, attaches `req.entitlementToConsume` with the entitlement ID

3. **Generate document**: Your endpoint logic runs and creates the document

4. **Consume entitlement**: After successful generation, call `consumeEntitlementIfNeeded()` to mark the one-time entitlement as used (if applicable)

## Error Handling

If the user doesn't have access, the guard throws:
```typescript
ForbiddenException('You do not have access to generate this document. Please purchase it or subscribe.')
```

Your frontend should catch this and redirect to checkout:
```typescript
try {
  const response = await fetch('/api/generation/generate/incorporation', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });

  if (response.status === 403) {
    // Redirect to checkout
    window.location.href = '/checkout/incorporation';
  }
} catch (error) {
  // Handle error
}
```

## Checking Entitlements Manually (Optional)

You can also check entitlements without using the guard:

```typescript
const accessCheck = await this.entitlementsService.checkAccess(userId, templateCode);

if (!accessCheck.hasAccess) {
  return { requiresPayment: true, reason: accessCheck.reason };
}

// Proceed with generation
```

## Listing User Entitlements

```typescript
@Get('my-entitlements')
async getMyEntitlements(@Request() req: any) {
  const userId = req.auth?.userId || req.user?.id;

  const subscription = await this.entitlementsService.getUserSubscription(userId);
  const entitlements = await this.entitlementsService.getUserEntitlements(userId);

  return {
    subscription,
    oneTimePurchases: entitlements,
  };
}
```

## Important Notes

1. **Consume after success**: Only call `consumeEntitlementIfNeeded()` AFTER the document is successfully generated. Don't consume if generation fails.

2. **Template code source**: The guard looks for `templateCode` in:
   - Route params (`:templateCode`)
   - Request body (`body.templateCode`)
   - Query params (`?templateCode=xxx`)

3. **User ID source**: Ensure your authentication middleware sets either:
   - `req.auth.userId` (Clerk)
   - `req.user.id` (Passport/JWT)

4. **Subscription vs One-time**:
   - Subscriptions: Unlimited generation, not consumed
   - One-time: Single use, must be consumed after generation

## Testing

1. **Test with subscription**:
   - Create a subscription in Stripe
   - Trigger webhook to sync to DB
   - Try generating any template → should work

2. **Test with one-time purchase**:
   - Complete template checkout
   - Webhook creates entitlement
   - Generate once → works
   - Try again → should fail (entitlement consumed)

3. **Test without access**:
   - No subscription, no entitlement
   - Try to generate → 403 Forbidden
