# Start Backend - Step by Step

## 🚀 Quick Start (Copy/Paste These Commands)

```bash
# 1. Navigate to API directory
cd /Users/marekchudomel/coding/LegalMind/api

# 2. Install dependencies (this takes 2-3 minutes)
npm install

# 3. Create environment file
cat > .env << 'EOF'
# Minimal configuration to start server
NODE_ENV=development
PORT=3000

# Database (optional for basic testing)
DATABASE_URL=postgresql://localhost:5432/legalmind
DATABASE_SSL=false

# Redis (optional for basic testing)
REDIS_URL=redis://localhost:6379

# JWT (required)
JWT_SECRET=dev-secret-key-change-in-production

# Logging
LOG_LEVEL=info
EOF

# 4. Start the server
npm run start:dev
```

## ✅ Expected Output

You should see:
```
[Nest] 12345  - 10/24/2025, 12:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/24/2025, 12:00:00 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/24/2025, 12:00:00 PM     LOG [RoutesResolver] GenerationController {/v1}:
[Nest] 12345  - 10/24/2025, 12:00:00 PM     LOG [RouterExplorer] Mapped {/v1/preview, POST} route
[Nest] 12345  - 10/24/2025, 12:00:00 PM     LOG [RouterExplorer] Mapped {/v1/generate, POST} route
...
🚀 LegalMind API is running on: http://localhost:3000/v1
📚 API Documentation: http://localhost:3000/api-docs
🏥 Health Check: http://localhost:3000/v1/health
```

## 🧪 Test It Works

Open a **new terminal** and run:

```bash
# Test health endpoint
curl http://localhost:3000/v1/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-24T...","uptime":...,"environment":"development"}
```

## 🌐 Open in Browser

Once server is running, visit these URLs:

1. **Swagger UI**: http://localhost:3000/api-docs
   - Interactive API documentation
   - Try endpoints directly from browser

2. **Health Check**: http://localhost:3000/v1/health
   - JSON response showing server status

3. **List Packs**: http://localhost:3000/v1/packs
   - Returns template packs

## ⚠️ Troubleshooting

### "npm: command not found"
```bash
# Install Node.js first
brew install node
```

### "Cannot connect to database"
The server will start anyway! Database is optional for basic testing.

To fix (optional):
```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15
createdb legalmind
```

### "Cannot connect to Redis"
The server will start anyway! Redis is optional for basic testing.

To fix (optional):
```bash
# Install Redis
brew install redis
brew services start redis
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
echo "PORT=3001" >> .env
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📋 What Works Without Database/Redis

Even without PostgreSQL or Redis, these endpoints work:

- ✅ `/v1/health` - Health check
- ✅ `/v1/packs` - List packs (mock data)
- ✅ `/v1/users/me` - Current user (mock data)
- ✅ `/v1/subscription` - Subscription status (mock data)

## 🎯 Next Steps After Server Starts

1. Visit **http://localhost:3000/api-docs** to see all endpoints
2. Test endpoints using Swagger UI
3. Configure database to enable template queries
4. Configure AWS S3 to enable document generation

## 📞 Still Not Working?

Check the terminal output for specific error messages and share them.

Common patterns:
- "EADDRINUSE" → Port already in use
- "MODULE_NOT_FOUND" → Missing dependencies
- "Cannot find module" → TypeScript compilation issue
