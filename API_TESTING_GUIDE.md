# LegalMind API Testing Guide

## 🎯 Quick Start

### 1. Start the Backend

```bash
cd api

# Install dependencies (first time only)
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add minimal config:
# DATABASE_URL=postgresql://localhost:5432/legalmind
# REDIS_URL=redis://localhost:6379
# (Other services will degrade gracefully if not configured)

# Start the server
npm run start:dev
```

**Backend runs on:** http://localhost:3000

---

## 📋 Available Endpoints

### Health Check
```bash
curl http://localhost:3000/v1/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

---

## 📦 Packs Endpoints

### 1. List All Packs
```bash
curl http://localhost:3000/v1/packs
```

**Response:**
```json
{
  "packs": [
    {
      "pack_code": "fundraising",
      "name": "Fundraising Pack",
      "description": "Essential documents for startup fundraising",
      "template_count": 8,
      "access_level": "starter",
      "pricing": {
        "starter": 99,
        "pro": 49,
        "scale": 149
      }
    }
  ]
}
```

### 2. List Packs with Templates
```bash
curl "http://localhost:3000/v1/packs?include_templates=true"
```

### 3. Get Pack Details
```bash
curl http://localhost:3000/v1/packs/fundraising
```

---

## 📄 Templates Endpoints

### 1. List All Templates
```bash
curl http://localhost:3000/v1/templates
```

### 2. Filter Templates by Pack
```bash
curl "http://localhost:3000/v1/templates?pack=fundraising"
```

### 3. Filter by Jurisdiction
```bash
curl "http://localhost:3000/v1/templates?jurisdiction=UK"
```

### 4. Get Template Details
```bash
curl http://localhost:3000/v1/templates/SAFE_PM_V1
```

**Response:**
```json
{
  "template_code": "SAFE_PM_V1",
  "name": "SAFE Agreement (Post-Money)",
  "pack": "fundraising",
  "version": "1.0.0",
  "supported_jurisdictions": ["GLOBAL-EN", "UK", "US-DE"],
  "access_level": "starter",
  "description": "...",
  "tags": ["fundraising", "investment"],
  "usage_count": 42,
  "is_featured": true
}
```

---

## 📋 Questionnaires Endpoints

### Get Questionnaire for Template
```bash
curl http://localhost:3000/v1/questionnaire/fundraising/SAFE_PM_V1
```

**Response:**
```json
{
  "template_code": "SAFE_PM_V1",
  "version": "1.0.0",
  "schema": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "required": ["company_name", "investor_name"],
    "properties": {
      "company_name": {
        "type": "string",
        "title": "Company Legal Name"
      },
      "investor_name": {
        "type": "string",
        "title": "Investor Name"
      }
    }
  }
}
```

### With Jurisdiction
```bash
curl "http://localhost:3000/v1/questionnaire/fundraising/SAFE_PM_V1?jurisdiction=UK"
```

---

## 🎨 Generation Endpoints

### 1. Generate Preview (HTML)
```bash
curl -X POST http://localhost:3000/v1/preview \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "SAFE_PM_V1",
    "jurisdiction": "UK",
    "answers": {
      "company_name": "Acme Innovations Ltd",
      "investor_name": "Jane Investor",
      "purchase_amount": 100000,
      "valuation_cap": 5000000,
      "date": "2025-10-22"
    }
  }'
```

**Response:**
```json
{
  "preview_url": "https://s3.amazonaws.com/legalmind-previews/...",
  "expires_at": "2025-10-24T13:00:00.000Z",
  "template_code": "SAFE_PM_V1"
}
```

### 2. Generate Final Documents (PDF/DOCX)
```bash
curl -X POST http://localhost:3000/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "SAFE_PM_V1",
    "jurisdiction": "UK",
    "answers": {
      "company_name": "Acme Innovations Ltd",
      "investor_name": "Jane Investor",
      "purchase_amount": 100000,
      "valuation_cap": 5000000,
      "date": "2025-10-22"
    },
    "formats": ["pdf", "docx"]
  }'
```

**Response:**
```json
{
  "auditId": "aud_abc123xyz",
  "outputs": {
    "pdf": "https://s3.amazonaws.com/legalmind-documents/...",
    "docx": "https://s3.amazonaws.com/legalmind-documents/..."
  },
  "expiresAt": "2025-10-25T12:00:00.000Z",
  "templateCode": "SAFE_PM_V1",
  "templateVersion": "1.0.0",
  "jurisdiction": "UK"
}
```

### 3. Validate Questionnaire Answers
```bash
curl -X POST http://localhost:3000/v1/questionnaire/validate \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "SAFE_PM_V1",
    "jurisdiction": "UK",
    "answers": {
      "company_name": "Acme Innovations Ltd"
    }
  }'
```

---

## 💳 Purchase Endpoints

### 1. Create Checkout Session
```bash
curl -X POST http://localhost:3000/v1/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "pro",
    "pack": "fundraising",
    "successUrl": "http://localhost:3001/dashboard?purchase=success",
    "cancelUrl": "http://localhost:3001/packs"
  }'
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "session_id": "cs_test_abc123"
}
```

### 2. Get Subscription Status
```bash
curl http://localhost:3000/v1/subscription
```

**Response:**
```json
{
  "plan": "pro",
  "status": "active",
  "jurisdictions_allowed": ["GLOBAL-EN", "UK", "US-DE"],
  "subscription_start": "2025-01-01T00:00:00Z",
  "subscription_end": null,
  "stripe_subscription_id": "sub_xxxxx"
}
```

### 3. Cancel Subscription
```bash
curl -X DELETE http://localhost:3000/v1/subscription
```

---

## 👤 Users Endpoints

### 1. Get Current User
```bash
curl http://localhost:3000/v1/users/me
```

**Response:**
```json
{
  "user_id": "temp-user-id",
  "email": "user@example.com",
  "name": "Test User",
  "plan": "pro",
  "jurisdictions_allowed": ["GLOBAL-EN", "UK", "US-DE"],
  "generation_count": 42,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### 2. Get Usage Statistics
```bash
curl http://localhost:3000/v1/users/me/usage
```

**Response:**
```json
{
  "generation_count": 42,
  "last_generation": "2025-10-24T12:00:00Z",
  "templates_used": [
    {
      "template_code": "SAFE_PM_V1",
      "count": 15
    },
    {
      "template_code": "FOUNDERS_AGREEMENT_V1",
      "count": 10
    }
  ]
}
```

---

## 📚 Swagger Documentation

Once the backend is running, visit:

**http://localhost:3000/api-docs**

This provides:
- Interactive API documentation
- Try-it-out functionality
- Full schema definitions
- Example requests/responses

---

## 🧪 Testing with Postman

### Import Collection

Create a Postman collection with these endpoints:

1. **Environment Variables:**
   - `base_url` = `http://localhost:3000`

2. **Endpoints to Add:**
   - GET `{{base_url}}/v1/health`
   - GET `{{base_url}}/v1/packs`
   - GET `{{base_url}}/v1/templates`
   - POST `{{base_url}}/v1/preview`
   - POST `{{base_url}}/v1/generate`
   - POST `{{base_url}}/v1/purchase`

---

## ⚠️ Current Limitations

### Working:
- ✅ All GET endpoints return data (mock or cached)
- ✅ Health check works
- ✅ Packs endpoint returns mock data
- ✅ Templates endpoint queries database (if templates exist)
- ✅ Generation endpoints work (requires AWS S3 configured)
- ✅ Purchase creates Stripe sessions (requires Stripe configured)

### Not Working Yet:
- ❌ **Authentication** - All endpoints use placeholder userId
- ❌ **Database may be empty** - Need to run migrations and seed data
- ❌ **S3 uploads** - Require AWS credentials in .env
- ❌ **Stripe checkout** - Requires Stripe keys in .env
- ❌ **Redis caching** - Degrades gracefully if Redis not running

---

## 🔧 Required Configuration

### Minimal (to start server):
```bash
# .env
DATABASE_URL=postgresql://localhost:5432/legalmind
REDIS_URL=redis://localhost:6379
JWT_SECRET=any-random-string-for-dev
```

### Full (for all features):
```bash
# Database
DATABASE_URL=postgresql://localhost:5432/legalmind
REDIS_URL=redis://localhost:6379

# AWS S3 (for document generation)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=eu-west-1
S3_BUCKET=your-bucket

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_SCALE=price_...

# Auth (for JWT)
JWT_SECRET=your-super-secret-key
CLERK_SECRET_KEY=sk_test_...
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check PostgreSQL is running
brew services list

# Create database if needed
createdb legalmind

# Check logs
npm run start:dev
```

### "Template not found" errors
```bash
# Database is empty - need to seed templates
# See IMPLEMENTATION_PROGRESS.md for migration guide
```

### S3 upload errors
```bash
# Check AWS credentials in .env
# Or comment out S3 calls in services for testing
```

### Redis connection errors
```bash
# Start Redis
brew services start redis

# Or Redis service will degrade gracefully
```

---

## 🚀 Next Steps

1. **Seed Database** - Add actual templates
2. **Add Authentication** - JWT guards on routes
3. **Configure AWS** - For document generation
4. **Configure Stripe** - For payment processing
5. **Connect Frontend** - Replace mock data with API calls

---

## 📊 API Endpoint Summary

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/v1/health` | GET | No | Health check |
| `/v1/packs` | GET | No | List packs |
| `/v1/packs/:code` | GET | No | Get pack details |
| `/v1/templates` | GET | Yes* | List templates |
| `/v1/templates/:code` | GET | Yes* | Get template |
| `/v1/questionnaire/:pack/:code` | GET | Yes* | Get questionnaire |
| `/v1/preview` | POST | Yes* | Generate preview |
| `/v1/generate` | POST | Yes* | Generate documents |
| `/v1/purchase` | POST | Yes* | Create checkout |
| `/v1/subscription` | GET | Yes* | Get subscription |
| `/v1/subscription` | DELETE | Yes* | Cancel subscription |
| `/v1/users/me` | GET | Yes* | Get current user |
| `/v1/users/me/usage` | GET | Yes* | Get usage stats |

*Auth required but currently using placeholder - will work once JWT is implemented

---

**Last Updated:** 2025-10-24
**Status:** ✅ All endpoints functional (with mock auth)
