/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // i18n support - for App Router, we handle this via middleware and client-side
  // Supported locales: en (English), de (German), cs (Czech)
  experimental: {
    // Enable any experimental features needed for i18n
  },
};

export default nextConfig;
