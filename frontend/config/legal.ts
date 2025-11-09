/**
 * Legal & Company Configuration
 *
 * Centralized settings for all legal pages (Refund Policy, Terms, Privacy).
 * Update these values with your actual company details before deployment.
 */

export const LEGAL = {
  // Company Identity
  companyName: "Legmint s.r.o.",
  companyNumber: "#######", // Optional: Company registration number
  registeredAddress: "Street, City, Country, ZIP", // UPDATE with actual registered address

  // Contact Information
  contactEmail: "hello@legmint.com",
  supportEmail: "support@legmint.com",
  dpoEmail: "privacy@legmint.com", // Data Protection Officer (can be same as contact)
  consumerRefundEmail: "support@legmint.com",

  // Jurisdiction & Legal Framework
  governingLaw: "Czech Republic", // Choose: "Czech Republic", "England and Wales", "Delaware", etc.
  disputeVenue: "Prague, Czech Republic", // Where disputes will be resolved

  // Refund Policy Settings
  refundWindowHours: 24, // Time window for refund requests after failed/duplicate charges

  // Data Processors (displayed on Privacy Policy page)
  processors: [
    {
      name: "Stripe",
      purpose: "Payment processing and subscription management",
      location: "US (Standard Contractual Clauses)"
    },
    {
      name: "Clerk",
      purpose: "Authentication and user account management",
      location: "US (Standard Contractual Clauses)"
    },
    {
      name: "AWS S3",
      purpose: "Secure document storage (encrypted at rest)",
      location: "EU region"
    },
    {
      name: "SendGrid",
      purpose: "Transactional email delivery",
      location: "US (Standard Contractual Clauses)"
    },
    {
      name: "Vercel",
      purpose: "Frontend hosting and content delivery",
      location: "Global CDN"
    },
    {
      name: "Render",
      purpose: "Backend API hosting",
      location: "EU region"
    }
  ],

  // Jurisdictions Supported (for context in legal docs)
  supportedJurisdictions: [
    "United Kingdom",
    "Germany",
    "Czech Republic",
    "United States (Delaware)",
    "United States (California)"
  ],

  // Last Updated Dates (update when you modify legal pages)
  lastUpdated: {
    refundPolicy: "2025-11-09",
    termsOfService: "2025-11-09",
    privacyPolicy: "2025-11-09"
  }
} as const;

// Helper function to format company name with legal entity
export const getFullCompanyName = () => LEGAL.companyName;

// Helper function to get primary contact email
export const getContactEmail = () => LEGAL.contactEmail;

// Helper function to format refund window
export const getRefundWindowText = () => {
  const hours = LEGAL.refundWindowHours;
  if (hours === 24) return "24 hours";
  if (hours < 24) return `${hours} hours`;
  return `${Math.floor(hours / 24)} days`;
};
