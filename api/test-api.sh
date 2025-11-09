#!/bin/bash

# LegalMind API Test Script
# Tests all available endpoints

BASE_URL="http://localhost:3000"

echo "🧪 Testing LegalMind API"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4

  echo -n "Testing $name... "

  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    # echo "$body" | jq '.' 2>/dev/null || echo "$body"
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    echo "$body"
  fi
  echo ""
}

# Health Check
echo "📊 Health & Status"
echo "---"
test_endpoint "Health Check" "GET" "/v1/health"

# Packs
echo "📦 Packs"
echo "---"
test_endpoint "List Packs" "GET" "/v1/packs"
test_endpoint "Get Fundraising Pack" "GET" "/v1/packs/fundraising"

# Templates
echo "📄 Templates"
echo "---"
test_endpoint "List Templates" "GET" "/v1/templates"
test_endpoint "List Templates (Fundraising)" "GET" "/v1/templates?pack=fundraising"

# Questionnaires
echo "📋 Questionnaires"
echo "---"
test_endpoint "Get Questionnaire" "GET" "/v1/questionnaire/fundraising/SAFE_PM_V1"

# Users
echo "👤 Users"
echo "---"
test_endpoint "Get Current User" "GET" "/v1/users/me"
test_endpoint "Get Usage Stats" "GET" "/v1/users/me/usage"

# Purchase
echo "💳 Purchase"
echo "---"
test_endpoint "Get Subscription" "GET" "/v1/subscription"

purchase_data='{
  "plan": "pro",
  "pack": "fundraising",
  "successUrl": "http://localhost:3001/dashboard",
  "cancelUrl": "http://localhost:3001/packs"
}'
test_endpoint "Create Checkout Session" "POST" "/v1/purchase" "$purchase_data"

# Generation (these may fail without proper setup)
echo "🎨 Generation (may require S3 setup)"
echo "---"

preview_data='{
  "templateCode": "SAFE_PM_V1",
  "jurisdiction": "UK",
  "answers": {
    "company_name": "Test Company Ltd",
    "investor_name": "Test Investor"
  }
}'
test_endpoint "Generate Preview" "POST" "/v1/preview" "$preview_data"

generate_data='{
  "templateCode": "SAFE_PM_V1",
  "jurisdiction": "UK",
  "answers": {
    "company_name": "Test Company Ltd",
    "investor_name": "Test Investor"
  },
  "formats": ["pdf"]
}'
test_endpoint "Generate Document" "POST" "/v1/generate" "$generate_data"

echo "================================"
echo "✅ Testing complete!"
echo ""
echo "📚 For more details, see:"
echo "   - API_TESTING_GUIDE.md"
echo "   - http://localhost:3000/api-docs (Swagger)"
