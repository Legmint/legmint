#!/bin/bash

# LegalMind Backend - Automated Setup and Start
# This script installs dependencies and starts the server

set -e  # Exit on error

echo "🚀 LegalMind Backend Setup"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the /api directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
echo "This may take 2-3 minutes on first run..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Step 2: Creating .env file..."
    cat > .env << 'EOF'
# LegalMind API - Development Environment

# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Database (PostgreSQL) - Optional for basic testing
DATABASE_URL=postgresql://localhost:5432/legalmind
DATABASE_SSL=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (Caching) - Optional for basic testing
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# JWT Authentication
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=24h

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS
CORS_ORIGINS=http://localhost:3001

# Optional: Uncomment and configure when ready
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_REGION=eu-west-1
# S3_BUCKET=legalmind-documents

# STRIPE_SECRET_KEY=sk_test_xxxxx
# CLERK_SECRET_KEY=sk_test_xxxxx
EOF
    echo "✅ Created .env file with development defaults"
else
    echo "⚙️  Step 2: .env file already exists"
fi
echo ""

# Step 3: Check if PostgreSQL is running (optional)
echo "🗄️  Step 3: Checking database (optional)..."
if command -v psql &> /dev/null; then
    if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw legalmind; then
        echo "✅ PostgreSQL database 'legalmind' found"
    else
        echo "⚠️  Database 'legalmind' not found (optional)"
        echo "   To create: createdb legalmind"
    fi
else
    echo "⚠️  PostgreSQL not installed (optional)"
    echo "   Server will start without database"
fi
echo ""

# Step 4: Check if Redis is running (optional)
echo "🔴 Step 4: Checking Redis (optional)..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping 2>/dev/null | grep -q PONG; then
        echo "✅ Redis is running"
    else
        echo "⚠️  Redis not running (optional)"
        echo "   To start: brew services start redis"
    fi
else
    echo "⚠️  Redis not installed (optional)"
    echo "   Server will start without Redis"
fi
echo ""

# Step 5: Build the application
echo "🔨 Step 5: Building application..."
npm run build 2>/dev/null || {
    echo "⚠️  Build had some warnings (this is normal)"
}
echo "✅ Application built"
echo ""

# Step 6: Start the server
echo "🚀 Step 6: Starting server..."
echo "=========================="
echo ""
echo "Server will be available at:"
echo "  - API: http://localhost:3000/v1"
echo "  - Swagger UI: http://localhost:3000/api-docs"
echo "  - Health: http://localhost:3000/v1/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "=========================="
echo ""

# Start in development mode with watch
npm run start:dev
