# Legmint Pre-Deployment Readiness Guide

> **Complete Production Deployment Checklist**
> Transform your Legmint MVP from development to production-ready in one structured session.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Step 1: Git Initialization](#step-1-git-initialization)
3. [Step 2: Clerk Authentication Setup](#step-2-clerk-authentication-setup)
4. [Step 3: Database Migrations & Seeding](#step-3-database-migrations--seeding)
5. [Step 4: Stripe Integration](#step-4-stripe-integration)
6. [Step 5: AWS S3 Document Storage](#step-5-aws-s3-document-storage)
7. [Step 6: SendGrid Email Service](#step-6-sendgrid-email-service)
8. [Step 7: Security & QA](#step-7-security--qa)
9. [Step 8: Production Deployment](#step-8-production-deployment)
10. [Final Acceptance Criteria](#final-acceptance-criteria)

---

## Overview

### Current State
- ✅ **Backend**: NestJS with TypeORM, Helmet, CORS configured
- ✅ **Frontend**: Next.js with Tailwind CSS
- ✅ **Security**: Helmet middleware active
- ✅ **API Documentation**: Swagger configured
- ⚠️ **Git**: Not initialized
- ⚠️ **Auth**: Clerk environment variables configured but not implemented
- ⚠️ **Database**: Entities created, migrations needed
- ⚠️ **Integrations**: Stripe, S3, SendGrid need implementation

### Target State
✅ Production-ready application with:
- Git version control initialized
- Clerk authentication fully integrated
- Database migrations and seed data
- Stripe payment processing operational
- AWS S3 document storage configured
- SendGrid transactional emails working
- Security hardened and QA-tested
- Deployed to Render (backend) + Vercel (frontend)

---

## Step 1: Git Initialization

### 1.1 Initialize Git Repository

```bash
# Navigate to project root
cd /Users/marekchudomel/coding/LegalMind

# Initialize Git
git init

# Verify .gitignore exists
cat .gitignore
```

### 1.2 Enhanced .gitignore

Your project already has a `.gitignore` file. Verify it includes these critical entries:

```bash
# Check if .gitignore contains essential patterns
grep -E "node_modules|\.env|dist|\.next|\.DS_Store" .gitignore
```

If any are missing, add them:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# Environment variables
.env
.env.local
.env.*.local
*.env

# Build outputs
dist/
build/
.next/
out/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log

# Testing
coverage/
.nyc_output/

# Secrets
*.pem
*.key
credentials.json
service-account.json

# AWS
.aws/

# Database
*.sqlite
*.db
```

### 1.3 Git Attributes for Line Endings

Create `.gitattributes` for consistent line endings:

```bash
cat > .gitattributes << 'EOF'
# Auto detect text files and normalize line endings to LF
* text=auto eol=lf

# Explicitly declare text files
*.ts text
*.tsx text
*.js text
*.jsx text
*.json text
*.md text
*.yml text
*.yaml text

# Declare files that will always have CRLF line endings on checkout
*.bat text eol=crlf

# Denote all files that are truly binary and should not be modified
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
EOF
```

### 1.4 Initial Commit

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial Legmint project setup - NestJS backend + Next.js frontend

- NestJS API with TypeORM, Swagger, Helmet
- Next.js frontend with Tailwind CSS
- Environment configuration templates
- TypeORM entities for users, templates, lawyers, subscriptions
- API documentation and health check endpoints
- Project documentation and architecture docs

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Set default branch to main
git branch -M main
```

### 1.5 Connect to Remote Repository

```bash
# Replace <YOUR_USERNAME> with your GitHub username
git remote add origin https://github.com/<YOUR_USERNAME>/legmint.git

# Verify remote
git remote -v

# Push to remote (create repo on GitHub first)
git push -u origin main
```

**✅ Checkpoint**: Git initialized with clean commit history

---

## Step 2: Clerk Authentication Setup

### 2.1 Get Clerk Credentials

1. Sign up at [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create new application: "Legmint"
3. Copy API keys from **API Keys** section:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2.2 Install Clerk SDK (Frontend)

```bash
cd demo

# Install Clerk Next.js SDK
npm install @clerk/nextjs

cd ..
```

### 2.3 Configure Frontend Environment

Update `demo/.env.local` (create if doesn't exist):

```bash
# Copy example and edit
cd demo
cp .env.example .env.local

# Edit with your actual Clerk keys
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
# CLERK_SECRET_KEY=sk_test_YOUR_KEY
```

### 2.4 Wrap Next.js App with ClerkProvider

Create/update `demo/src/app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 2.5 Create Protected Routes with Middleware

Create `demo/middleware.ts`:

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
  ],

  // Routes that require authentication
  ignoredRoutes: [
    "/api/public(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 2.6 Create Sign-In and Sign-Up Pages

Create `demo/src/app/sign-in/[[...sign-in]]/page.tsx`:

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        afterSignInUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
```

Create `demo/src/app/sign-up/[[...sign-up]]/page.tsx`:

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
```

### 2.7 Create Protected Dashboard

Create `demo/src/app/dashboard/page.tsx`:

```typescript
import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Legmint
        </h1>
        <p className="text-gray-600">
          Logged in as: {user?.emailAddresses[0]?.emailAddress}
        </p>
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Templates</h2>
          <p className="text-gray-500">Your legal documents will appear here.</p>
        </div>
      </div>
    </div>
  );
}
```

### 2.8 Backend: Install Clerk SDK

```bash
cd api

# Install Clerk SDK for Node
npm install @clerk/clerk-sdk-node

cd ..
```

### 2.9 Backend: Create Clerk Auth Guard

Create `api/src/guards/clerk-auth.guard.ts`:

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient;

  constructor(private configService: ConfigService) {
    this.clerkClient = createClerkClient({
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authHeader.substring(7);

    try {
      // Verify the session token
      const session = await this.clerkClient.sessions.verifySession(
        request.headers['clerk-session-id'],
        token,
      );

      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }

      // Get user details
      const user = await this.clerkClient.users.getUser(session.userId);

      // Attach user to request
      request.user = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
```

### 2.10 Apply Guard to Protected Routes

Update your controllers to use the guard:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async getCurrentUser(@Request() req) {
    return req.user;
  }
}
```

**✅ Checkpoint**: Clerk authentication integrated on frontend and backend

---

## Step 3: Database Migrations & Seeding

### 3.1 Verify TypeORM Configuration

Check `api/src/app.module.ts` for TypeORM configuration:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: true,
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### 3.2 Create TypeORM Configuration File

Create `api/ormconfig.ts`:

```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'legmint',
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
});
```

### 3.3 Add Migration Scripts

Update `api/package.json` scripts:

```json
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d ormconfig.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d ormconfig.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d ormconfig.ts",
    "seed": "ts-node src/seeds/seed.ts"
  }
}
```

### 3.4 Generate Initial Migration

```bash
cd api

# Create migrations directory
mkdir -p src/migrations

# Generate migration from existing entities
npm run migration:generate -- src/migrations/InitialSchema

cd ..
```

### 3.5 Create Seed Script

Create `api/src/seeds/seed.ts`:

```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User, Plan } from '../entities/user.entity';
import { Template } from '../entities/template.entity';
import { Partner } from '../entities/partner.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'legmint',
  entities: ['src/entities/**/*.entity.ts'],
  synchronize: false,
});

async function seed() {
  console.log('🌱 Starting database seeding...');

  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const templateRepo = AppDataSource.getRepository(Template);
  const partnerRepo = AppDataSource.getRepository(Partner);

  // Seed Templates
  const templates = [
    {
      name: 'SAFE Agreement (Post-Money)',
      category: 'Fundraising',
      jurisdiction: 'US-DE',
      description: 'Simple Agreement for Future Equity - investor-friendly',
      contentUrl: '/packs/fundraising/safe-post-money.hbs',
      jurisdictionsSupported: ['GLOBAL-EN', 'US-DE'],
      isActive: true,
    },
    {
      name: 'Employment Agreement',
      category: 'Hiring',
      jurisdiction: 'UK',
      description: 'Standard employment contract template',
      contentUrl: '/packs/hiring/employment-agreement.hbs',
      jurisdictionsSupported: ['UK', 'GLOBAL-EN'],
      isActive: true,
    },
    {
      name: 'Consultancy Agreement',
      category: 'Hiring',
      jurisdiction: 'GLOBAL-EN',
      description: 'Independent contractor/consultant agreement',
      contentUrl: '/packs/hiring/consultancy-agreement.hbs',
      jurisdictionsSupported: ['GLOBAL-EN', 'UK', 'US-DE'],
      isActive: true,
    },
    {
      name: 'SaaS Terms of Service',
      category: 'Legal',
      jurisdiction: 'GLOBAL-EN',
      description: 'Standard SaaS terms and conditions',
      contentUrl: '/packs/legal/saas-tos.hbs',
      jurisdictionsSupported: ['GLOBAL-EN'],
      isActive: true,
    },
    {
      name: 'Privacy Policy (GDPR)',
      category: 'Legal',
      jurisdiction: 'UK',
      description: 'GDPR-compliant privacy policy',
      contentUrl: '/packs/legal/privacy-gdpr.hbs',
      jurisdictionsSupported: ['UK', 'GLOBAL-EN'],
      isActive: true,
    },
    {
      name: 'Founder Shareholder Agreement',
      category: 'Incorporation',
      jurisdiction: 'US-DE',
      description: 'Multi-founder equity and governance agreement',
      contentUrl: '/packs/incorporation/shareholder-agreement.hbs',
      jurisdictionsSupported: ['US-DE', 'UK'],
      isActive: true,
    },
    {
      name: 'NDA (Mutual)',
      category: 'Legal',
      jurisdiction: 'GLOBAL-EN',
      description: 'Mutual non-disclosure agreement',
      contentUrl: '/packs/legal/nda-mutual.hbs',
      jurisdictionsSupported: ['GLOBAL-EN', 'UK', 'US-DE'],
      isActive: true,
    },
    {
      name: 'Advisor Agreement with Equity',
      category: 'Hiring',
      jurisdiction: 'US-DE',
      description: 'Advisor agreement with equity compensation',
      contentUrl: '/packs/hiring/advisor-equity.hbs',
      jurisdictionsSupported: ['US-DE', 'GLOBAL-EN'],
      isActive: true,
    },
    {
      name: 'SaaS Master Service Agreement',
      category: 'Legal',
      jurisdiction: 'GLOBAL-EN',
      description: 'Enterprise SaaS MSA template',
      contentUrl: '/packs/legal/saas-msa.hbs',
      jurisdictionsSupported: ['GLOBAL-EN', 'UK', 'US-DE'],
      isActive: true,
    },
    {
      name: 'Convertible Note Term Sheet',
      category: 'Fundraising',
      jurisdiction: 'US-DE',
      description: 'Convertible debt financing terms',
      contentUrl: '/packs/fundraising/convertible-note.hbs',
      jurisdictionsSupported: ['US-DE', 'GLOBAL-EN'],
      isActive: true,
    },
  ];

  console.log('📄 Seeding templates...');
  for (const templateData of templates) {
    const exists = await templateRepo.findOne({
      where: { name: templateData.name },
    });
    if (!exists) {
      await templateRepo.save(templateData);
      console.log(`  ✅ Created: ${templateData.name}`);
    }
  }

  // Seed Sample Lawyers/Partners
  const lawyers = [
    {
      name: 'Sarah Mitchell',
      email: 'sarah@mitchelllegal.com',
      firm: 'Mitchell Legal Partners',
      jurisdiction: 'US-DE',
      specializations: ['Fundraising', 'Incorporation'],
      status: 'approved',
      isActive: true,
    },
    {
      name: 'James Thompson',
      email: 'james@ukstartuplaw.co.uk',
      firm: 'UK Startup Law',
      jurisdiction: 'UK',
      specializations: ['Hiring', 'Legal', 'Incorporation'],
      status: 'approved',
      isActive: true,
    },
    {
      name: 'Dr. Elena Richter',
      email: 'elena@richterlegal.de',
      firm: 'Richter Legal Advisors',
      jurisdiction: 'DE',
      specializations: ['Legal', 'Incorporation'],
      status: 'approved',
      isActive: true,
    },
  ];

  console.log('⚖️  Seeding lawyers/partners...');
  for (const lawyerData of lawyers) {
    const exists = await partnerRepo.findOne({
      where: { email: lawyerData.email },
    });
    if (!exists) {
      await partnerRepo.save(lawyerData);
      console.log(`  ✅ Created: ${lawyerData.name}`);
    }
  }

  console.log('✅ Database seeding completed!');
  await AppDataSource.destroy();
}

seed()
  .then(() => {
    console.log('🎉 Seeding successful');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
```

### 3.6 Run Migrations and Seeds

```bash
cd api

# Run migrations
npm run migration:run

# Seed database
npm run seed

cd ..
```

**✅ Checkpoint**: Database schema created and populated with seed data

---

## Step 4: Stripe Integration

### 4.1 Get Stripe Credentials

1. Sign up at [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Get API keys from **Developers > API keys**:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_`)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
3. Enable Stripe Connect:
   - Go to **Connect > Settings**
   - Copy `STRIPE_CONNECT_CLIENT_ID` (starts with `ca_`)
4. Configure webhook endpoint (after deployment):
   - Go to **Developers > Webhooks**
   - Add endpoint: `https://api.legmint.com/v1/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy `STRIPE_WEBHOOK_SECRET` (starts with `whsec_`)

### 4.2 Create Stripe Products

Run this script or use Stripe Dashboard:

```bash
# Use Stripe CLI or Dashboard to create products
stripe products create \
  --name="Legmint Starter" \
  --description="One-time access to 5 templates"

stripe prices create \
  --product=prod_XXXXX \
  --unit-amount=9900 \
  --currency=usd \
  --metadata[plan]=starter
```

Create products:
- **Starter**: $99 one-time (5 templates)
- **Pro**: $29/month (unlimited templates)
- **Scale**: $99/month (unlimited + lawyer referrals)

### 4.3 Backend: Stripe Service

Create `api/src/services/stripe.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async createCheckoutSession(
    userId: string,
    priceId: string,
    customerEmail: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      mode: priceId.includes('month') ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        userId,
      },
      success_url: `${this.configService.get('FRONTEND_URL')}/dashboard?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pricing?canceled=true`,
    });
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createConnectAccount(email: string): Promise<Stripe.Account> {
    return this.stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
  }

  async createAccountLink(accountId: string): Promise<Stripe.AccountLink> {
    return this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${this.configService.get('FRONTEND_URL')}/lawyer/onboarding`,
      return_url: `${this.configService.get('FRONTEND_URL')}/lawyer/dashboard`,
      type: 'account_onboarding',
    });
  }

  async constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
```

### 4.4 Backend: Stripe Webhook Controller

Create `api/src/controllers/stripe-webhook.controller.ts`:

```typescript
import {
  Controller,
  Post,
  Headers,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from '../services/stripe.service';
import { SubscriptionService } from '../services/subscription.service';

@Controller('stripe')
export class StripeWebhookController {
  constructor(
    private stripeService: StripeService,
    private subscriptionService: SubscriptionService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing request body');
    }

    const event = await this.stripeService.constructWebhookEvent(
      rawBody,
      signature,
    );

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await this.subscriptionService.handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await this.subscriptionService.handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await this.subscriptionService.handleSubscriptionCanceled(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
```

### 4.5 Frontend: Stripe Checkout

Create `demo/src/components/PricingCard.tsx`:

```typescript
'use client';

import { useState } from 'react';

interface PricingCardProps {
  name: string;
  price: string;
  interval?: string;
  features: string[];
  priceId: string;
  popular?: boolean;
}

export default function PricingCard({
  name,
  price,
  interval,
  features,
  priceId,
  popular,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-8 ${
        popular ? 'border-indigo-600' : 'border-gray-200'
      }`}
    >
      {popular && (
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mt-4">{name}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold">${price}</span>
        {interval && <span className="text-gray-600">/{interval}</span>}
      </div>
      <ul className="mt-6 space-y-4">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`mt-8 w-full py-3 rounded-lg font-semibold ${
          popular
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } disabled:opacity-50`}
      >
        {loading ? 'Loading...' : 'Get Started'}
      </button>
    </div>
  );
}
```

**✅ Checkpoint**: Stripe checkout and webhooks configured

---

## Step 5: AWS S3 Document Storage

### 5.1 Create AWS IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create new user: `legmint-s3-uploader`
3. Attach policy: `AmazonS3FullAccess` (or custom policy below)
4. Save credentials:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

Custom IAM Policy (recommended):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::legmint-documents/*",
        "arn:aws:s3:::legmint-documents"
      ]
    }
  ]
}
```

### 5.2 Create S3 Buckets

```bash
# Using AWS CLI
aws s3 mb s3://legmint-documents --region eu-west-1
aws s3 mb s3://legmint-previews --region eu-west-1

# Configure CORS
aws s3api put-bucket-cors --bucket legmint-documents --cors-configuration file://cors.json
```

Create `cors.json`:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://legmint.com", "http://localhost:3001"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 5.3 Backend: S3 Upload Service

Create `api/src/services/s3.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.get<string>('S3_BUCKET');
  }

  async uploadDocument(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ServerSideEncryption: 'AES256',
    });

    await this.s3Client.send(command);
    return key;
  }

  async getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  generateDocumentKey(userId: string, templateId: string, format: string): string {
    const timestamp = Date.now();
    return `documents/${userId}/${templateId}-${timestamp}.${format}`;
  }
}
```

### 5.4 Usage Example in Generation Service

```typescript
import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';

@Injectable()
export class GenerationService {
  constructor(private s3Service: S3Service) {}

  async generateAndUploadDocument(
    userId: string,
    templateId: string,
    content: Buffer,
    format: 'pdf' | 'docx',
  ) {
    const key = this.s3Service.generateDocumentKey(userId, templateId, format);

    await this.s3Service.uploadDocument(
      content,
      key,
      format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    // Generate signed URL for download
    const downloadUrl = await this.s3Service.getSignedDownloadUrl(key);

    return {
      key,
      downloadUrl,
      expiresAt: new Date(Date.now() + 3600 * 1000),
    };
  }
}
```

**✅ Checkpoint**: S3 document storage configured

---

## Step 6: SendGrid Email Service

### 6.1 Setup SendGrid Account

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create API key: **Settings > API Keys > Create API Key**
3. Copy `SENDGRID_API_KEY` (starts with `SG.`)
4. Verify sender email:
   - **Settings > Sender Authentication**
   - Verify `noreply@legmint.com`

### 6.2 Install SendGrid SDK

```bash
cd api
npm install @sendgrid/mail
cd ..
```

### 6.3 Backend: Email Service

Create `api/src/services/email.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

@Injectable()
export class EmailService {
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    sgMail.setApiKey(apiKey);
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@legmint.com');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const msg = {
      to: options.to,
      from: this.fromEmail,
      subject: options.subject,
      text: options.text,
      html: options.html,
      templateId: options.templateId,
      dynamicTemplateData: options.dynamicTemplateData,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${options.to}`);
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'Welcome to Legmint - Your Legal Launchpad',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to Legmint, ${userName}!</h1>
          <p>Your account has been created successfully.</p>
          <p>Get started by exploring our template library:</p>
          <a href="https://legmint.com/dashboard" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            Go to Dashboard
          </a>
          <p style="margin-top: 24px; color: #6B7280;">
            Need help? Reply to this email or contact <a href="mailto:support@legmint.com">support@legmint.com</a>
          </p>
        </div>
      `,
    });
  }

  async sendDocumentReadyEmail(
    userEmail: string,
    templateName: string,
    downloadUrl: string,
  ): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: `Your ${templateName} is ready`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Your Document is Ready!</h1>
          <p>Your <strong>${templateName}</strong> has been generated and is ready to download.</p>
          <a href="${downloadUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            Download Document
          </a>
          <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
            This link expires in 24 hours.
          </p>
        </div>
      `,
    });
  }

  async sendLawyerReferralNotification(
    lawyerEmail: string,
    clientName: string,
    templateName: string,
  ): Promise<void> {
    await this.sendEmail({
      to: lawyerEmail,
      subject: 'New Client Referral from Legmint',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">New Client Referral</h1>
          <p>You have a new client referral from Legmint:</p>
          <ul>
            <li><strong>Client:</strong> ${clientName}</li>
            <li><strong>Template:</strong> ${templateName}</li>
          </ul>
          <a href="https://legmint.com/lawyer/dashboard" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            View Details
          </a>
        </div>
      `,
    });
  }
}
```

### 6.4 Usage Example

```typescript
import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class UserService {
  constructor(private emailService: EmailService) {}

  async createUser(email: string, name: string) {
    // ... create user logic

    // Send welcome email
    await this.emailService.sendWelcomeEmail(email, name);

    return user;
  }
}
```

**✅ Checkpoint**: SendGrid email service integrated

---

## Step 7: Security & QA

### 7.1 Security Checklist

Your application already has several security measures in place. Verify:

```bash
cd api

# Check if helmet is imported in main.ts
grep "helmet" src/main.ts

# Check CORS configuration
grep "enableCors" src/main.ts

# Verify validation pipes
grep "ValidationPipe" src/main.ts

cd ..
```

### 7.2 Additional Security Headers

Update `api/src/main.ts` to enhance helmet configuration:

```typescript
import helmet from 'helmet';

// In bootstrap function
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);
```

### 7.3 Environment Variable Validation

Create `api/src/config/env.validation.ts`:

```typescript
import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  validateSync,
  IsOptional,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  CLERK_SECRET_KEY: string;

  @IsString()
  STRIPE_SECRET_KEY: string;

  @IsString()
  STRIPE_WEBHOOK_SECRET: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  SENDGRID_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
```

Update `api/src/app.module.ts`:

```typescript
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    // ...
  ],
})
export class AppModule {}
```

### 7.4 Pre-Production Security Audit

Run this security checklist:

```bash
# Install security audit tools
npm install -g snyk

# Run security audit in both projects
cd api
npm audit
npx snyk test

cd ../demo
npm audit
npx snyk test

cd ..
```

### 7.5 QA Test Suite

Create `api/test/e2e/health.e2e-spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe 'HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
      });
  });
});
```

Run tests:

```bash
cd api
npm run test:e2e
cd ..
```

### 7.6 Manual QA Checklist

- [ ] ✅ Clerk login/logout works
- [ ] ✅ Protected routes redirect to login
- [ ] ✅ API returns 401 for unauthenticated requests
- [ ] ✅ Stripe checkout creates session
- [ ] ✅ Webhook endpoint verifies signature
- [ ] ✅ S3 upload generates signed URLs
- [ ] ✅ SendGrid emails deliver successfully
- [ ] ✅ HTTPS enforced (after deployment)
- [ ] ✅ CORS only allows whitelisted origins
- [ ] ✅ No `.env` files committed to Git
- [ ] ✅ No API keys logged in production
- [ ] ✅ Database connections pooled correctly
- [ ] ✅ Rate limiting active on API endpoints

**✅ Checkpoint**: Security hardened, QA tests passing

---

## Step 8: Production Deployment

### 8.1 Backend Deployment (Render)

Your project already has `api/render.yaml`. Verify configuration:

```yaml
# api/render.yaml
services:
  - type: web
    name: legmint-api
    env: node
    region: oregon
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    healthCheckPath: /v1/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DATABASE_URL
        fromDatabase:
          name: legmint-db
          property: connectionString
      - key: CLERK_SECRET_KEY
        sync: false
      - key: STRIPE_SECRET_KEY
        sync: false
      - key: STRIPE_WEBHOOK_SECRET
        sync: false
      - key: AWS_ACCESS_KEY_ID
        sync: false
      - key: AWS_SECRET_ACCESS_KEY
        sync: false
      - key: SENDGRID_API_KEY
        sync: false

databases:
  - name: legmint-db
    plan: starter
    databaseName: legmint
    user: legmint
```

Deploy to Render:

```bash
# Connect GitHub repo to Render
# Dashboard: https://dashboard.render.com/

# Or use Render CLI
render deploy
```

### 8.2 Frontend Deployment (Vercel)

Your project already has `demo/vercel.json`. Deploy:

```bash
cd demo

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

cd ..
```

Configure environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_API_URL` (your Render backend URL)

### 8.3 Database Migration in Production

```bash
# SSH into Render service or run migration via dashboard
npm run migration:run
npm run seed
```

### 8.4 Configure Stripe Webhook

After deployment, update Stripe webhook endpoint:

1. Go to **Stripe Dashboard > Developers > Webhooks**
2. Update endpoint URL to: `https://api.legmint.com/v1/stripe/webhook`
3. Test webhook delivery

### 8.5 GitHub Actions CI/CD (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install API dependencies
        run: |
          cd api
          npm ci

      - name: Lint API
        run: |
          cd api
          npm run lint

      - name: Test API
        run: |
          cd api
          npm run test

      - name: Install Frontend dependencies
        run: |
          cd demo
          npm ci

      - name: Build Frontend
        run: |
          cd demo
          npm run build
```

### 8.6 Post-Deployment Smoke Tests

Run these commands after deployment:

```bash
# Test backend health
curl https://api.legmint.com/v1/health

# Test CORS
curl -H "Origin: https://legmint.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  https://api.legmint.com/v1/templates

# Test frontend
curl -I https://legmint.com

# Test authentication redirect
curl -I https://legmint.com/dashboard
```

Expected responses:
- `/v1/health` → `200 OK` with JSON `{ "status": "ok" }`
- CORS preflight → Headers include `Access-Control-Allow-Origin`
- Frontend → `200 OK`
- Protected route → Redirect to sign-in

**✅ Checkpoint**: Application deployed to production

---

## Final Acceptance Criteria

### Pre-Deployment Complete ✅

- [x] **Git initialized** and committed with clean history
- [x] **Clerk authentication** working on frontend and backend
- [x] **Database migrations** applied and seeded
- [x] **Stripe checkout** creates sessions and webhooks verify
- [x] **S3 document storage** uploads and generates signed URLs
- [x] **SendGrid emails** deliver successfully
- [x] **Security middleware** active (Helmet, CORS, validation)
- [x] **QA tests** passing (health check, E2E)
- [x] **Deployed** to Render (backend) and Vercel (frontend)
- [x] **Environment variables** configured in production
- [x] **Webhooks** configured (Stripe, Clerk)

### Production Readiness Verification

Run this final verification script:

```bash
#!/bin/bash

echo "🔍 Legmint Production Readiness Check"
echo "========================================"

# Check Git
if [ -d .git ]; then
  echo "✅ Git initialized"
else
  echo "❌ Git not initialized"
fi

# Check environment files
if [ -f api/.env ]; then
  echo "⚠️  WARNING: api/.env exists (should be .gitignored)"
fi

if [ -f demo/.env.local ]; then
  echo "⚠️  WARNING: demo/.env.local exists (should be .gitignored)"
fi

# Check dependencies
cd api
if [ -d node_modules ]; then
  echo "✅ API dependencies installed"
fi
cd ..

cd demo
if [ -d node_modules ]; then
  echo "✅ Frontend dependencies installed"
fi
cd ..

# Check builds
cd api
if [ -d dist ]; then
  echo "✅ API build directory exists"
fi
cd ..

cd demo
if [ -d .next ]; then
  echo "✅ Frontend build directory exists"
fi
cd ..

echo "========================================"
echo "🎉 Pre-deployment checks complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend: Render Dashboard"
echo "3. Deploy frontend: vercel --prod"
echo "4. Configure Stripe webhook URL"
echo "5. Run smoke tests on production URLs"
```

---

## Summary of Commands

### Git Setup
```bash
git init
git add .
git commit -m "Initial Legmint setup"
git branch -M main
git remote add origin https://github.com/<USERNAME>/legmint.git
git push -u origin main
```

### Database Setup
```bash
cd api
npm run migration:run
npm run seed
cd ..
```

### Build & Test
```bash
# Backend
cd api
npm install
npm run build
npm run test:e2e
cd ..

# Frontend
cd demo
npm install
npm run build
cd ..
```

### Deploy
```bash
# Backend (Render)
render deploy

# Frontend (Vercel)
cd demo
vercel --prod
cd ..
```

---

## 🚀 You're Ready to Launch!

Your Legmint application is now production-ready with:

- ✅ Version control
- ✅ Secure authentication
- ✅ Database with migrations
- ✅ Payment processing
- ✅ Cloud storage
- ✅ Transactional emails
- ✅ Security hardening
- ✅ Production deployment

**Next milestone**: User acquisition and feedback loop!

---

**Document Version**: 1.0
**Last Updated**: 2025-10-30
**Maintainer**: Legmint Engineering Team
**Support**: support@legmint.com
