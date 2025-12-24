#!/usr/bin/env ts-node
/**
 * Stripe Product & Price Seeder
 *
 * This script idempotently creates Legmint products and prices in Stripe.
 * Run with: npm run stripe:seed
 *
 * Creates:
 * - Legmint – Pro (Monthly) - €99/month
 * - Legmint – Pro (Yearly) - €1,008.60/year (15% discount)
 *
 * Outputs price IDs to stripe.prices.json for easy reference.
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface ProductConfig {
  name: string;
  description: string;
  type: 'one-time' | 'subscription';
  price: {
    amount: number; // in cents
    currency: string;
    interval?: 'month' | 'year';
  };
  features?: string[];
}

const PRODUCTS: Record<string, ProductConfig> = {
  'pro-monthly': {
    name: 'Legmint – Pro (Monthly)',
    description: 'Monthly subscription for startups - full access to all templates',
    type: 'subscription',
    price: {
      amount: 9900, // €99/month
      currency: 'eur',
      interval: 'month',
    },
    features: [
      'Full access to all templates (UK, DE, CZ, US-DE, US-CA)',
      'Unlimited document generation and downloads',
      'Multilingual templates (EN, DE, CS)',
      'Auto-updates when laws change',
      'Access to verified lawyer referral network',
      'Early access to new template categories',
    ],
  },
  'pro-yearly': {
    name: 'Legmint – Pro (Yearly)',
    description: 'Yearly subscription for startups - save 15% compared to monthly',
    type: 'subscription',
    price: {
      amount: 100860, // €1,008.60/year (99 * 12 * 0.85)
      currency: 'eur',
      interval: 'year',
    },
    features: [
      'Full access to all templates (UK, DE, CZ, US-DE, US-CA)',
      'Unlimited document generation and downloads',
      'Multilingual templates (EN, DE, CS)',
      'Auto-updates when laws change',
      'Access to verified lawyer referral network',
      'Early access to new template categories',
      'Save 15% vs monthly billing',
    ],
  },
};

async function findOrCreateProduct(
  key: string,
  config: ProductConfig,
): Promise<Stripe.Product> {
  console.log(`\n🔍 Checking for existing product: ${config.name}...`);

  // Search for existing product by name
  const existingProducts = await stripe.products.search({
    query: `name:"${config.name}" AND active:"true"`,
  });

  if (existingProducts.data.length > 0) {
    const product = existingProducts.data[0];
    console.log(`✅ Found existing product: ${product.id}`);
    return product;
  }

  // Create new product
  console.log(`📦 Creating new product: ${config.name}...`);
  const product = await stripe.products.create({
    name: config.name,
    description: config.description,
    metadata: {
      key,
      type: config.type,
    },
  });

  console.log(`✅ Created product: ${product.id}`);
  return product;
}

async function findOrCreatePrice(
  productId: string,
  config: ProductConfig,
): Promise<Stripe.Price> {
  console.log(`🔍 Checking for existing price...`);

  // Search for active prices for this product
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
  });

  // Find matching price
  const matchingPrice = prices.data.find((price) => {
    if (config.type === 'one-time') {
      return (
        price.type === 'one_time' &&
        price.unit_amount === config.price.amount &&
        price.currency === config.price.currency
      );
    } else {
      return (
        price.type === 'recurring' &&
        price.unit_amount === config.price.amount &&
        price.currency === config.price.currency &&
        price.recurring?.interval === config.price.interval
      );
    }
  });

  if (matchingPrice) {
    console.log(`✅ Found existing price: ${matchingPrice.id}`);
    return matchingPrice;
  }

  // Create new price
  console.log(`💰 Creating new price...`);
  const priceData: Stripe.PriceCreateParams = {
    product: productId,
    unit_amount: config.price.amount,
    currency: config.price.currency,
  };

  if (config.type === 'subscription') {
    priceData.recurring = {
      interval: config.price.interval!,
    };
  }

  const price = await stripe.prices.create(priceData);
  console.log(`✅ Created price: ${price.id}`);
  return price;
}

async function main() {
  console.log('🚀 Starting Stripe Product & Price Seeder...\n');
  console.log('='.repeat(60));

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY not found in .env file');
    console.error('Please add your Stripe secret key to /api/.env');
    process.exit(1);
  }

  const results: Record<string, { productId: string; priceId: string }> = {};

  try {
    for (const [key, config] of Object.entries(PRODUCTS)) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${key.toUpperCase()}`);
      console.log('='.repeat(60));

      const product = await findOrCreateProduct(key, config);
      const price = await findOrCreatePrice(product.id, config);

      results[key] = {
        productId: product.id,
        priceId: price.id,
      };

      console.log(`\n✨ ${key.toUpperCase()} Summary:`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Price ID:   ${price.id}`);
      console.log(
        `   Amount:     ${config.price.currency.toUpperCase()} ${(config.price.amount / 100).toFixed(2)}${config.type === 'subscription' ? `/${config.price.interval}` : ''}`,
      );
    }

    // Write results to file
    const outputPath = path.join(__dirname, '../stripe.prices.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ SEED COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📄 Price IDs saved to: ${outputPath}\n`);

    console.log('📋 Quick Reference:');
    console.log('─'.repeat(60));
    Object.entries(results).forEach(([key, ids]) => {
      console.log(`${key.toUpperCase()}_PRICE_ID=${ids.priceId}`);
    });
    console.log('\n💡 Add these to your .env file if needed.\n');

    console.log('🎯 Next Steps:');
    console.log('   1. Test checkout with these price IDs');
    console.log('   2. Set up webhook endpoint');
    console.log('   3. Run: stripe listen --forward-to http://localhost:3000/webhooks/stripe');
    console.log('');
  } catch (error) {
    console.error('\n❌ Error during seed:', error);
    process.exit(1);
  }
}

// Run the seeder
main();
