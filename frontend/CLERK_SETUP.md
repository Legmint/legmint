# Clerk Authentication Setup - Complete

## ✅ What's Been Configured

Your Legmint frontend now has complete Clerk authentication setup with:

### 1. Dependencies Installed
- `@clerk/nextjs` - Clerk SDK for Next.js

### 2. Environment Configuration
- `.env.local` - Local environment variables (contains your API keys)
- `.env.example` - Example template for team members

### 3. Application Structure
```
frontend/
├── app/
│   ├── layout.tsx              # ✅ Wrapped with ClerkProvider
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx        # ✅ Sign-in page
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx        # ✅ Sign-up page
│   └── dashboard/
│       └── page.tsx            # ✅ Protected dashboard
├── middleware.ts               # ✅ Route protection
├── .env.local                  # ✅ Environment variables
└── package.json                # ✅ Configured for port 3001
```

## 🔑 Getting Your Clerk API Keys

**You need to add your actual Clerk keys to `.env.local`:**

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up or log in
3. Click "Add application" or select existing app
4. Name it: "Legmint"
5. Go to **API Keys** in the left sidebar
6. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

7. Update `frontend/.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
```

## 🚀 Running the Application

### Start the Development Server

```bash
cd frontend
npm run dev
```

The app will run at: **http://localhost:3001**

### Test Authentication Flow

1. **Home Page**: http://localhost:3001
2. **Sign In**: http://localhost:3001/sign-in
3. **Sign Up**: http://localhost:3001/sign-up
4. **Dashboard** (protected): http://localhost:3001/dashboard
   - Will redirect to sign-in if not authenticated
   - Shows user info after login

## 🎨 What Each Page Does

### Sign-In Page (`/sign-in`)
- Beautiful gradient background (indigo to purple)
- Clerk's sign-in component with custom styling
- Links to sign-up page
- Redirects to `/dashboard` after successful sign-in

### Sign-Up Page (`/sign-up`)
- Matches sign-in page design
- Clerk's sign-up component
- Links to sign-in page
- Redirects to `/dashboard` after registration

### Dashboard Page (`/dashboard`)
- **Protected route** - requires authentication
- Displays user information (name, email)
- Shows stats: templates generated, active plan, credits
- Quick action buttons for common templates
- User button (profile menu) in header with sign-out option

## 🔒 How Authentication Works

### Middleware (`middleware.ts`)
Protects routes automatically. Public routes:
- `/` (home)
- `/sign-in`
- `/sign-up`
- `/pricing`
- `/templates`
- `/about`
- `/contact`

All other routes (like `/dashboard`) require authentication.

### Layout (`app/layout.tsx`)
Wraps entire app with `<ClerkProvider>`, making auth available everywhere.

### Protected Pages
Use these helpers to check auth status:
```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

// In server components
const { userId } = await auth();
const user = await currentUser();
```

## 🔗 Backend Integration

To connect this frontend with your NestJS backend at `http://localhost:3000`:

1. The API URL is already configured in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
```

2. To make authenticated API calls:
```typescript
import { auth } from '@clerk/nextjs/server';

const { getToken } = await auth();
const token = await getToken();

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

3. **Backend Setup Required**: Your NestJS API needs the Clerk guard from the pre-deployment guide (`docs/LEGMINT_PREDEPLOYMENT_READINESS.md` - Step 2.9)

## 📦 Next Steps

1. **Get Clerk API Keys** (see above)
2. **Start the dev server**: `npm run dev`
3. **Test sign-up flow**: Create a test account
4. **Test protected route**: Try accessing `/dashboard` before/after login
5. **Connect to backend**: Set up the Clerk guard in your NestJS API

## 🎯 Features Included

- ✅ Email/password authentication
- ✅ Social login (Google, GitHub, etc.) - configured in Clerk Dashboard
- ✅ Session management
- ✅ Protected routes
- ✅ User profile management
- ✅ Sign out functionality
- ✅ Responsive design
- ✅ Custom branded styling

## 🐛 Troubleshooting

### "Invalid publishable key"
- Make sure you added your actual Clerk keys to `.env.local`
- Restart the dev server after updating `.env.local`

### Redirect loop
- Check that your Clerk Dashboard URLs match:
  - Sign-in URL: `/sign-in`
  - Sign-up URL: `/sign-up`
  - Redirect URL after sign-in: `/dashboard`

### Port already in use
- Backend might be running on 3001
- Change frontend port in `package.json` or stop other services

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Legmint Pre-Deployment Guide](../docs/LEGMINT_PREDEPLOYMENT_READINESS.md)

---

**Setup completed on**: 2025-10-30
**Next.js version**: 14.2.33
**Clerk SDK version**: 6.34.1
