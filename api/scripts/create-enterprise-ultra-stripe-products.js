#!/usr/bin/env node
/**
 * Enterprise Ultra Stripe Product & Price Creator
 *
 * This script creates the Enterprise Ultra product and prices in Stripe.
 * It is idempotent - checks if products exist before creating them.
 *
 * HOW TO RUN:
 * -----------
 * 1. Ensure STRIPE_SECRET_KEY is set in your environment:
 *    export STRIPE_SECRET_KEY=sk_test_xxxxx  (for testing)
 *    OR
 *    export STRIPE_SECRET_KEY=sk_live_xxxxx  (for production)
 *
 * 2. Run the script from the /api directory:
 *    node scripts/create-enterprise-ultra-stripe-products.js
 *
 * 3. Alternatively, load from .env file:
 *    node -r dotenv/config scripts/create-enterprise-ultra-stripe-products.js
 *
 * WHAT IT CREATES:
 * ----------------
 * - Product: "LegalMind - Enterprise Ultra"
 * - Monthly Price: €6,500/month
 * - Yearly Price: €71,760/year (8% discount from €78,000)
 *
 * OUTPUT:
 * -------
 * The script outputs the created price IDs that can be added to your .env:
 * - ENTERPRISE_ULTRA_MONTHLY_PRICE_ID
 * - ENTERPRISE_ULTRA_YEARLY_PRICE_ID
 *
 * IDEMPOTENCY:
 * ------------
 * Safe to run multiple times. Checks for existing products/prices before creating.
 */

const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Configuration
const PRODUCT_CONFIG = {
  name: 'LegalMind - Enterprise Ultra',
  description: 'Premium enterprise solution with white-label capabilities, dedicated support, and custom integrations for large organizations',
  type: 'subscription',
  prices: {
    monthly: {
      amount: 650000, // €6,500 in cents
      currency: 'eur',
      interval: 'month',
      nickname: 'Enterprise Ultra - Monthly',
    },
    yearly: {
      amount: 7176000, // €71,760 in cents (8% discount from €78,000)
      currency: 'eur',
      interval: 'year',
      nickname: 'Enterprise Ultra - Yearly (8% discount)',
    },
  },
  features: [
    'White-label solution with custom branding',
    'Unlimited users and document generation',
    'Dedicated account manager and priority support',
    'Custom template development',
    'API access and custom integrations',
    'Advanced analytics and reporting',
    'SLA guarantees and uptime monitoring',
    'Dedicated infrastructure options',
    'Compliance and security certifications',
  ],
  metadata: {
    tier: 'enterprise-ultra',
    plan_type: 'subscription',
    target_market: 'enterprise',
  },
};

/**
 * Validates environment and prerequisites
 */
function validateEnvironment() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('\n❌ ERROR: STRIPE_SECRET_KEY not found in environment variables\n');
    console.error('Please set your Stripe secret key:');
    console.error('  export STRIPE_SECRET_KEY=sk_test_xxxxx\n');
    console.error('Or load from .env file:');
    console.error('  node -r dotenv/config scripts/create-enterprise-ultra-stripe-products.js\n');
    process.exit(1);
  }

  const keyPrefix = process.env.STRIPE_SECRET_KEY.substring(0, 8);
  const isTestMode = keyPrefix.includes('test');

  console.log('\n🔑 Stripe API Key detected:');
  console.log(`   Mode: ${isTestMode ? '🧪 TEST MODE' : '🚀 PRODUCTION MODE'}`);
  console.log(`   Key:  ${keyPrefix}...`);

  return isTestMode;
}

/**
 * Initialize Stripe client
 */
function initializeStripe() {
  try {
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  } catch (error) {
    console.error('\n❌ Failed to initialize Stripe client:', error.message);
    process.exit(1);
  }
}

/**
 * Find or create the Enterprise Ultra product
 */
async function findOrCreateProduct(stripe) {
  console.log('\n' + '='.repeat(70));
  console.log('📦 STEP 1: Finding or Creating Product');
  console.log('='.repeat(70));
  console.log(`\n🔍 Searching for product: "${PRODUCT_CONFIG.name}"...`);

  try {
    // Search for existing product by exact name match
    const existingProducts = await stripe.products.search({
      query: `name:"${PRODUCT_CONFIG.name}" AND active:"true"`,
    });

    if (existingProducts.data.length > 0) {
      const product = existingProducts.data[0];
      console.log(`✅ Found existing product!`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Name: ${product.name}`);
      console.log(`   Created: ${new Date(product.created * 1000).toISOString()}`);
      return product;
    }

    // Product doesn't exist, create it
    console.log('📝 Product not found. Creating new product...');

    const product = await stripe.products.create({
      name: PRODUCT_CONFIG.name,
      description: PRODUCT_CONFIG.description,
      metadata: PRODUCT_CONFIG.metadata,
    });

    console.log(`✅ Successfully created product!`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Created: ${new Date(product.created * 1000).toISOString()}`);

    return product;
  } catch (error) {
    console.error('\n❌ Error finding/creating product:', error.message);
    throw error;
  }
}

/**
 * Find or create a price for the product
 */
async function findOrCreatePrice(stripe, productId, priceConfig, priceName) {
  console.log(`\n🔍 Searching for ${priceName} price...`);

  try {
    // List all active prices for this product
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 100,
    });

    // Find matching price by amount and interval
    const matchingPrice = prices.data.find((price) => {
      return (
        price.type === 'recurring' &&
        price.unit_amount === priceConfig.amount &&
        price.currency === priceConfig.currency &&
        price.recurring?.interval === priceConfig.interval
      );
    });

    if (matchingPrice) {
      console.log(`✅ Found existing ${priceName} price!`);
      console.log(`   ID: ${matchingPrice.id}`);
      console.log(`   Amount: ${(matchingPrice.unit_amount / 100).toLocaleString('en-US', { style: 'currency', currency: matchingPrice.currency.toUpperCase() })}/${matchingPrice.recurring.interval}`);
      console.log(`   Created: ${new Date(matchingPrice.created * 1000).toISOString()}`);
      return matchingPrice;
    }

    // Price doesn't exist, create it
    console.log(`📝 ${priceName} price not found. Creating new price...`);

    const price = await stripe.prices.create({
      product: productId,
      unit_amount: priceConfig.amount,
      currency: priceConfig.currency,
      recurring: {
        interval: priceConfig.interval,
      },
      nickname: priceConfig.nickname,
    });

    console.log(`✅ Successfully created ${priceName} price!`);
    console.log(`   ID: ${price.id}`);
    console.log(`   Amount: ${(price.unit_amount / 100).toLocaleString('en-US', { style: 'currency', currency: price.currency.toUpperCase() })}/${price.recurring.interval}`);
    console.log(`   Created: ${new Date(price.created * 1000).toISOString()}`);

    return price;
  } catch (error) {
    console.error(`\n❌ Error finding/creating ${priceName} price:`, error.message);
    throw error;
  }
}

/**
 * Save results to a JSON file
 */
function saveResults(results, isTestMode) {
  const filename = isTestMode
    ? 'enterprise-ultra-prices-test.json'
    : 'enterprise-ultra-prices.json';

  const outputPath = path.join(__dirname, '..', filename);

  try {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved to: ${outputPath}`);
  } catch (error) {
    console.warn(`\n⚠️  Warning: Could not save results to file: ${error.message}`);
  }
}

/**
 * Display summary and next steps
 */
function displaySummary(results, isTestMode) {
  console.log('\n' + '='.repeat(70));
  console.log('✅ SUCCESS! Enterprise Ultra Product and Prices Created');
  console.log('='.repeat(70));

  console.log('\n📊 SUMMARY:');
  console.log('─'.repeat(70));
  console.log(`Product ID:        ${results.productId}`);
  console.log(`Product Name:      ${PRODUCT_CONFIG.name}`);
  console.log('');
  console.log(`Monthly Price ID:  ${results.prices.monthly.priceId}`);
  console.log(`Monthly Amount:    €6,500/month`);
  console.log('');
  console.log(`Yearly Price ID:   ${results.prices.yearly.priceId}`);
  console.log(`Yearly Amount:     €71,760/year (8% discount)`);
  console.log('─'.repeat(70));

  console.log('\n📋 ENVIRONMENT VARIABLES:');
  console.log('─'.repeat(70));
  console.log('Add these to your .env file:\n');
  console.log(`ENTERPRISE_ULTRA_PRODUCT_ID=${results.productId}`);
  console.log(`ENTERPRISE_ULTRA_MONTHLY_PRICE_ID=${results.prices.monthly.priceId}`);
  console.log(`ENTERPRISE_ULTRA_YEARLY_PRICE_ID=${results.prices.yearly.priceId}`);
  console.log('');

  console.log('🎯 NEXT STEPS:');
  console.log('─'.repeat(70));
  console.log('1. Add the price IDs to your .env file (see above)');
  console.log('2. Update your pricing page to include Enterprise Ultra tier');
  console.log('3. Test checkout flow with the price IDs');
  if (isTestMode) {
    console.log('4. ⚠️  You are in TEST MODE - repeat this process in production!');
  }
  console.log('');

  console.log('💡 PRICING BREAKDOWN:');
  console.log('─'.repeat(70));
  console.log(`Monthly:  €6,500 × 12 months = €78,000/year`);
  console.log(`Yearly:   €71,760/year (€6,240 savings = 8% discount)`);
  console.log('');
}

/**
 * Main execution function
 */
async function main() {
  console.log('\n🚀 Enterprise Ultra Stripe Product Creator');
  console.log('=' .repeat(70));

  // Validate environment
  const isTestMode = validateEnvironment();

  // Initialize Stripe
  const stripe = initializeStripe();

  const results = {
    productId: null,
    prices: {
      monthly: { priceId: null },
      yearly: { priceId: null },
    },
    timestamp: new Date().toISOString(),
    mode: isTestMode ? 'test' : 'production',
  };

  try {
    // Step 1: Create/find product
    const product = await findOrCreateProduct(stripe);
    results.productId = product.id;

    // Step 2: Create/find prices
    console.log('\n' + '='.repeat(70));
    console.log('💰 STEP 2: Finding or Creating Prices');
    console.log('='.repeat(70));

    const monthlyPrice = await findOrCreatePrice(
      stripe,
      product.id,
      PRODUCT_CONFIG.prices.monthly,
      'Monthly'
    );
    results.prices.monthly.priceId = monthlyPrice.id;

    const yearlyPrice = await findOrCreatePrice(
      stripe,
      product.id,
      PRODUCT_CONFIG.prices.yearly,
      'Yearly'
    );
    results.prices.yearly.priceId = yearlyPrice.id;

    // Save results
    saveResults(results, isTestMode);

    // Display summary
    displaySummary(results, isTestMode);

    console.log('✨ Script completed successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ FATAL ERROR');
    console.error('='.repeat(70));
    console.error('\nAn error occurred during execution:');
    console.error(error);

    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 TIP: Check that your STRIPE_SECRET_KEY is correct');
    } else if (error.type === 'StripeConnectionError') {
      console.error('\n💡 TIP: Check your internet connection');
    }

    console.error('\nFor help, visit: https://stripe.com/docs/api\n');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
